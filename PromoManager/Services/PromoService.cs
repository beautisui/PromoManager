using PromoManager.Models.Entities;
using PromoManager.Repositories;
using PromoManager.Repository;
using PromoManager.Services;

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

        public async Task<IEnumerable<PromotionResponse>> GetPromotionsBy(PromoFilterRequest request)
        {
            return await _repository.GetPromotionsBy(request);
        }

        public Task<long> DeletePromotion(long promoId)
        {
            return _repository.DeletePromotion(promoId);
        }

        public async Task<PromotionResponse> EditPromotion(EditPromo request)
        {
            if (!string.IsNullOrEmpty(request.StartDate))
            {
                if (DateTime.Parse(request.StartDate).Date < DateTime.UtcNow.Date)
                    throw new ArgumentException("Start date must be today or in the future.");
            }

            if (!string.IsNullOrEmpty(request.EndDate) && !string.IsNullOrEmpty(request.StartDate))
            {
                if (DateTime.Parse(request.EndDate).Date < DateTime.Parse(request.StartDate).Date)
                    throw new ArgumentException("End date must be the same or after the start date.");
            }

            if (request.ItemIds != null && !request.ItemIds.Any())
                throw new ArgumentException("At least one item ID must be provided.");


            if (request.StoreIds != null && !request.StoreIds.Any())
                throw new ArgumentException("At least one store ID must be provided.");

            return await _repository.EditPromotion(request);
        }
    }
}