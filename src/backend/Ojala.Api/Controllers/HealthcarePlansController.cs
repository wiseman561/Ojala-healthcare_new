using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Ojala.Contracts.DTOs;
using Ojala.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ojala.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthcarePlansController : ControllerBase
    {
        private readonly IHealthcarePlanService _healthcarePlanService;

        public HealthcarePlansController(IHealthcarePlanService healthcarePlanService)
        {
            _healthcarePlanService = healthcarePlanService;
        }

        // GET api/healthcareplans/available-plans
        [HttpGet("available-plans")]
        public async Task<ActionResult<IEnumerable<HealthcarePlanDto>>> GetAvailablePlans()
        {
            // For now, return all plans; adjust when you have specific availability logic
            var plans = await _healthcarePlanService.GetAllHealthcarePlansAsync();
            return Ok(plans);
        }

        // GET api/healthcareplans/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<HealthcarePlanDto>> GetById(string id)
        {
            var plan = await _healthcarePlanService.GetHealthcarePlanByIdAsync(id);
            if (plan == null) return NotFound();
            return Ok(plan);
        }

        // POST api/healthcareplans
        [HttpPost]
        public async Task<ActionResult<HealthcarePlanDto>> Create([FromBody] HealthcarePlanCreateDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdPlan = await _healthcarePlanService.CreateHealthcarePlanAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = createdPlan.Id }, createdPlan);
        }

        // PUT api/healthcareplans/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Provider")]
        public async Task<IActionResult> Update(string id, [FromBody] HealthcarePlanUpdateDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (id != updateDto.Id)
                return BadRequest("ID mismatch");

            var success = await _healthcarePlanService.UpdateHealthcarePlanAsync(updateDto);
            return success ? NoContent() : NotFound();
        }

        // DELETE api/healthcareplans/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Provider")]
        public async Task<IActionResult> Delete(string id)
        {
            var success = await _healthcarePlanService.DeleteHealthcarePlanAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}
