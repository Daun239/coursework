namespace CinemaNetwork.API.MongoDB
{
    public interface IGenericActionLogger
    {
        Task LogAsync<T>(string userId, string action, string? entityId = null, string? details = null);
        Task LogBatchAsync<T>(string userId, string action, IEnumerable<string> entityIds, string? details = null);
    }

}