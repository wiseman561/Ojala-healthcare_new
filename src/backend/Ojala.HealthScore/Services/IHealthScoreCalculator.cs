using Ojala.HealthScore.Models;

namespace Ojala.HealthScore.Services;

public interface IHealthScoreCalculator
{
    HealthScoreResponse CalculateScore(HealthScoreRequest request);
} 