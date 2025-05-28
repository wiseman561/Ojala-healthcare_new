using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ojala.Services.Interfaces;
using Ojala.Contracts.DTOs;
using System.Threading.Tasks;
using System.Collections.Generic;
using Ojala.Contracts.Models;

namespace Ojala.Api.Controllers
{
    [ApiController]
    [Route("api/medical-records")]
    [Authorize]
    public class MedicalRecordsController : ControllerBase
    {
        private readonly IMedicalRecordService _medicalRecordService;

        public MedicalRecordsController(IMedicalRecordService medicalRecordService)
        {
            _medicalRecordService = medicalRecordService;
        }

        [HttpGet]
        [Authorize(Roles = "Provider,Admin")]
        public async Task<ActionResult<IEnumerable<MedicalRecordDto>>> GetAll()
        {
            var records = await _medicalRecordService.GetAllRecordsAsync();
            return Ok(records);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MedicalRecordDto>> GetById(string id)
        {
            var record = await _medicalRecordService.GetMedicalRecordByIdAsync(id);
            if (record == null) return NotFound();

            if (!User.IsInRole("Admin") && !User.IsInRole("Provider"))
            {
                var patientId = User.FindFirst("sub")?.Value;
                if (record.PatientId != patientId) return Forbid();
            }

            return Ok(record);
        }

        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<MedicalRecordDto>>> GetByPatientId(string patientId)
        {
            if (!User.IsInRole("Admin") && !User.IsInRole("Provider"))
            {
                var currentUser = User.FindFirst("sub")?.Value;
                if (patientId != currentUser) return Forbid();
            }

            var records = await _medicalRecordService.GetMedicalRecordsByPatientIdAsync(patientId);
            return Ok(records);
        }

        [HttpGet("provider/{providerId}")]
        [Authorize(Roles = "Provider,Admin")]
        public async Task<ActionResult<IEnumerable<ChartData>>> GetProviderRecordTypes(string providerId)
        {
            if (!User.IsInRole("Admin"))
            {
                var currentUser = User.FindFirst("sub")?.Value;
                if (providerId != currentUser) return Forbid();
            }

            var chartData = await _medicalRecordService.GetProviderRecordsByTypeAsync(providerId);
            return Ok(chartData);
        }

        [HttpPost]
        [Authorize(Policy = "CanPostMedicalRecords")]
        public async Task<ActionResult<MedicalRecordDto>> Create([FromBody] MedicalRecordCreateDto recordDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _medicalRecordService.CreateMedicalRecordAsync(recordDto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Provider,Admin")]
        public async Task<IActionResult> Update(string id, [FromBody] MedicalRecordDto recordDto)
        {
            if (id != recordDto.Id) return BadRequest("ID mismatch");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!User.IsInRole("Admin"))
            {
                var currentUser = User.FindFirst("sub")?.Value;
                var existing = await _medicalRecordService.GetMedicalRecordByIdAsync(id); // <-- fixed line
                if (existing == null) return NotFound();
                if (existing.ProviderId != currentUser) return Forbid();
            }

            var updated = await _medicalRecordService.UpdateMedicalRecordAsync(recordDto);
            if (!updated) return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(string id)
        {
            var deleted = await _medicalRecordService.DeleteMedicalRecordAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        [HttpGet("pending-count")]
        [Authorize(Roles = "Provider,Admin")]
        public async Task<ActionResult<int>> GetPendingCount()
        {
            var count = await _medicalRecordService.GetPendingRecordsCountAsync();
            return Ok(count);
        }
    }
}
