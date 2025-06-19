using PromoManager.Models.Dtos;
using PromoManager.Models.Entities;

namespace PromoManager.Repository
{
    public interface IPromoRepository
    {
        Task<IEnumerable<PromotionResponse>> GetAllPromotions();
        Task<Promotion> AddPromotion(Promo dto);
    }
}