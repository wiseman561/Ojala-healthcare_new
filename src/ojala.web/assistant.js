    care_plan: {
      goals: [
        { description: 'Reduce A1C to below 7.0%', status: 'in progress' },
        { description: 'Reduce blood pressure to below 130/80', status: 'not started' },
        { description: 'Increase physical activity to 30 minutes daily', status: 'in progress' }
      ],
      interventions: [
        { description: 'Medication adjustment', status: 'completed' },
        { description: 'Dietary consultation', status: 'scheduled' },
        { description: 'Remote monitoring of blood pressure', status: 'active' }
      ]
    }
  };
}

/**
 * Generate patient summary using LLM
 * @param {Object} patientContext Patient context
 * @returns {Object} Generated summary
 */
async function generateSummary(patientContext) {
  try {
    // Construct prompt for the LLM
    const prompt = `
You are an AI assistant for registered nurses. Provide a concise summary of this patient's health status, focusing on the top 3 risks and recent changes. Use only the information provided.

Patient Information:
- Name: ${patientContext.patient.name}
- Age: ${patientContext.patient.age}
- Gender: ${patientContext.patient.gender}
- Conditions: ${patientContext.patient.conditions.join(', ')}
- Medications: ${patientContext.patient.medications.map(med => `${med.name} ${med.dosage} ${med.frequency}`).join(', ')}

Latest Vitals (${patientContext.vitals.latest.date}):
- Blood Pressure: ${patientContext.vitals.latest.blood_pressure}
- Heart Rate: ${patientContext.vitals.latest.heart_rate}
- Temperature: ${patientContext.vitals.latest.temperature}
- Respiratory Rate: ${patientContext.vitals.latest.respiratory_rate}
- Oxygen Saturation: ${patientContext.vitals.latest.oxygen_saturation}%
- Weight: ${patientContext.vitals.latest.weight} lbs
- BMI: ${patientContext.vitals.latest.bmi}

Vital Trends:
- Blood Pressure: ${patientContext.vitals.trends.blood_pressure}
- Weight: ${patientContext.vitals.trends.weight}
- Glucose: ${patientContext.vitals.trends.glucose}

Health Score:
- Current: ${patientContext.health_score.current}
- Previous: ${patientContext.health_score.previous}
- Trend: ${patientContext.health_score.trend}
- Risk Level: ${patientContext.health_score.risk_level}
- Top Factors: ${patientContext.health_score.top_factors.map(factor => `${factor.name} (${factor.impact})`).join(', ')}

Recent Events:
${patientContext.recent_events.map(event => `- ${event.date}: ${event.type} - ${event.details}`).join('\n')}

Care Plan:
- Goals: ${patientContext.care_plan.goals.map(goal => `${goal.description} (${goal.status})`).join(', ')}
- Interventions: ${patientContext.care_plan.interventions.map(intervention => `${intervention.description} (${intervention.status})`).join(', ')}

Provide a summary with these sections:
1. Patient Overview (1-2 sentences)
2. Top 3 Risk Factors (prioritized)
3. Recent Changes (1-2 sentences)
4. Recommended Focus Areas (2-3 bullet points)

Keep the entire response under 250 words and focus on actionable insights for the nurse.
`;

    // In a real implementation, this would call the OpenAI API
    // For this implementation, we'll simulate a response
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulated LLM response
    const summary = {
      patient_overview: `${patientContext.patient.name} is a ${patientContext.patient.age}-year-old ${patientContext.patient.gender.toLowerCase()} with Type 2 Diabetes, Hypertension, and Hyperlipidemia, currently at moderate risk with an improving health score (72, up from 68).`,
      top_risks: [
        {
          factor: "Elevated Blood Pressure",
          details: "Current reading of 142/88 shows an increasing trend, above target of 130/80 for patients with diabetes.",
          priority: "high"
        },
        {
          factor: "Insufficient Physical Activity",
          details: "Identified as a negative contributor to health score, with goa
(Content truncated due to size limit. Use line ranges to read in chunks)