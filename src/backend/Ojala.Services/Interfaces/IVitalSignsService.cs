using System;
using System.Collections.Generic;
using Ojala.Contracts.Models;

namespace Ojala.Services.Interfaces
{
    public interface IVitalSignsService
    {
        VitalSignsData GetLatestVitals(string patientId);
        IEnumerable<VitalSignsData> GetVitalsHistory(string patientId, DateTime startDate, DateTime endDate);
        void RecordVitals(VitalSignsData vitals);
        IEnumerable<PatientVitalsSnapshot> GetAbnormalVitals();
    }
}
