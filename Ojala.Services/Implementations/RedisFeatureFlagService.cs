using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;

namespace Ojala.Services.Implementations
{
    /// <summary>
    /// Redis-based implementation of the feature flag service
    /// </summary>
    public class RedisFeatureFlagService : IFeatureFlagService
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly ILogger<RedisFeatureFlagService> _logger;
        private readonly string _keyPrefix;

        /// <summary>
        /// Initializes a new instance of the <see cref="RedisFeatureFlagService"/> class.
        /// </summary>
        /// <param name="redis">The Redis connection multiplexer.</param>
        /// <param name="configuration">The configuration.</param>
        /// <param name="logger">The logger.</param>
        public RedisFeatureFlagService(
            IConnectionMultiplexer redis,
            IConfiguration configuration,
            ILogger<RedisFeatureFlagService> logger)
        {
            _redis = redis ?? throw new ArgumentNullException(nameof(redis));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            
            // TODO: Replace with configuration from Vault in production
            _keyPrefix = configuration["FeatureFlags:KeyPrefix"] ?? "ojala:feature:";
        }

        /// <summary>
        /// Determines if a feature is enabled
        /// </summary>
        /// <param name="featureName">The name of the feature to check</param>
        /// <returns>True if the feature is enabled, false otherwise</returns>
        public async Task<bool> IsEnabled(string featureName)
        {
            try
            {
                if (string.IsNullOrEmpty(featureName))
                {
                    throw new ArgumentException("Feature name cannot be null or empty", nameof(featureName));
                }

                var db = _redis.GetDatabase();
                var key = GetGlobalFeatureKey(featureName);
                
                var value = await db.StringGetAsync(key);
                
                _logger.LogDebug("Feature flag {FeatureName} is {Status}", featureName, value.HasValue && value == "1" ? "enabled" : "disabled");
                
                return value.HasValue && value == "1";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking if feature {FeatureName} is enabled", featureName);
                return false; // Default to disabled on error
            }
        }

        /// <summary>
        /// Determines if a feature is enabled for a specific user
        /// </summary>
        /// <param name="featureName">The name of the feature to check</param>
        /// <param name="userId">The ID of the user</param>
        /// <returns>True if the feature is enabled for the user, false otherwise</returns>
        public async Task<bool> IsEnabledForUser(string featureName, string userId)
        {
            try
            {
                if (string.IsNullOrEmpty(featureName))
                {
                    throw new ArgumentException("Feature name cannot be null or empty", nameof(featureName));
                }

                if (string.IsNullOrEmpty(userId))
                {
                    throw new ArgumentException("User ID cannot be null or empty", nameof(userId));
                }

                var db = _redis.GetDatabase();
                
                // First check if the feature is globally enabled
                if (await IsEnabled(featureName))
                {
                    return true;
                }
                
                // Then check if it's enabled for this specific user
                var key = GetUserFeatureKey(featureName, userId);
                var value = await db.StringGetAsync(key);
                
                _logger.LogDebug("Feature flag {FeatureName} for user {UserId} is {Status}", 
                    featureName, userId, value.HasValue && value == "1" ? "enabled" : "disabled");
                
                return value.HasValue && value == "1";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking if feature {FeatureName} is enabled for user {UserId}", featureName, userId);
                return false; // Default to disabled on error
            }
        }

