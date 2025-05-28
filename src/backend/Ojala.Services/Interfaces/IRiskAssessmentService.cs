using System;
using System.Collections.Generic;
using Ojala.Contracts.Models;

namespace Ojala.Services.Interfaces
{
    public interface IRiskAssessmentService
    {
        RiskAssessment GetRiskAssessment(string patientId);
        IEnumerable<RiskAssessment> GetRiskAssessmentHistory(string patientId, DateTime startDate, DateTime endDate);
        IEnumerable<RiskFactor> GetCommonRiskFactors();
    }
}
