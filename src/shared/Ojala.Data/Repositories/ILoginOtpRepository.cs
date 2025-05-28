using System.Threading.Tasks;

namespace Ojala.Data.Repositories
{
    public interface ILoginOtpRepository
    {
        Task<string> GenerateOtpAsync(string userId);
        Task<bool> ValidateOtpAsync(string userId, string otp);
        Task InvalidateOtpAsync(string userId);
    }
} 