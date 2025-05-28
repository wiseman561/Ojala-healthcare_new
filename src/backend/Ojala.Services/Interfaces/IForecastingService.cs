using System;
using System.Collections.Generic;
using Ojala.Contracts.Models;

namespace Ojala.Services.Interfaces
{
    public interface IForecastingService
    {
        ForecastData GetForecast(string patientId);
        IEnumerable<MetricForecast> GetMetricForecasts(string patientId, IEnumerable<string> metricNames);
        ForecastData GetForecastWithTimeframe(string patientId, int daysAhead);
    }
}
