using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ojala.Contracts.DTOs;
using Ojala.Services.Interfaces;
using System.Threading.Tasks;

namespace Ojala.Api.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IPatientService _patientService;
        private readonly IAppointmentService _appointmentService;
        private readonly IMedicalRecordService _medicalRecordService;
        private readonly IHealthcarePlanService _healthcarePlanService;

        public DashboardController(
            IPatientService patientService,
            IAppointmentService appointmentService,
            IMedicalRecordService medicalRecordService,
            IHealthcarePlanService healthcarePlanService)
        {
            _patientService = patientService;
            _appointmentService = appointmentService;
            _medicalRecordService = medicalRecordService;
            _healthcarePlanService = healthcarePlanService;
        }

        // GET api/dashboard/provider/{providerId}
        [HttpGet("provider/{providerId}")]
        [Authorize(Roles = "Provider,Admin")]
        public async Task<IActionResult> GetProviderDashboardData(string providerId)
        {
            var currentUser = User.FindFirst("sub")?.Value;
            if (User.IsInRole("Provider") && currentUser != providerId)
                return Forbid();

            await Task.Yield(); // Added to prevent CS1998 warning
            return Ok(new DashboardData());
        }

        // GET api/dashboard/patient/{patientId}
        [HttpGet("patient/{patientId}")]
        [Authorize(Roles = "Patient,Provider,Admin")]
        public async Task<IActionResult> GetPatientDashboardData(string patientId)
        {
            var currentUser = User.FindFirst("sub")?.Value;
            if (User.IsInRole("Patient") && currentUser != patientId)
                return Forbid();

            await Task.Yield(); // Added to prevent CS1998 warning
            return Ok(new PatientDashboardData());
        }
    }
}
