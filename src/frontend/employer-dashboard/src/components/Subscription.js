/**
 * Subscription Management Core Module
 * 
 * Handles the core subscription management functionality for the
 * Ojalá Healthcare Platform, including subscription creation,
 * modification, cancellation, and lifecycle management.
 */

class SubscriptionManager {
  constructor(options = {}) {
    this.options = {
      defaultTrialDays: 14,
      gracePeriodDays: 3,
      autoRenew: true,
      prorationEnabled: true,
      ...options
    };
    
    // Dependencies will be injected
    this.paymentService = null;
    this.billingService = null;
    this.planService = null;
    this.notificationService = null;
    this.dataStore = null;
    this.logger = null;
  }
  
  /**
   * Initialize the subscription manager with dependencies
   * 
   * @param {Object} dependencies - Service dependencies
   */
  initialize(dependencies) {
    const { 
      paymentService, 
      billingService, 
      planService, 
      notificationService,
      dataStore,
      logger
    } = dependencies;
    
    this.paymentService = paymentService;
    this.billingService = billingService;
    this.planService = planService;
    this.notificationService = notificationService;
    this.dataStore = dataStore;
    this.logger = logger;
    
    this._log('info', 'Subscription manager initialized');
    
    // Schedule recurring jobs
    this._scheduleRecurringJobs();
  }
  
  /**
   * Create a new subscription
   * 
   * @param {Object} params - Subscription parameters
   * @param {string} params.organizationId - Organization ID
   * @param {string} params.planId - Plan ID
   * @param {number} params.quantity - Number of seats/licenses
   * @param {string} params.paymentMethodId - Payment method ID
   * @param {boolean} params.startTrial - Whether to start with trial
   * @param {Object} params.billingAddress - Billing address
   * @param {Object} params.metadata - Additional metadata
   * @returns {Promise<Object>} Created subscription
   */
  async createSubscription(params) {
    try {
      const {
        organizationId,
        planId,
        quantity = 1,
        paymentMethodId,
        startTrial = false,
        billingAddress,
        metadata = {}
      } = params;
      
      // Validate required parameters
      if (!organizationId) throw new Error('Organization ID is required');
      if (!planId) throw new Error('Plan ID is required');
      
      // Get plan details
      const plan = await this.planService.getPlan(planId);
      if (!plan) throw new Error(`Plan not found: ${planId}`);
      
      // Check if organization already has an active subscription
      const existingSubscription = await this.getActiveSubscription(organizationId);
      if (existingSubscription) {
        throw new Error('Organization already has an active subscription');
      }
      
      // Calculate billing amounts
      const baseAmount = plan.price * quantity;
      const taxAmount = await this._calculateTax(baseAmount, billingAddress);
      const totalAmount = baseAmount + taxAmount;
      
      // Determine subscription start and end dates
      const now = new Date();
      let startDate = now;
      let trialEndDate = null;
      
      if (startTrial && plan.trialEnabled) {
        const trialDays = plan.trialDays || this.options.defaultTrialDays;
        trialEndDate = new Date(now);
        trialEndDate.setDate(trialEndDate.getDate() + trialDays);
      }
      
      // Determine billing cycle
      const billingCycle = plan.billingCycle || 'monthly';
      const endDate = this._calculateEndDate(startDate, billingCycle);
      
      // Create subscription record
      const subscription = {
        id: this._generateSubscriptionId(),
        organizationId,
        planId,
        planName: plan.name,
        quantity,
        status: startTrial ? 'trialing' : 'active',
        startDate,
        endDate,
        trialEndDate,
        billingCycle,
        autoRenew: this.options.autoRenew,
        baseAmount,
        taxAmount,
        totalAmount,
        currency: plan.currency || 'USD',
        paymentMethodId,
        billingAddress,
        metadata,
        createdAt: now,
        updatedAt: now
      };
      
      // Store subscription in database
      const createdSubscription = await this.dataStore.createSubscription(subscription);
      
      // If not in trial, process initial payment
      if (!startTrial) {
        await this._processInitialPayment(createdSubscription);
      }
      
      // Send notifications
      await this._sendSubscriptionNotifications('created', createdSubscription);
      
      this._log('info', 'Subscription created', {
        subscriptionId: createdSubscription.id,
        organizationId,
        planId,
        status: createdSubscription.status
      });
      
      return createdSubscription;
    } catch (error) {
      this._log('error', 'Failed to create subscription', {
        error: error.message,
        organizationId: params.organizationId,
        planId: params.planId
      });
      
      throw error;
    }
  }
  
