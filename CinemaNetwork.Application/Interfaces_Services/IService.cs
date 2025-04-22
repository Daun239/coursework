using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis;

namespace CinemaNetwork.Application.Interfaces_Services
{
    public interface IService<TEntity, TDto>
        where TEntity : class
        where TDto : class
    {
        Task<List<TDto>> GetAllAsync(string? dynamicFilter, string sortBy, int page, int pageSize);

        Task<int> GetCountAsync(string? dynamicFilter);

        Task<List<TDto?>> DeleteAsync(string? dynamicFilter);
        Task<TDto?> GetByIdAsync(int id);
        Task <TDto> CreateAsync(TDto dto);
        Task<TDto?> UpdateAsync(TDto dto);
        Task<TDto?> DeleteAsync(int id);
    }
}
