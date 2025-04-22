using CinemaNetwork.API.MongoDB;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace CinemaNetwork.API.MongoDB
{
    public class UserActionService
    {
        private readonly IMongoCollection<UserActionLog> _userActionLogs;
        private readonly ILogger<UserActionService> _logger;

        // Constructor to inject MongoDB settings and logger
        public UserActionService(IOptions<MongoDBSettings> mongoDBSettings, ILogger<UserActionService> logger)
        {
            var settings = mongoDBSettings.Value;

            // Create a MongoDB client using the provided connection string
            var mongoClient = new MongoClient(settings.ConnectionString);
            var database = mongoClient.GetDatabase(settings.DatabaseName);

            // Set the collection for logging
            _userActionLogs = database.GetCollection<UserActionLog>(settings.CollectionName);
            _logger = logger;
        }

        // Method to log user actions
        public async Task LogActionAsync(UserActionLog log)
        {
            try
            {
                // Set the timestamp if not provided
                log.Timestamp = log.Timestamp == default ? DateTime.UtcNow : log.Timestamp;

                // Insert the log into the collection
                await _userActionLogs.InsertOneAsync(log);

                _logger.LogInformation($"User action logged successfully: {log.Action} for User: {log.UserId}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error logging user action: {ex.Message}");
                throw new Exception("Error logging user action", ex);
            }
        }

        // Method to retrieve logs by user ID
        public async Task<List<UserActionLog>> GetLogsByUserIdAsync(string userId)
        {
            try
            {
                var filter = Builders<UserActionLog>.Filter.Eq(log => log.UserId, userId);
                return await _userActionLogs.Find(filter).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving logs for User ID {userId}: {ex.Message}");
                throw new Exception("Error retrieving user logs", ex);
            }
        }
    }
}
