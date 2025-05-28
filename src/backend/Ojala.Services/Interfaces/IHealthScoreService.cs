using System;
using System.Collections.Generic;
using Ojala.Contracts.Models;

namespace Ojala.Services.Interfaces
{
    public interface IHealthScoreService
    {
        HealthScoreData GetHealthScore(string patientId);
        IEnumerable<HealthScoreData> GetHealthScoreHistory(string patientId, DateTime startDate, DateTime endDate);
        IEnumerable<ChartData> GetHealthScoreDistribution();

    }
}
