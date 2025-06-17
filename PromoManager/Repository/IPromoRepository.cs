using PromoManager.Models.Entities;

namespace PromoManager.Repository;

public interface IPromoRepository
{
    Task<IEnumerable<Promotion>> GetAllPromotions();
    Task<Promotion> AddPromotion(Promotion promotion);
}