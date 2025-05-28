using System;
using System.Collections.Generic;
using Ojala.Contracts.Models;

namespace Ojala.Services.Interfaces
{
    public interface IRecommendationService
    {
        IEnumerable<NurseAssistantRecommendation> GetPendingRecommendations();
        IEnumerable<NurseAssistantRecommendation> GetPatientRecommendations(string patientId);
        NurseAssistantRecommendation GetRecommendation(string recommendationId);
        void UpdateRecommendationStatus(string recommendationId, RecommendationStatus status, string reviewedBy, string? notes = null);
        void CreateRecommendation(NurseAssistantRecommendation recommendation);
    }
}
