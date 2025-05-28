using System.Security.Claims;
using System.Threading.Tasks;
using Ojala.Data.Entities;

namespace Ojala.Identity.Services.Interfaces
{
    public interface ITokenService
    {
        Task<string> GenerateJwtToken(ApplicationUser user);
        ClaimsPrincipal ValidateToken(string token);
        Task<string> GenerateRefreshToken(ApplicationUser user);
    }
}
