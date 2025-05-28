import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography
} from '@mui/material';

const CarePlanApprovalModal = ({ open, onClose, patient, onApprove, onSendBack }) => {
  const [notes, setNotes] = useState('');

  const handleApprove = () => {
    onApprove(patient.id, notes);
    setNotes('');
    onClose();
  };

  const handleSendBack = () => {
    onSendBack(patient.id, notes);
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Review Care Plan - {patient?.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Care Plan Details
          </Typography>
          {/* Add care plan details here */}
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes or feedback about the care plan..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSendBack} color="warning">
          Send Back
        </Button>
        <Button onClick={handleApprove} color="primary" variant="contained">
          Approve
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CarePlanApprovalModal; 