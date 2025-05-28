using System;

namespace Ojala.Data.Entities
{
    public class LoginOtp
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public string Code { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
} 