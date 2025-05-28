using System;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Ojala.Services.Interfaces;
using Ojala.Services.Implementations;
using StackExchange.Redis;

[assembly: InternalsVisibleTo("Ojala.Tests.Integration")]

namespace Ojala.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container
            ConfigureServices(builder.Services, builder.Configuration);

            var app = builder.Build();

            // Configure the HTTP request pipeline
            ConfigureApp(app, app.Environment);

            app.Run();
        }

        private static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            // Add controllers
            services.AddControllers();

            // Add API documentation
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            // Add Redis connection
            services.AddSingleton<IConnectionMultiplexer>(sp =>
            {
                var redisConnectionString = configuration["Redis:ConnectionString"] ?? "localhost:6379";
                return ConnectionMultiplexer.Connect(redisConnectionString);
            });

            // Register feature flag service
            // Choose one implementation based on configuration
            if (configuration.GetValue<bool>("UseRedisFeatureFlags"))
            {
                services.AddSingleton<IFeatureFlagService, RedisFeatureFlagService>();
            }
            else
            {
                services.AddSingleton<IFeatureFlagService, LaunchDarklyFeatureFlagService>();
            }

            // Register AI Engine client
            services.AddHttpClient("AIEngine");
            services.AddScoped<IAIEngineClient, AIEngineClient>();

            // Add other services
            // ...
        }

        private static void ConfigureApp(WebApplication app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthorization();
            app.MapControllers();
        }
    }
}
