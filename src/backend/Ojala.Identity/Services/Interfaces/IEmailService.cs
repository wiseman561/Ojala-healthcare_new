using System.Threading.Tasks;

namespace Ojala.Identity.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendTwoFactorCodeAsync(string email, string code);
    }
} 