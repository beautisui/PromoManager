using PromoManager.Models.Dtos;
using PromoManager.Models.Entities;

namespace PromoManager.Service
{
    public interface IPromoService
    {
        Task<Promotion> AddPromotion(PromoDTO dto);
        Task<IEnumerable<Promotion>> GetAllPromotions();
    }
}