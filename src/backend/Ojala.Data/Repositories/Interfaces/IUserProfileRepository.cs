using System;
using System.Threading.Tasks;
using Ojala.Data.Entities;

namespace Ojala.Data.Repositories.Interfaces
{
    public interface IUserProfileRepository
    {
        Task<UserProfile?> GetByUserIdAsync(string userId);
        Task<UserProfile> CreateAsync(UserProfile profile);
        Task<UserProfile> UpdateAsync(UserProfile profile);
        Task<bool> DeleteAsync(string id);
    }
} 