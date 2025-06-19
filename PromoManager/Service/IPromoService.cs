using PromoManager.Models.Dtos;
using PromoManager.Models.Entities;

namespace PromoManager.Service
{
    public interface IPromoService
    {
        Task<Promotion> AddPromotion(Promo dto);
        Task<IEnumerable<PromotionResponse>> GetAllPromotions();
    }
}