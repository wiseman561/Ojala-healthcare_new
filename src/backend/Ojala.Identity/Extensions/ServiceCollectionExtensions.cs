using Microsoft.Extensions.DependencyInjection;
using Ojala.Data.Repositories.Interfaces;
using Ojala.Data.Repositories;
using Ojala.Identity.Services;
using Ojala.Identity.Services.Interfaces;

namespace Ojala.Identity.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddTwoFactorAuthentication(
            this IServiceCollection services)
        {
            services.AddScoped<ILoginOtpRepository, LoginOtpRepository>();
            services.AddScoped<IEmailService, EmailService>();
            
            return services;
        }
    }
} 