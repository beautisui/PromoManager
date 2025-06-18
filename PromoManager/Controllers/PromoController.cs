using Microsoft.AspNetCore.Mvc;
using PromoManager.Models.Entities;
using PromoManager.Service;

namespace PromoManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PromotionController : ControllerBase
    {
        private readonly IPromoService _promoService;

        public PromotionController(IPromoService promoService)
        {
            _promoService = promoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Promotion>>> GetPromotions()
        {
            var result = await _promoService.GetPromotions();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Promotion>> AddPromotion([FromBody] Promotion promotion)
        {
            var result = await _promoService.AddPromotion(promotion);
            return CreatedAtAction(nameof(GetPromotions), new { id = result.PromoId }, result);
        }
    }
}