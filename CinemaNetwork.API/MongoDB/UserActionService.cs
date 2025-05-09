using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CinemaNetwork.API.MongoDB
{
    public class UserActionService
    {
        private readonly IMongoCollection<UserActionLog> _userActionLogs;
        private readonly ILogger<UserActionService> _logger;

        public UserActionService(
            IOptions<MongoDBSettings> mongoDBSettings,
            IMongoClient mongoClient,
            ILogger<UserActionService> logger)
        {
            var settings = mongoDBSettings.Value;

            var database = mongoClient.GetDatabase(settings.DatabaseName);
            _userActionLogs = database.GetCollection<UserActionLog>(settings.CollectionName);

            _logger = logger;
        }

        public async Task LogActionAsync(UserActionLog log)
        {
            try
            {
                log.Timestamp ??= DateTime.UtcNow;

                await _userActionLogs.InsertOneAsync(log);

                _logger.LogInformation($"User action logged: {log.Action} for User: {log.UserId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error logging user action: {ex.Message}");
                throw new Exception("Error logging user action", ex);
            }
        }

        public async Task<List<UserActionLog>> GetLogsByUserIdAsync(string userId)
        {
            try
            {
                var filter = Builders<UserActionLog>.Filter.Eq(log => log.UserId, userId);
                return await _userActionLogs.Find(filter).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving logs for User ID {userId}: {ex.Message}");
                throw new Exception("Error retrieving user logs", ex);
            }
        }
    }
}
