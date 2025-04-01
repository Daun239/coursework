using System.Collections.Generic;
using System.Threading.Tasks;

namespace CinemaNetwork.Application.Interfaces_Services
{
    public interface IService<TEntity, TDto>
        where TEntity : class
        where TDto : class
    {
        Task<List<TDto>> GetAllAsync();
        Task<TDto?> GetByIdAsync(int id);
        Task<TDto> CreateAsync(TDto dto);
        Task<TDto?> UpdateAsync(TDto dto);
        Task<TDto?> DeleteAsync(int id);
    }
}
