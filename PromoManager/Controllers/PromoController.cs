using Microsoft.AspNetCore.Mvc;
using PromoManager.Models.Entities;
using PromoManager.Service;
using PromoManager.Services;

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

        [HttpPost("search")]
        public async Task<IActionResult> GetPromotionsBy([FromBody] PromoFilterRequest filterRequest)
        {
            var result = await _service.GetPromotionsBy(filterRequest);
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

        [HttpPatch]
        public async Task<IActionResult> EditPromotion([FromBody] EditPromo request)
        {
            var updatedPromo = await _service.EditPromotion(request);
            return Ok(updatedPromo);
        }

    }
}