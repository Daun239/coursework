namespace CinemaNetwork.Infrastructure.Interfaces
{
    public interface IRepository<TEntity> where TEntity : class
    {
        Task<int> GetCountWithFilters(string? filter = null);
        Task<TEntity?> GetByIdAsync(int id);
        Task<TEntity> AddAsync(TEntity entity);
        Task<TEntity?> UpdateAsync(TEntity entity);
        Task<TEntity?> DeleteAsync(int id);
        Task<List<TEntity?>> DeleteAsync(string dynamicFilter);
        // Task UpdateAsync(Expression<Func<TEntity, bool>> predicate, Action<TEntity> updateAction);
        Task<IEnumerable<TEntity>> GetWithDynamicFilterAsync(
            string? filter = null,
            string? sortBy = null,
            int page = 1,
            int pageSize = 10);
    }
}
