using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Ojala.Services.Interfaces;
using Ojala.Services.Models;

namespace Ojala.Api.Controllers
{
    /// <summary>
    /// Controller for AI integration endpoints
    /// </summary>
    [ApiController]
    [Route("api/new")]
    public class AiIntegrationController : ControllerBase
    {
        private readonly IAIEngineClient _aiEngineClient;
        private readonly ILogger<AiIntegrationController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="AiIntegrationController"/> class.
        /// </summary>
        /// <param name="aiEngineClient">The AI engine client.</param>
        /// <param name="logger">The logger.</param>
        public AiIntegrationController(
            IAIEngineClient aiEngineClient,
            ILogger<AiIntegrationController> logger)
        {
            _aiEngineClient = aiEngineClient ?? throw new ArgumentNullException(nameof(aiEngineClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Gets the health score for a patient.
        /// </summary>
        /// <param name="patientId">The patient identifier.</param>
        /// <returns>The health score result.</returns>
        [HttpGet("healthscore/{patientId}")]
        public async Task<IActionResult> GetHealthScore(string patientId)
        {
            try
            {
                _logger.LogInformation("Received request for health score for patient {PatientId}", patientId);
                
                if (string.IsNullOrEmpty(patientId))
                {
                    return BadRequest(new { error = "Patient ID is required" });
                }
                
                var result = await _aiEngineClient.GetHealthScoreAsync(patientId);
                
                return Ok(result);
            }
            catch (AIEngineException ex)
            {
                _logger.LogError(ex, "Error retrieving health score for patient {PatientId}", patientId);
                return StatusCode(500, new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error retrieving health score for patient {PatientId}", patientId);
                return StatusCode(500, new { error = "An unexpected error occurred" });
            }
        }

        /// <summary>
        /// Gets the risk assessment for a patient.
        /// </summary>
        /// <param name="patientId">The patient identifier.</param>
        /// <returns>The risk assessment result.</returns>
        [HttpGet("risk/{patientId}")]
        public async Task<IActionResult> GetRiskAssessment(string patientId)
        {
            try
            {
                _logger.LogInformation("Received request for risk assessment for patient {PatientId}", patientId);
                
                if (string.IsNullOrEmpty(patientId))
                {
                    return BadRequest(new { error = "Patient ID is required" });
                }
                
                var result = await _aiEngineClient.GetRiskAssessmentAsync(patientId);
                
                return Ok(result);
            }
            catch (AIEngineException ex)
            {
                _logger.LogError(ex, "Error retrieving risk assessment for patient {PatientId}", patientId);
                return StatusCode(500, new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error retrieving risk assessment for patient {PatientId}", patientId);
                return StatusCode(500, new { error = "An unexpected error occurred" });
            }
        }

        /// <summary>
        /// Gets care plan recommendations for a patient.
        /// </summary>
        /// <param name="patientId">The patient identifier.</param>
        /// <returns>The care plan recommendations.</returns>
        [HttpGet("care-plan-recommendations/{patientId}")]
        public async Task<IActionResult> GetCarePlanRecommendations(string patientId)
        {
            try
            {
                _logger.LogInformation("Received request for care plan recommendations for patient {PatientId}", patientId);
                
                if (string.IsNullOrEmpty(patientId))
                {
                    return BadRequest(new { error = "Patient ID is required" });
                }
                
                var result = await _aiEngineClient.GetCarePlanRecommendationsAsync(patientId);
                
                return Ok(result);
            }
            catch (AIEngineException ex)
            {
                _logger.LogError(ex, "Error retrieving care plan recommendations for patient {PatientId}", patientId);
                return StatusCode(500, new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error retrieving care plan recommendations for patient {PatientId}", patientId);
                return StatusCode(500, new { error = "An unexpected error occurred" });
            }
        }

        /// <summary>
        /// Analyzes patient data to identify trends and insights.
        /// </summary>
        /// <param name="patientId">The patient identifier.</param>
        /// <param name="dataType">Type of data to analyze.</param>
        /// <param name="startDate">Optional start date for the analysis period.</param>
        /// <param name="endDate">Optional end date for the analysis period.</param>
        /// <returns>The analysis result.</returns>
        [HttpGet("analyze-data/{patientId}")]
        public async Task<IActionResult> AnalyzePatientData(
            string patientId,
            [FromQuery] string dataType,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                _logger.LogInformation(
                    "Received request for data analysis for patient {PatientId}, data type {DataType}",
                    patientId,
                    dataType);
                
                if (string.IsNullOrEmpty(patientId))
                {
                    return BadRequest(new { error = "Patient ID is required" });
                }
                
                if (string.IsNullOrEmpty(dataType))
                {
                    return BadRequest(new { error = "Data type is required" });
                }
                
                var result = await _aiEngineClient.AnalyzePatientDataAsync(patientId, dataType, startDate, endDate);
                
                return Ok(result);
            }
            catch (AIEngineException ex)
            {
                _logger.LogError(
                    ex,
                    "Error analyzing data for patient {PatientId}, data type {DataType}",
                    patientId,
                    dataType);
                return StatusCode(500, new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Unexpected error analyzing data for patient {PatientId}, data type {DataType}",
                    patientId,
                    dataType);
                return StatusCode(500, new { error = "An unexpected error occurred" });
            }
        }
    }
}