  /**
   * Get subscription by ID
   * 
   * @param {string} subscriptionId - Subscription ID
   * @returns {Promise<Object>} Subscription
   */
  async getSubscription(subscriptionId) {
    try {
      if (!subscriptionId) throw new Error('Subscription ID is required');
      
      const subscription = await this.dataStore.getSubscription(subscriptionId);
      
      if (!subscription) {
        throw new Error(`Subscription not found: ${subscriptionId}`);
      }
      
      return subscription;
    } catch (error) {
      this._log('error', 'Failed to get subscription', {
        error: error.message,
        subscriptionId
      });
      
      throw error;
    }
  }
  
  /**
   * Get active subscription for organization
   * 
   * @param {string} organizationId - Organization ID
   * @returns {Promise<Object>} Active subscription or null
   */
  async getActiveSubscription(organizationId) {
    try {
      if (!organizationId) throw new Error('Organization ID is required');
      
      const subscriptions = await this.dataStore.getSubscriptionsByOrganization(
        organizationId,
        { status: ['active', 'trialing', 'past_due'] }
      );
      
      return subscriptions.length > 0 ? subscriptions[0] : null;
    } catch (error) {
      this._log('error', 'Failed to get active subscription', {
        error: error.message,
        organizationId
      });
      
      throw error;
    }
  }
  
  /**
   * Get all subscriptions for organization
   * 
   * @param {string} organizationId - Organization ID
   * @returns {Promise<Array>} Subscriptions
   */
  async getSubscriptionHistory(organizationId) {
    try {
      if (!organizationId) throw new Error('Organization ID is required');
      
      return await this.dataStore.getSubscriptionsByOrganization(organizationId);
    } catch (error) {
      this._log('error', 'Failed to get subscription history', {
        error: error.message,
        organizationId
      });
      
      throw error;
    }
  }
  
  /**
   * Update subscription
   * 
   * @param {string} subscriptionId - Subscription ID
   * @param {Object} updates - Subscription updates
   * @returns {Promise<Object>} Updated subscription
   */
  async updateSubscription(subscriptionId, updates) {
    try {
      if (!subscriptionId) throw new Error('Subscription ID is required');
      if (!updates) throw new Error('Updates are required');
      
      // Get current subscription
      const subscription = await this.getSubscription(subscriptionId);
      
      // Check if subscription can be updated
      if (['canceled', 'expired'].includes(subscription.status)) {
        throw new Error(`Cannot update subscription with status: ${subscription.status}`);
      }
      
      // Prepare updates
      const allowedUpdates = [
        'quantity',
        'autoRenew',
        'paymentMethodId',
        'billingAddress',
        'metadata'
      ];
      
      const validUpdates = {};
      for (const key of allowedUpdates) {
        if (updates[key] !== undefined) {
          validUpdates[key] = updates[key];
        }
      }
      
      validUpdates.updatedAt = new Date();
      
      // Handle quantity change
      if (updates.quantity !== undefined && updates.quantity !== subscription.quantity) {
        // Get plan details
        const plan = await this.planService.getPlan(subscription.planId);
        if (!plan) throw new Error(`Plan not found: ${subscription.planId}`);
        
        // Calculate new amounts
        const baseAmount = plan.price * updates.quantity;
        const taxAmount = await this._calculateTax(baseAmount, updates.billingAddress || subscription.billingAddress);
        const totalAmount = baseAmount + taxAmount;
        
        // Add to updates
        validUpdates.baseAmount = baseAmount;
        validUpdates.taxAmount = taxAmount;
        validUpdates.totalAmount = totalAmount;
        
        // Handle proration if enabled
        if (this.options.prorationEnabled && subscription.status === 'active') {
          await this._handleProration(subscription, updates.quantity);
        }
      }
      
      // Update subscription in database
      const updatedSubscription = await this.dataStore.updateSubscription(
        subscriptionId,
        validUpdates
      );
      
      // Send notifications
      await this._sendSubscriptionNotifications('updated', updatedSubscription);
      
      this._log('info', 'Subscription updated', {
        subscriptionId,
        updates: Object.keys(validUpdates)
      });
      
      return updatedSubscription;
    } catch (error) {
      this._log('error', 'Failed to update subscription', {
        error: error.message,
        subscriptionId
      });
      
      throw error;
    }
  }
  
