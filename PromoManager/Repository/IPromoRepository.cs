using PromoManager.Models.Dtos;
using PromoManager.Models.Entities;

namespace PromoManager.Repository
{
    public interface IPromoRepository
    {
        Task<IEnumerable<Promotion>> GetAllPromotions();
        Task<Promotion> AddPromotion(PromoDTO dto);
    }
}