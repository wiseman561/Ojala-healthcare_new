// File: src/backend/Ojala.Api/Interfaces/INotificationService.cs
namespace Ojala.Contracts.Interfaces
{
    public interface INotificationService
    {
        Task NotifyOnCallMDsAsync(string subject, string message);
    }
}
