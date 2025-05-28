using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ojala.Data.Entities;
using Ojala.Data.Repositories.Interfaces;

namespace Ojala.Data.Repositories
{
    public class LoginOtpRepository : ILoginOtpRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly Random _random;

        public LoginOtpRepository(ApplicationDbContext context)
        {
            _context = context;
            _random = new Random();
        }

        public async Task<string> GenerateOtpAsync(string userId)
        {
            // Generate a 6-digit OTP
            string otp = _random.Next(100000, 999999).ToString();
            
            // Store the OTP in the database
            var otpEntity = new LoginOtp
            {
                UserId = userId,
                Code = otp,
                ExpiresAt = DateTime.UtcNow.AddMinutes(5) // OTP expires in 5 minutes
            };

            _context.LoginOtps.Add(otpEntity);
            await _context.SaveChangesAsync();

            return otp;
        }

        public async Task<bool> ValidateOtpAsync(string userId, string otp)
        {
            var otpEntity = await _context.LoginOtps
                .FirstOrDefaultAsync(o => o.UserId == userId && o.Code == otp);

            if (otpEntity == null || otpEntity.ExpiresAt < DateTime.UtcNow)
            {
                return false;
            }

            // Invalidate the OTP after successful validation
            await InvalidateOtpAsync(userId);
            return true;
        }

        public async Task InvalidateOtpAsync(string userId)
        {
            var otpEntity = await _context.LoginOtps
                .FirstOrDefaultAsync(o => o.UserId == userId);

            if (otpEntity != null)
            {
                _context.LoginOtps.Remove(otpEntity);
                await _context.SaveChangesAsync();
            }
        }
    }
} 