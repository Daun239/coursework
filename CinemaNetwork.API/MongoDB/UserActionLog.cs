using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CinemaNetwork.API.MongoDB
{
    public class UserActionLog
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? User { get; set; }
        public string? Action { get; set; }
        public string? Entity { get; set; }
        public string? Details { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}