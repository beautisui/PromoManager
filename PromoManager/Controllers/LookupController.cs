using Dapper;
using Microsoft.AspNetCore.Mvc;
using PromoManager.Service;

namespace PromoManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LookupController : ControllerBase
    {
        private readonly ILookupService _lookupService;

        public LookupController(ILookupService lookupService)
        {
            _lookupService = lookupService;
        }

        [HttpGet("items")]
        public async Task<IActionResult> GetItems()
        {
            var items = await _lookupService.GetItems();
            return Ok(items);
        }

        [HttpGet("stores")]
        public async Task<IActionResult> GetStores()
        {
            var stores = await _lookupService.GetStores();
            return Ok(stores);
        }

        [HttpGet("tactics")]
        public async Task<IActionResult> GetTactics()
        {
            var tactics = await _lookupService.GetTactics();
            return Ok(tactics);
        }

        [HttpGet("availableOptions")]
        public async Task<IActionResult> GetAvailableOptions()
        {
            var options = await _lookupService.GetAvailableOptions();
            return Ok(options);
        }

        [HttpGet("promoIds")]
        public async Task<IActionResult> GetPromoIds()
        {
            var promoIds = await _lookupService.GetPromoIds();
            return Ok(promoIds);
        }

        [HttpGet("filterOptions")]
        public async Task<IActionResult> GetFilterOptions([FromQuery] string field)
        {
            var options = await _lookupService.GetFilterOptions(field);
            return Ok(options);
        }
    }
}
