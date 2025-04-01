using AutoMapper;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Application.Services
{
    public class Service<TEntity, TDto> : IService<TEntity, TDto>
        where TEntity : class
        where TDto : class
    {
        protected readonly CinemaNetworkContext _context;
        protected readonly IMapper _mapper;

        public Service(CinemaNetworkContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<TDto>> GetAllAsync()
        {
            var entities = await _context.Set<TEntity>().ToListAsync();
            return _mapper.Map<List<TDto>>(entities);
        }

        public async Task<TDto?> GetByIdAsync(int id)
        {
            var entity = await _context.Set<TEntity>().FindAsync(id);
            return entity != null ? _mapper.Map<TDto>(entity) : null;
        }

        public async Task<TDto> CreateAsync(TDto dto)
        {
            var entity = _mapper.Map<TEntity>(dto);
            _context.Set<TEntity>().Add(entity);
            await _context.SaveChangesAsync();
            return _mapper.Map<TDto>(entity);
        }

        public async Task<TDto?> UpdateAsync(TDto dto)
        {
            var entity = _mapper.Map<TEntity>(dto);
            var existingEntity = await _context.Set<TEntity>().FindAsync(GetEntityId(entity));

            if (existingEntity == null) return null;

            _context.Entry(existingEntity).CurrentValues.SetValues(entity);
            await _context.SaveChangesAsync();

            return _mapper.Map<TDto>(existingEntity);
        }

        public async Task<TDto?> DeleteAsync(int id)
        {
            var entity = await _context.Set<TEntity>().FindAsync(id);
            if (entity == null) return null;

            _context.Set<TEntity>().Remove(entity);
            await _context.SaveChangesAsync();

            return _mapper.Map<TDto>(entity);
        }

        private object GetEntityId(TEntity entity)
        {
            return entity.GetType().GetProperty("Id")?.GetValue(entity) ?? 
                   entity.GetType().GetProperties().FirstOrDefault(p => p.Name.EndsWith("Id"))?.GetValue(entity);
        }
    }
}
