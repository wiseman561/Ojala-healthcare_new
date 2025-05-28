import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Paper,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Assignment as AssignmentIcon,
  Medication as MedicationIcon,
  MonitorHeart as MonitorHeartIcon,
  EventNote as EventNoteIcon,
  History as HistoryIcon
} from '@mui/icons-material';

/**
 * CarePlanApprovalModal Component
 * 
 * A modal dialog for reviewing and approving care plans.
 * Allows MDs to review the plan of care, approve, edit, or send notes back to RN.
 */
const CarePlanApprovalModal = ({ open, onClose, patient, onApprove, onSendBack }) => {
  const [editMode, setEditMode] = useState(false);
  const [notes, setNotes] = useState('');
  const [carePlan, setCarePlan] = useState(patient?.carePlan || {
    goals: [
      'Reduce A1C to below 7.0 within 3 months',
      'Maintain blood pressure below 130/80 mmHg',
      'Increase physical activity to 30 minutes daily',
      'Achieve 5% weight reduction in 6 months'
    ],
    interventions: [
      'Daily glucose monitoring before meals and at bedtime',
      'Weekly nurse check-in via secure messaging',
      'Monthly telehealth appointment with endocrinologist',
      'Dietary consultation for carbohydrate management'
    ],
    medications: [
      { name: 'Metformin', dosage: '1000mg', frequency: 'Twice daily with meals' },
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily in the morning' },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime' }
    ],
    monitoring: [
      'Blood glucose: 4x daily',
      'Blood pressure: Daily',
      'Weight: Weekly',
      'A1C: Every 3 months'
    ],
    lastUpdated: new Date(Date.now() - 172800000), // 2 days ago
    lastUpdatedBy: 'RN Sarah Johnson'
  });

  const [editedCarePlan, setEditedCarePlan] = useState({...carePlan});

  if (!patient) return null;

  const handleApprove = () => {
    onApprove(patient.id, notes);
    onClose();
  };

  const handleSendBack = () => {
    onSendBack(patient.id, notes);
    onClose();
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    setCarePlan(editedCarePlan);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedCarePlan({...carePlan});
    setEditMode(false);
  };

  const handleGoalChange = (index, value) => {
    const updatedGoals = [...editedCarePlan.goals];
    updatedGoals[index] = value;
    setEditedCarePlan({...editedCarePlan, goals: updatedGoals});
  };

  const handleInterventionChange = (index, value) => {
    const updatedInterventions = [...editedCarePlan.interventions];
    updatedInterventions[index] = value;
    setEditedCarePlan({...editedCarePlan, interventions: updatedInterventions});
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...editedCarePlan.medications];
    updatedMedications[index] = {...updatedMedications[index], [field]: value};
    setEditedCarePlan({...editedCarePlan, medications: updatedMedications});
  };

  const handleMonitoringChange = (index, value) => {
    const updatedMonitoring = [...editedCarePlan.monitoring];
    updatedMonitoring[index] = value;
    setEditedCarePlan({...editedCarePlan, monitoring: updatedMonitoring});
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      scroll="paper"
      aria-labelledby="care-plan-approval-dialog-title"
    >
      <DialogTitle id="care-plan-approval-dialog-title">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Care Plan Review: {patient.name}
          </Typography>
          <Chip 
            label={`Health Score: ${patient.healthScore}`} 
            color={patient.healthScore < 40 ? "error" : patient.healthScore < 60 ? "warning" : "success"}
          />
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText component="div">
          <Box mb={2}>
            <Typography variant="subtitle1" gutterBottom>
              Patient Information
            </Typography>
            <Paper variant="outlined" sx={{ p: 3 }}> {/* Changed p: 2 to p: 3 */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Age</Typography>
                  <Typography variant="body1">{patient.age}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Gender</Typography>
                  <Typography variant="body1">{patient.gender}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">Primary Condition</Typography>
                  <Typography variant="body1">{patient.condition}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">Escalation Reason</Typography>
                  <Typography variant="body1">{patient.escalationReason}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle1">
                <Box component="span" display="flex" alignItems="center">
                  <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                  Care Plan Goals
                </Box>
              </Typography>
              {!editMode && (
                <Tooltip title="Edit goals">
                  <IconButton size="small" onClick={handleEdit}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Paper variant="outlined" sx={{ p: 3 }}> {/* Changed p: 2 to p: 3 */}
              {editMode ? (
                <List dense>
                  {editedCarePlan.goals.map((goal, index) => (
                    <ListItem key={index}>
                      <TextField
                        fullWidth
                        value={goal}
                        onChange={(e) => handleGoalChange(index, e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <List dense>
                  {carePlan.goals.map((goal, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={goal} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>

          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              <Box component="span" display="flex" alignItems="center">
                <EventNoteIcon color="primary" sx={{ mr: 1 }} />
                Interventions
              </Box>
            </Typography>
            <Paper variant="outlined" sx={{ p: 3 }}> {/* Changed p: 2 to p: 3 */}
              {editMode ? (
                <List dense>
                  {editedCarePlan.interventions.map((intervention, index) => (
                    <ListItem key={index}>
                      <TextField
                        fullWidth
                        value={intervention}
                        onChange={(e) => handleInterventionChange(index, e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <List dense>
                  {carePlan.interventions.map((intervention, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={intervention} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>

          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              <Box component="span" display="flex" alignItems="center">
                <MedicationIcon color="primary" sx={{ mr: 1 }} />
                Medications
              </Box>
            </Typography>
            <Paper variant="outlined" sx={{ p: 3 }}> {/* Changed p: 2 to p: 3 */}
              {editMode ? (
                <List dense>
                  {editedCarePlan.medications.map((medication, index) => (
                    <ListItem key={index}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="Medication"
                            value={medication.name}
                            onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="Dosage"
                            value={medication.dosage}
                            onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="Frequency"
                            value={medication.frequency}
                            onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <List dense>
                  {carePlan.medications.map((medication, index) => (
                    <ListItem key={index}>
                      <ListItemText 
                        primary={medication.name} 
                        secondary={`${medication.dosage} - ${medication.frequency}`} 
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>

          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              <Box component="span" display="flex" alignItems="center">
                <MonitorHeartIcon color="primary" sx={{ mr: 1 }} />
                Monitoring Plan
              </Box>
            </Typography>
            <Paper variant="outlined" sx={{ p: 3 }}> {/* Changed p: 2 to p: 3 */}
              {editMode ? (
                <List dense>
                  {editedCarePlan.monitoring.map((item, index) => (
                    <ListItem key={index}>
                      <TextField
                        fullWidth
                        value={item}
                        onChange={(e) => handleMonitoringChange(index, e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <List dense>
                  {carePlan.monitoring.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>

          <Box mb={2}>
            <Typography variant="body2" color="textSecondary" display="flex" alignItems="center">
              <HistoryIcon fontSize="small" sx={{ mr: 0.5 }} />
              Last updated {new Date(carePlan.lastUpdated).toLocaleDateString()} by {carePlan.lastUpdatedBy}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              MD Notes
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Add your notes, instructions, or feedback here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {editMode ? (
          <>
            <Button onClick={handleCancel} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary" variant="contained" startIcon={<CheckCircleIcon />}>
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleSendBack} color="secondary" startIcon={<SendIcon />}>
              Send Back to RN
            </Button>
            <Button onClick={handleApprove} color="primary" variant="contained" startIcon={<CheckCircleIcon />}>
              Approve Plan
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CarePlanApprovalModal;

