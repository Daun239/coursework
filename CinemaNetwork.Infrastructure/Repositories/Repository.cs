using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Linq.Expressions;
using System.Linq.Dynamic.Core;
namespace CinemaNetwork.Infrastructure.Repositories
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        private readonly CinemaNetworkContext _context;
        internal readonly DbSet<TEntity> dbSet;

        public Repository(CinemaNetworkContext dbContext)
        {
            _context = dbContext;
            dbSet = dbContext.Set<TEntity>();
        }

        public async Task<TEntity?> GetByIdAsync(int id)
        {
            return await _context.Set<TEntity>().FindAsync(id);
        }

        public async Task<TEntity> AddAsync(TEntity entity)
        {
            await _context.Set<TEntity>().AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<TEntity?> UpdateAsync(TEntity entity)
        {
            // Визначаємо властивість Id динамічно
            var keyProperty = typeof(TEntity).GetProperties()
                .FirstOrDefault(p => p.Name.EndsWith("Id"));

            if (keyProperty == null)
            {
                throw new InvalidOperationException($"Entity {typeof(TEntity).Name} does not have a primary key ending with 'Id'.");
            }

            var entityId = keyProperty.GetValue(entity);
            if (entityId == null)
            {
                throw new InvalidOperationException("Entity ID cannot be null.");
            }

            var existingEntity = await _context.Set<TEntity>().FindAsync(entityId);
            if (existingEntity == null) return null;

            _context.Entry(existingEntity).CurrentValues.SetValues(entity);
            await _context.SaveChangesAsync();
            return existingEntity;
        }


        public async Task<TEntity?> DeleteAsync(int id)
        {
            var entity = await _context.Set<TEntity>().FindAsync(id);
            if (entity == null) return null;

            _context.Set<TEntity>().Remove(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        // Delete with Predicate
        public async Task<List<TEntity?>> DeleteAsync(string dynamicFilter)
        {
            var entities = await dbSet.Where(dynamicFilter).ToListAsync();
            dbSet.RemoveRange(entities);
            await _context.SaveChangesAsync();
            return entities;
        }

        // Update with Predicate
        public async Task UpdateAsync(Expression<Func<TEntity, bool>> predicate, Action<TEntity> updateAction)
        {
            var entitiesToUpdate = await _context.Set<TEntity>().Where(predicate).ToListAsync();
            if (entitiesToUpdate.Any())
            {
                foreach (var entity in entitiesToUpdate)
                {
                    updateAction(entity);
                    _context.Set<TEntity>().Update(entity);
                }

                await _context.SaveChangesAsync();
            }
        }

        public async Task<int> GetCountWithFilters(string? dynamicFilter = null)
        {

            IQueryable<TEntity> query = dbSet;
            if (!String.IsNullOrWhiteSpace(dynamicFilter)) {
                query = query.Where(dynamicFilter);
            }
            var count = query.CountAsync();
            return await count;
        }

        public async Task<IEnumerable<TEntity?>> GetWithDynamicFilterAsync(string? dynamicFilter = null, string? sortBy = null, int page = 1, int pageSize = 10)
        {
            IQueryable<TEntity> query = dbSet;

            if (!string.IsNullOrWhiteSpace(dynamicFilter)) {
                query = query.Where(dynamicFilter);
            }

            if (!string.IsNullOrWhiteSpace(sortBy)) {
                query = query.OrderBy(sortBy);
            }

            query = query.Skip((page - 1) * pageSize).Take(pageSize);
            return await query.ToListAsync();
        }

    }

}
