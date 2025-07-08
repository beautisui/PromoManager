using Microsoft.AspNetCore.Mvc;
using PromoManager.Models.Entities;
using PromoManager.Service;

namespace PromoManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PromotionController : ControllerBase
    {
        private readonly IPromoService _service;

        public PromotionController(IPromoService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePromotion([FromBody] Promo dto)
        {
            try
            {
                var result = await _service.AddPromotion(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to create promotion", error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPromotions([FromQuery] string sortBy = "promoId", [FromQuery] string sortOrder = "desc")
        {
            var result = await _service.GetAllPromotions(sortBy, sortOrder);
            return Ok(result);
        }


        [HttpDelete("{promoId}")]
        public async Task<IActionResult> DeletePromotion(long promoId)
        {
            try
            {
                var deletedId = await _service.DeletePromotion(promoId);
                return Ok(new { deletedPromoId = deletedId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to delete promotion", error = ex.Message });
            }
        }


        [HttpGet("filter")]
        public async Task<IActionResult> FilterPromotions(string field, [FromQuery] string values, [FromQuery] string? sortBy = null, [FromQuery] string sortOrder = "asc")
        {
            var valueList = values.Split(',').ToList();
            var filteredPromos = await _service.FilterPromotions(field, valueList, sortBy, sortOrder);
            return Ok(filteredPromos);
        }

        [HttpPatch]
        public async Task<IActionResult> EditPromotion([FromBody] EditPromo request)
        {
            var updatedPromo = await _service.EditPromotion(request);
            if (updatedPromo == null)
            {
                return NotFound(new { message = "Promotion not found" });
            }
            return Ok(updatedPromo);
        }

    }
}