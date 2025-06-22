using PromoManager.Models.Dtos;
using PromoManager.Models.Entities;

namespace PromoManager.Service
{
    public interface IPromoService
    {
        Task<long> AddPromotion(Promo dto);
        Task<IEnumerable<PromotionResponse>> GetAllPromotions();
        Task<long> DeletePromotion(long promoId);
    }
}