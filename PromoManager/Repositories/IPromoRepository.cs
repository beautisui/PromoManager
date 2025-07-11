using PromoManager.Models.Entities;

namespace PromoManager.Repositories
{
    public interface IPromoRepository
    {
        Task<IEnumerable<PromotionResponse>> GetPromotionsBy(PromoFilterRequest request);
        Task<long> AddPromotion(Promo dto);
        Task<long> DeletePromotion(long promoId);
        Task<PromotionResponse> EditPromotion(EditPromo request);
    }
}