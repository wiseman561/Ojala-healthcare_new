﻿// File: src/backend/Ojala.Api/Services/NotificationService.cs
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Ojala.Contracts.Interfaces;

namespace Ojala.Api.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(ILogger<NotificationService> logger)
        {
            _logger = logger;
        }

        public Task NotifyOnCallMDsAsync(string subject, string message)
        {
            _logger.LogInformation("Simulated notification: {Subject} - {Message}", subject, message);
            return Task.CompletedTask;
        }
    }
}
