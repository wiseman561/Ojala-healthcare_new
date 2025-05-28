import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardTitle, Table, Badge, Button, Spinner } from 'reactstrap';
import axios from 'axios';
import { format } from 'date-fns';

const CohortTelemetryGrid = ({ nurseId }) => {
  const [patientsData, setPatientsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  // Define threshold ranges for different metrics
  const thresholds = {
    heartRate: { low: 60, high: 100, unit: 'bpm' },
    bloodPressureSystolic: { low: 90, high: 140, unit: 'mmHg' },
    bloodPressureDiastolic: { low: 60, high: 90, unit: 'mmHg' },
    oxygenSaturation: { low: 94, high: 100, unit: '%' },
    temperature: { low: 36.1, high: 37.8, unit: '°C' },
    respiratoryRate: { low: 12, high: 20, unit: 'breaths/min' },
    bloodGlucose: { low: 70, high: 180, unit: 'mg/dL' },
    weight: { unit: 'kg' } // Weight doesn't have standard thresholds
  };

  // Fetch patients and their latest telemetry data
  const fetchPatientsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, get assigned patients for the nurse
      const patientsResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/nurses/${nurseId}/patients`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      const patients = patientsResponse.data;
      
      // For each patient, get their latest telemetry data
      const patientsWithTelemetry = await Promise.all(
        patients.map(async (patient) => {
          try {
            // Get the patient's device(s)
            const devicesResponse = await axios.get(
              `${process.env.REACT_APP_API_URL}/patients/${patient.id}/devices`,
              {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );
            
            const devices = devicesResponse.data;
            
            // If patient has no devices, return patient with empty telemetry
            if (!devices || devices.length === 0) {
              return {
                ...patient,
                devices: [],
                latestTelemetry: {}
              };
            }
            
            // Get latest telemetry for each device
            const devicesWithTelemetry = await Promise.all(
              devices.map(async (device) => {
                try {
                  const telemetryResponse = await axios.get(
                    `${process.env.REACT_APP_API_URL}/devices/${device.id}/telemetry?range=1h&limit=1`,
                    {
                      headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                      },
                    }
                  );
                  
                  return {
                    ...device,
                    telemetry: telemetryResponse.data.data || []
                  };
                } catch (err) {
                  console.error(`Error fetching telemetry for device ${device.id}:`, err);
                  return {
                    ...device,
                    telemetry: []
                  };
                }
              })
            );
            
            // Combine all telemetry data from all devices
            const allTelemetry = devicesWithTelemetry.flatMap(device => device.telemetry);
            
            // Group by metric and get the latest reading for each
            const latestTelemetry = {};
            allTelemetry.forEach(reading => {
              const metric = reading.metric;
              
              // For blood pressure, handle systolic and diastolic separately
              if (metric === 'bloodPressure') {
                const [systolic, diastolic] = reading.value.split('/').map(v => parseInt(v, 10));
                
                // Update systolic if it's newer
                if (!latestTelemetry.bloodPressureSystolic || 
                    new Date(reading.timestamp) > new Date(latestTelemetry.bloodPressureSystolic.timestamp)) {
                  latestTelemetry.bloodPressureSystolic = {
                    value: systolic,
                    timestamp: reading.timestamp,
                    unit: 'mmHg'
                  };
                }
                
                // Update diastolic if it's newer
                if (!latestTelemetry.bloodPressureDiastolic || 
                    new Date(reading.timestamp) > new Date(latestTelemetry.bloodPressureDiastolic.timestamp)) {
                  latestTelemetry.bloodPressureDiastolic = {
                    value: diastolic,
                    timestamp: reading.timestamp,
                    unit: 'mmHg'
                  };
                }
              } else {
                // For other metrics, update if it's newer
                if (!latestTelemetry[metric] || 
                    new Date(reading.timestamp) > new Date(latestTelemetry[metric].timestamp)) {
                  latestTelemetry[metric] = {
                    value: typeof reading.value === 'number' ? reading.value : parseFloat(reading.value),
                    timestamp: reading.timestamp,
                    unit: reading.unit || ''
                  };
                }
              }
            });
            
            return {
              ...patient,
              devices: devicesWithTelemetry,
              latestTelemetry
            };
          } catch (err) {
            console.error(`Error processing patient ${patient.id}:`, err);
            return {
              ...patient,
              devices: [],
              latestTelemetry: {}
            };
          }
        })
      );
      
      setPatientsData(patientsWithTelemetry);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch patients data. Please try again.');
      setLoading(false);
      console.error('Error fetching patients data:', err);
    }
  };

  // Determine status badge color based on value and thresholds
  const getStatusBadge = (metric, value) => {
    if (metric === 'bloodPressureSystolic' || metric === 'bloodPressureDiastolic') {
      const thresholdConfig = thresholds[metric];
      
      if (value < thresholdConfig.low) {
        return <Badge bg="warning" className="rounded-pill">Low</Badge>;
      } else if (value > thresholdConfig.high) {
        return <Badge bg="danger" className="rounded-pill">High</Badge>;
      } else {
        return <Badge bg="success" className="rounded-pill">Normal</Badge>;
      }
    } else if (metric in thresholds) {
      const thresholdConfig = thresholds[metric];
      
      if ('low' in thresholdConfig && 'high' in thresholdConfig) {
        if (value < thresholdConfig.low) {
          return <Badge bg="warning" className="rounded-pill">Low</Badge>;
        } else if (value > thresholdConfig.high) {
          return <Badge bg="danger" className="rounded-pill">High</Badge>;
        } else {
          return <Badge bg="success" className="rounded-pill">Normal</Badge>;
        }
      }
    }
    
    return <Badge bg="secondary" className="rounded-pill">--</Badge>;
  };

  // Format value with unit
  const formatValueWithUnit = (value, unit) => {
    if (value === undefined || value === null) {
      return '--';
    }
    return `${value} ${unit || ''}`;
  };

  // Toggle real-time updates
  const toggleRealTimeUpdates = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    } else {
      const interval = setInterval(fetchPatientsData, 60000); // Poll every minute
      setPollingInterval(interval);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchPatientsData();
    
    // Cleanup polling interval on unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [nurseId]);

  return (
    <Card className="shadow-sm mb-3 rounded-3">
      <CardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
        <CardTitle tag="h5" className="mb-0">Patient Telemetry Dashboard</CardTitle>
        <div>
          <Button 
            color={pollingInterval ? 'light' : 'outline-light'} 
            size="sm"
            onClick={toggleRealTimeUpdates}
            className="rounded-2"
          >
            {pollingInterval ? 'Real-time: ON' : 'Real-time: OFF'}
          </Button>
          <Button 
            color="outline-light" 
            size="sm"
            className="ms-2 rounded-2" 
            onClick={fetchPatientsData}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        {loading && patientsData.length === 0 ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
            <p className="mt-2">Loading patient data...</p>
          </div>
        ) : (
          <>
            {patientsData.length === 0 ? (
              <div className="alert alert-info">
                No patients assigned to this nurse.
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover bordered className="align-middle">
                  <thead>
                    <tr>
                      <th className="fw-bold">Patient</th>
                      <th className="fw-bold">Heart Rate</th>
                      <th className="fw-bold">Blood Pressure</th>
                      <th className="fw-bold">Oxygen</th>
                      <th className="fw-bold">Temperature</th>
                      <th className="fw-bold">Respiratory Rate</th>
                      <th className="fw-bold">Blood Glucose</th>
                      <th className="fw-bold">Last Updated</th>
                      <th className="fw-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientsData.map(patient => {
                      const telemetry = patient.latestTelemetry;
                      const hasDevices = patient.devices && patient.devices.length > 0;
                      const hasTelemetry = Object.keys(telemetry).length > 0;
                      
                      // Find the most recent timestamp across all metrics
                      let latestTimestamp = null;
                      if (hasTelemetry) {
                        Object.values(telemetry).forEach(reading => {
                          const timestamp = new Date(reading.timestamp);
                          if (!latestTimestamp || timestamp > latestTimestamp) {
                            latestTimestamp = timestamp;
                          }
                        });
                      }
                      
                      return (
                        <tr key={patient.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="ms-2">
                                <div className="fw-bold">{patient.lastName}, {patient.firstName}</div>
                                <div className="text-muted small">ID: {patient.id}</div>
                                {!hasDevices && (
                                  <Badge bg="warning" className="mt-1 rounded-pill">No Devices</Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            {telemetry.heartRate ? (
                              <div>
                                {formatValueWithUnit(telemetry.heartRate.value, telemetry.heartRate.unit)}
                                <div>{getStatusBadge('heartRate', telemetry.heartRate.value)}</div>
                              </div>
                            ) : (
                              <span className="text-muted">--</span>
                            )}
                          </td>
                          <td>
                            {telemetry.bloodPressureSystolic && telemetry.bloodPressureDiastolic ? (
                              <div>
                                {telemetry.bloodPressureSystolic.value}/{telemetry.bloodPressureDiastolic.value} mmHg
                                <div className="d-flex gap-1 mt-1">
                                  {getStatusBadge('bloodPressureSystolic', telemetry.bloodPressureSystolic.value)}
                                  {getStatusBadge('bloodPressureDiastolic', telemetry.bloodPressureDiastolic.value)}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted">--</span>
                            )}
                          </td>
                          <td>
                            {telemetry.oxygenSaturation ? (
                              <div>
                                {formatValueWithUnit(telemetry.oxygenSaturation.value, telemetry.oxygenSaturation.unit)}
                                <div>{getStatusBadge('oxygenSaturation', telemetry.oxygenSaturation.value)}</div>
                              </div>
                            ) : (
                              <span className="text-muted">--</span>
                            )}
                          </td>
                          <td>
                            {telemetry.temperature ? (
                              <div>
                                {formatValueWithUnit(telemetry.temperature.value, telemetry.temperature.unit)}
                                <div>{getStatusBadge('temperature', telemetry.temperature.value)}</div>
                              </div>
                            ) : (
                              <span className="text-muted">--</span>
                            )}
                          </td>
                          <td>
                            {telemetry.respiratoryRate ? (
                              <div>
                                {formatValueWithUnit(telemetry.respiratoryRate.value, telemetry.respiratoryRate.unit)}
                                <div>{getStatusBadge('respiratoryRate', telemetry.respiratoryRate.value)}</div>
                              </div>
                            ) : (
                              <span className="text-muted">--</span>
                            )}
                          </td>
                          <td>
                            {telemetry.bloodGlucose ? (
                              <div>
                                {formatValueWithUnit(telemetry.bloodGlucose.value, telemetry.bloodGlucose.unit)}
                                <div>{getStatusBadge('bloodGlucose', telemetry.bloodGlucose.value)}</div>
                              </div>
                            ) : (
                              <span className="text-muted">--</span>
                            )}
                          </td>
                          <td>
                            {latestTimestamp ? (
                              <div>
                                <div>{format(latestTimestamp, 'MMM d, yyyy')}</div>
                                <div className="text-muted small">{format(latestTimestamp, 'h:mm a')}</div>
                              </div>
                            ) : (
                              <span className="text-muted">No data</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button 
                                color="primary" 
                                size="sm" 
                                tag="a" 
                                href={`/patients/${patient.id}/telemetry`}
                                className="rounded-2"
                              >
                                Details
                              </Button>
                              <Button 
                                color="secondary" 
                                size="sm"
                                tag="a"
                                href={`/patients/${patient.id}/profile`}
                                className="rounded-2"
                              >
                                Profile
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default CohortTelemetryGrid;

