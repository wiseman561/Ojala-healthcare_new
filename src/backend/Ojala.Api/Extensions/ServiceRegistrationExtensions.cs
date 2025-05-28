using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Ojala.Api.Extensions
{
    public static class ServiceRegistrationExtensions
    {
        public static IServiceCollection RegisterAIEngineServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Register AI Engine services
            services.AddHttpClient("AIEngineClient", client =>
            {
                client.BaseAddress = new Uri(configuration["Services:AIEngine:Url"] ?? "http://ai-engine");
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            });

            // Register AI Engine client
            services.AddScoped<Ojala.Services.Interfaces.IAIEngineClient, Ojala.Api.Services.Implementations.AIEngineClient>();

            // Register health score service
            services.AddScoped<Ojala.Services.Interfaces.IHealthScoreService, Ojala.Services.Implementations.HealthScoreService>();

            // Register risk assessment service
            services.AddScoped<Ojala.Services.Interfaces.IRiskAssessmentService, Ojala.Services.Implementations.RiskAssessmentService>();

            // Register forecasting service
            services.AddScoped<Ojala.Services.Interfaces.IForecastingService, Ojala.Services.Implementations.ForecastingService>();

            return services;
        }

        public static IServiceCollection RegisterNurseAssistantServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Register Nurse Assistant services
            services.AddHttpClient("NurseAssistantClient", client =>
            {
                client.BaseAddress = new Uri(configuration["Services:NurseAssistant:Url"] ?? "http://nurse-assistant");
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            });

            // Register clinical alerts service
            services.AddScoped<Ojala.Services.Interfaces.IClinicalAlertService, Ojala.Services.Implementations.ClinicalAlertService>();

            // Register recommendations service
            services.AddScoped<Ojala.Services.Interfaces.IRecommendationService, Ojala.Services.Implementations.RecommendationService>();

            // Register vital signs service
            services.AddScoped<Ojala.Services.Interfaces.IVitalSignsService, Ojala.Services.Implementations.VitalSignsService>();

            return services;
        }
    }
}
