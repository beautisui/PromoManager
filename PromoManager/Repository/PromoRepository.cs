using PromoManager.Models.Entities;

namespace PromoManager.Repository;

public class PromoRepository : IPromoRepository
{
    public Task<IEnumerable<Promotion>> GetAllPromotions()
    {
        throw new NotImplementedException();
    }

    public Task<Promotion> AddPromotion(Promotion promotion)
    {
        throw new NotImplementedException();
    }
}