using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.API.MongoDB
{
    public class UserActionService
    {
        private readonly IMongoCollection<UserActionLog> _userActionLogs;
        private readonly ILogger<UserActionService> _logger;

        public UserActionService(
            IOptions<MongoDBSettings> mongoDBSettings,
            // IMongoClient mongoClient,
            ILogger<UserActionService> logger,
               IConfiguration configuration)

        {
            var settings = mongoDBSettings.Value;

            var client = new MongoClient("mongodb+srv://fov2505:hrk0959fqy2vT6Rh@user-logs-collection.oe4fgeh.mongodb.net/?retryWrites=true&w=majority&appName=user-logs-collection");


            var database = client.GetDatabase(settings.DatabaseName);
            _userActionLogs = database.GetCollection<UserActionLog>(settings.CollectionName);

            _logger = logger;
        }

        public async Task LogActionAsync(UserActionLog log)
        {
            try
            {

                await _userActionLogs.InsertOneAsync(log);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error logging user action: {ex.Message}");
                throw new Exception("Error logging user action", ex);
            }
        }




        public async Task<List<UserActionLog>> GetAllLogs()
        {
            try
            {

                return await _userActionLogs.Find(a => true).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving logs {ex.Message}");
                throw new Exception("Error retrieving user logs", ex);
            }
        }

    }
}
