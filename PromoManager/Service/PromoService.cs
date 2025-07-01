using PromoManager.Models.Dtos;
using PromoManager.Models.Entities;

using PromoManager.Repository;

namespace PromoManager.Service
{
    public class PromoService : IPromoService
    {
        private readonly IPromoRepository _repository;

        public PromoService(IPromoRepository repository)
        {
            _repository = repository;
        }

        public async Task<long> AddPromotion(Promo dto)
        {
            var today = DateTime.UtcNow.Date;

            if (dto.StartDate.Date < today)
                throw new ArgumentException("Start date must be today or in the future.");

            if (dto.EndDate.Date < dto.StartDate.Date)
                throw new ArgumentException("End date must be the same or after the start date.");

            return await _repository.AddPromotion(dto);
        }

        public async Task<IEnumerable<PromotionResponse>> GetAllPromotions(string sortBy, string sortOrder)
        {
            return await _repository.GetAllPromotions(sortBy, sortOrder);
        }

        public Task<long> DeletePromotion(long promoId)
        {
            return _repository.DeletePromotion(promoId);
        }

        public async Task<IEnumerable<PromotionResponse>> FilterPromotions(string field, List<string> values, string? sortBy = null, string sortOrder = "asc")
        {
            return await _repository.FilterPromotions(field, values, sortBy, sortOrder);
        }



    }
}