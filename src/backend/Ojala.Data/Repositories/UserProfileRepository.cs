using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ojala.Data.Entities;
using Ojala.Data.Repositories.Interfaces;

namespace Ojala.Data.Repositories
{
    public class UserProfileRepository : IUserProfileRepository
    {
        private readonly OjalaDbContext _context;

        public UserProfileRepository(OjalaDbContext context)
        {
            _context = context;
        }

        public async Task<UserProfile?> GetByUserIdAsync(string userId)
        {
            return await _context.UserProfiles
                .FirstOrDefaultAsync(p => p.Id == userId);
        }

        public async Task<UserProfile> CreateAsync(UserProfile profile)
        {
            _context.UserProfiles.Add(profile);
            await _context.SaveChangesAsync();
            return profile;
        }

        public async Task<UserProfile> UpdateAsync(UserProfile profile)
        {
            _context.UserProfiles.Update(profile);
            await _context.SaveChangesAsync();
            return profile;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var profile = await _context.UserProfiles.FindAsync(id);
            if (profile == null)
                return false;

            _context.UserProfiles.Remove(profile);
            await _context.SaveChangesAsync();
            return true;
        }
    }
} 