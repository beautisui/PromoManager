using PromoManager.Models.Entities;
using PromoManager.Repository;

namespace PromoManager.Service;

public interface IPromoService
{
    Task<IEnumerable<Promotion>>  GetPromotions();
    Task<Promotion>  AddPromotion(Promotion promotion);
}