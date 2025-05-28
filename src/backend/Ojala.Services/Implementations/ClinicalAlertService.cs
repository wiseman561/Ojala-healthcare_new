﻿using System;
using System.Collections.Generic;
using Ojala.Services.Interfaces;
using Ojala.Contracts.Models;
using Ojala.Data;

namespace Ojala.Services.Implementations
{
    public class ClinicalAlertService : IClinicalAlertService
    {
        private readonly OjalaDbContext _db;

        public ClinicalAlertService(OjalaDbContext db)
        {
            _db = db;
        }

        public IEnumerable<ClinicalAlert> GetActiveAlerts()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ClinicalAlert> GetPatientAlerts(string patientId)
        {
            throw new NotImplementedException();
        }

        public ClinicalAlert GetAlert(string alertId)
        {
            throw new NotImplementedException();
        }

        public void UpdateAlertStatus(string alertId, AlertStatus status, string? notes = null)
        {
            throw new NotImplementedException();
        }

        public void CreateAlert(ClinicalAlert alert)
        {
            throw new NotImplementedException();
        }
    }
}
