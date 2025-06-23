using PromoManager.Models.Dtos;
using PromoManager.Models.Entities;

namespace PromoManager.Repository
{
    public interface IPromoRepository
    {
        Task<IEnumerable<PromotionResponse>> GetAllPromotions( string sortBy,string  sortOrder);
        Task<long> AddPromotion(Promo dto);
        Task<long> DeletePromotion(long promoId);
    }
}