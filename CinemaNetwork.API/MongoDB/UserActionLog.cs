using MongoDB.Bson;

namespace CinemaNetwork.API.MongoDB
{
    public class UserActionLog
    {
        public ObjectId? Id { get; set; }
        public string? UserId { get; set; }
        public string? Action { get; set; }
        public string? Entity { get; set; }
        public string? EntityId { get; set; } // For easier querying
        public string? Details { get; set; }
        public bool Success { get; set; } = true; // ✅ Default to true, but override on failure
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}

