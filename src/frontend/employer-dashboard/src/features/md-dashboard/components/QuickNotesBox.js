import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';

const QuickNotesBox = ({ patientId, patientName }) => {
  const [note, setNote] = useState('');

  const handleSaveNote = () => {
    // Save note logic here
    console.log(`Saving note for patient ${patientId}: ${note}`);
    setNote('');
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Quick Notes - {patientName}
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a quick note about this patient..."
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSaveNote}
          disabled={!note.trim()}
        >
          Save Note
        </Button>
      </Box>
    </Paper>
  );
};

export default QuickNotesBox; 