  /**
   * Cancel subscription
   * 
   * @param {string} subscriptionId - Subscription ID
   * @param {Object} options - Cancellation options
   * @param {boolean} options.immediate - Cancel immediately instead of at period end
   * @param {string} options.reason - Cancellation reason
   * @returns {Promise<Object>} Canceled subscription
   */
  async cancelSubscription(subscriptionId, options = {}) {
    try {
      if (!subscriptionId) throw new Error('Subscription ID is required');
      
      const { immediate = false, reason = '' } = options;
      
      // Get current subscription
      const subscription = await this.getSubscription(subscriptionId);
      
      // Check if subscription can be canceled
      if (['canceled', 'expired'].includes(subscription.status)) {
        throw new Error(`Subscription is already ${subscription.status}`);
      }
      
      const now = new Date();
      const updates = {
        canceledAt: now,
        cancelReason: reason,
        updatedAt: now
      };
      
      if (immediate) {
        updates.status = 'canceled';
        updates.endDate = now;
      } else {
        updates.cancelAtPeriodEnd = true;
      }
      
      // Update subscription in database
      const canceledSubscription = await this.dataStore.updateSubscription(
        subscriptionId,
        updates
      );
      
      // Send notifications
      await this._sendSubscriptionNotifications('canceled', canceledSubscription);
      
      this._log('info', 'Subscription canceled', {
        subscriptionId,
        immediate,
        reason
      });
      
      return canceledSubscription;
    } catch (error) {
      this._log('error', 'Failed to cancel subscription', {
        error: error.message,
        subscriptionId
      });
      
      throw error;
    }
  }
  
  /**
   * Change subscription plan
   * 
   * @param {string} subscriptionId - Subscription ID
   * @param {string} newPlanId - New plan ID
   * @param {Object} options - Plan change options
   * @returns {Promise<Object>} Updated subscription
   */
  async changePlan(subscriptionId, newPlanId, options = {}) {
    try {
      if (!subscriptionId) throw new Error('Subscription ID is required');
      if (!newPlanId) throw new Error('New plan ID is required');
      
      const { 
        prorated = this.options.prorationEnabled,
        effectiveDate = new Date()
      } = options;
      
      // Get current subscription
      const subscription = await this.getSubscription(subscriptionId);
      
      // Check if subscription can be updated
      if (['canceled', 'expired'].includes(subscription.status)) {
        throw new Error(`Cannot change plan for subscription with status: ${subscription.status}`);
      }
      
      // Get new plan details
      const newPlan = await this.planService.getPlan(newPlanId);
      if (!newPlan) throw new Error(`Plan not found: ${newPlanId}`);
      
      // Get current plan details
      const currentPlan = await this.planService.getPlan(subscription.planId);
      if (!currentPlan) throw new Error(`Current plan not found: ${subscription.planId}`);
      
      // Calculate new amounts
      const baseAmount = newPlan.price * subscription.quantity;
      const taxAmount = await this._calculateTax(baseAmount, subscription.billingAddress);
      const totalAmount = baseAmount + taxAmount;
      
      // Prepare updates
      const updates = {
        planId: newPlanId,
        planName: newPlan.name,
        baseAmount,
        taxAmount,
        totalAmount,
        updatedAt: new Date()
      };
      
      // Handle billing cycle change if needed
      if (newPlan.billingCycle !== currentPlan.billingCycle) {
        updates.billingCycle = newPlan.billingCycle;
        updates.endDate = this._calculateEndDate(effectiveDate, newPlan.billingCycle);
      }
      
      // Handle proration if enabled and subscription is active
      if (prorated && subscription.status === 'active') {
        await this._handlePlanChangeProration(subscription, newPlan, effectiveDate);
      }
      
      // Update subscription in database
      const updatedSubscription = await this.dataStore.updateSubscription(
        subscriptionId,
        updates
      );
      
      // Send notifications
      await this._sendSubscriptionNotifications('plan_changed', updatedSubscription);
      
      this._log('info', 'Subscription plan changed', {
        subscriptionId,
        oldPlanId: subscription.planId,
        newPlanId,
        prorated
      });
      
      return updatedSubscription;
    } catch (error) {
      this._log('error', 'Failed to change subscription plan', {
        error: error.message,
        subscriptionId,
        newPlanId
      });
      
      throw error;
    }
  }
  
  /**
   * Renew subscription
   * 
   * @param {string} subscriptionId - Subscription ID
   * @returns {Promise<Object>} Renewed subscription
   */
  async renewSubscription(subscriptionId) {
    try {
      if (!subscriptionId) throw new Error('Subscription ID is required');
      
      // Get current subscription
      const subscription = await this.getSubscription(subscriptionId);
      
      // Check if subscription can be renewed
      if (!['active', 'past_due'].includes(subscription.status)) {
        throw new Error(`Cannot renew subscription with status: ${subscription.status}`);
      }
      
      const now = new Date();
      
      // Calculate new end date
      const newEndDate = this._calculateEndDate(now, subscription.billingCycle);
      
      // Prepare updates
      const updates = {
        startDate: now,
        endDate: newEndDate,
        status: 'active',
        updatedAt: now
      };
      
      // Clear cancellation if set
      if (subscription.cancelAtPeriodEnd) {
        updates.cancelAtPeriodEnd = false;
        updates.canceledAt = null;
        updates.cancelReason = null;
      }
      
      // Process payment
      const paymentResult = await this._processRenewalPayment(subscription);
      
      // Update subscription in database
      const renewedSubscription = await this.dataStore.upd
(Content truncated due to size limit. Use line ranges to read in chunks)