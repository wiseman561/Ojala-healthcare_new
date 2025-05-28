using System;
using System.Threading.Tasks;
using Ojala.Data.Entities;

namespace Ojala.Data.Repositories.Interfaces
{
    public interface ILoginOtpRepository
    {
        Task<LoginOtpRequest?> GetByIdAsync(Guid id);
        Task CreateAsync(LoginOtpRequest request);
        Task DeleteAsync(Guid id);
    }
} 