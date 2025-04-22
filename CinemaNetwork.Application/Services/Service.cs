using AutoMapper;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Infrastructure.Interfaces;

namespace CinemaNetwork.Application.Services
{
    public class Service<TEntity, TDto> : IService<TEntity, TDto>
        where TEntity : class
        where TDto : class
    {
        protected readonly IRepository<TEntity> _repository;
        protected readonly IMapper _mapper;

        public Service(IRepository<TEntity> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public virtual async Task<List<TDto>> GetAllAsync(string? dynamicFilter, string? sortBy, int page, int pagesize)
        {
            var entities = await _repository.GetWithDynamicFilterAsync(dynamicFilter, sortBy, page, pagesize);
            return _mapper.Map<List<TDto>>(entities);
        }

        public virtual async Task<int> GetCountAsync(string? dynamicFilter) {
            int count = await _repository.GetCountWithFilters(dynamicFilter);
            return count;
        }

        public virtual async Task<TDto?> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return entity != null ? _mapper.Map<TDto>(entity) : null;
        }

        public virtual async Task<TDto> CreateAsync(TDto dto)
        {
            var entity = _mapper.Map<TEntity>(dto);
            await _repository.AddAsync(entity);
            return _mapper.Map<TDto>(entity);
        }

        public virtual async Task<TDto?> UpdateAsync(TDto dto)
        {
            var entity = _mapper.Map<TEntity>(dto);
            var existingEntity = await _repository.GetByIdAsync(GetEntityId(entity));
            if (existingEntity == null) return null;

            _mapper.Map(dto, existingEntity);
            await _repository.UpdateAsync(existingEntity);

            return _mapper.Map<TDto>(existingEntity);
        }

        public virtual async Task<TDto?> DeleteAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return null;

            await _repository.DeleteAsync(id);

            return _mapper.Map<TDto>(entity);
        }

        private int GetEntityId(TEntity entity)
        {
            var idProperty = typeof(TEntity).GetProperties()
                .FirstOrDefault(p => p.Name.EndsWith("Id", StringComparison.OrdinalIgnoreCase));

            if (idProperty == null)
                throw new InvalidOperationException("Cannot find an Id property for the entity.");

            var value = idProperty.GetValue(entity);
            return value is int intValue ? intValue : throw new InvalidCastException("Id is not an int.");
        }

        public Task<int> GetCount(string? dynamicFilter)
        {
            throw new NotImplementedException();
        }

     public async Task<List<TDto?>> DeleteAsync(string? dynamicFilter)
{
    var entities = await _repository.DeleteAsync(dynamicFilter); // Assuming this is the correct return type.
    if (entities == null || !entities.Any()) 
    { 
        return new List<TDto?>(); // Return an empty list if no entities were found.
    }

    return _mapper.Map<List<TDto>>(entities); // Map to List<TDto>
}


    }
}
