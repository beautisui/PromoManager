using PromoManager.Models.Entities;

namespace PromoManager.Services
{
    public interface IPromoService
    {
        Task<long> AddPromotion(Promo dto);
        Task<IEnumerable<PromotionResponse>> GetPromotionsBy(PromoFilterRequest request);
        Task<long> DeletePromotion(long promoId);
        Task<PromotionResponse> EditPromotion(EditPromo request);
    }
}