        /// <summary>
        /// Enables a feature
        /// </summary>
        /// <param name="featureName">The name of the feature to enable</param>
        /// <returns>Task representing the asynchronous operation</returns>
        public async Task EnableFeature(string featureName)
        {
            try
            {
                if (string.IsNullOrEmpty(featureName))
                {
                    throw new ArgumentException("Feature name cannot be null or empty", nameof(featureName));
                }

                var db = _redis.GetDatabase();
                var key = GetGlobalFeatureKey(featureName);
                
                await db.StringSetAsync(key, "1");
                
                _logger.LogInformation("Feature {FeatureName} has been enabled", featureName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error enabling feature {FeatureName}", featureName);
                throw;
            }
        }

        /// <summary>
        /// Disables a feature
        /// </summary>
        /// <param name="featureName">The name of the feature to disable</param>
        /// <returns>Task representing the asynchronous operation</returns>
        public async Task DisableFeature(string featureName)
        {
            try
            {
                if (string.IsNullOrEmpty(featureName))
                {
                    throw new ArgumentException("Feature name cannot be null or empty", nameof(featureName));
                }

                var db = _redis.GetDatabase();
                var key = GetGlobalFeatureKey(featureName);
                
                await db.StringSetAsync(key, "0");
                
                _logger.LogInformation("Feature {FeatureName} has been disabled", featureName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error disabling feature {FeatureName}", featureName);
                throw;
            }
        }

        /// <summary>
        /// Enables a feature for a specific user
        /// </summary>
        /// <param name="featureName">The name of the feature to enable</param>
        /// <param name="userId">The ID of the user</param>
        /// <returns>Task representing the asynchronous operation</returns>
        public async Task EnableFeatureForUser(string featureName, string userId)
        {
            try
            {
                if (string.IsNullOrEmpty(featureName))
                {
                    throw new ArgumentException("Feature name cannot be null or empty", nameof(featureName));
                }

                if (string.IsNullOrEmpty(userId))
                {
                    throw new ArgumentException("User ID cannot be null or empty", nameof(userId));
                }

                var db = _redis.GetDatabase();
                var key = GetUserFeatureKey(featureName, userId);
                
                await db.StringSetAsync(key, "1");
                
                _logger.LogInformation("Feature {FeatureName} has been enabled for user {UserId}", featureName, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error enabling feature {FeatureName} for user {UserId}", featureName, userId);
                throw;
            }
        }

        /// <summary>
        /// Disables a feature for a specific user
        /// </summary>
        /// <param name="featureName">The name of the feature to disable</param>
        /// <param name="userId">The ID of the user</param>
        /// <returns>Task representing the asynchronous operation</returns>
        public async Task DisableFeatureForUser(string featureName, string userId)
        {
            try
            {
                if (string.IsNullOrEmpty(featureName))
                {
                    throw new ArgumentException("Feature name cannot be null or empty", nameof(featureName));
                }

                if (string.IsNullOrEmpty(userId))
                {
                    throw new ArgumentException("User ID cannot be null or empty", nameof(userId));
                }

                var db = _redis.GetDatabase();
                var key = GetUserFeatureKey(featureName, userId);
                
                await db.StringSetAsync(key, "0");
                
                _logger.LogInformation("Feature {FeatureName} has been disabled for user {UserId}", featureName, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error disabling feature {FeatureName} for user {UserId}", featureName, userId);
                throw;
            }
        }

        /// <summary>
        /// Gets all feature flags and their status
        /// </summary>
        /// <returns>Dictionary of feature names and their enabled status</returns>
        public async Task<Dictionary<string, bool>> GetAllFeatures()
        {
            try
            {
                var db = _redis.GetDatabase();
                var server = _redis.GetServer(_redis.GetEndPoints()[0]);
                var result = new Dictionary<string, bool>();
                
                var keys = server.Keys(pattern: $"{_keyPrefix}global:*");
                
                foreach (var key in keys)
                {
                    var featureName = key.ToString().Replace($"{_keyPrefix}global:", "");
                    var value = await db.StringGetAsync(key);
                    result[featureName] = value.HasValue && value == "1";
                }
                
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all features");
                return new Dictionary<string, bool>();
            }
        }

        private string GetGlobalFeatureKey(string featureName)
        {
            return $"{_keyPrefix}global:{featureName}";
        }

        private string GetUserFeatureKey(string featureName, string userId)
        {
            return $"{_keyPrefix}user:{userId}:{featureName}";
        }
    }
}
