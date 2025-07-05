using PromoManager.Models.Entities;

namespace PromoManager.Repository;

    public interface ILookupRepository
    {
        Task<IEnumerable<Item>> GetItems();
        Task<IEnumerable<Store>> GetStores();
        Task<IEnumerable<Tactic>> GetTactics();
        Task<IEnumerable<long>> GetPromoIds();
        Task<IEnumerable<FilterOption>> GetFilterOptions(string field);
}