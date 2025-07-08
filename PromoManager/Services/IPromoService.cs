using PromoManager.Models.Entities;

namespace PromoManager.Service
{
    public interface IPromoService
    {
        Task<long> AddPromotion(Promo dto);
        Task<IEnumerable<PromotionResponse>> GetAllPromotions(string sortBy, string sortOrder);
        Task<long> DeletePromotion(long promoId);
        Task<IEnumerable<PromotionResponse>> FilterPromotions(string field, List<string> values, string? sortBy = null, string sortOrder = "asc");
        Task<PromotionResponse> EditPromotion(EditPromo request);
    }
}