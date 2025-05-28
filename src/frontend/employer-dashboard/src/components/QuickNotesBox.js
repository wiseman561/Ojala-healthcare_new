import React, { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Button,
  Typography,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Save as SaveIcon,
  ContentCopy as ContentCopyIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

/**
 * QuickNotesBox Component
 * 
 * Allows MDs to enter short visit notes that can be stored in the patient profile
 * or exported to EHR if integrated.
 */
const QuickNotesBox = ({ patientId, patientName }) => {
  const [noteText, setNoteText] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveNote = () => {
    if (noteText.trim() === '') return;

    const newNote = {
      id: Date.now().toString(),
      text: noteText,
      timestamp: new Date(),
      patientId,
      author: 'Dr. Michael Johnson' // In a real app, this would come from the logged-in user
    };

    // In a real implementation, this would save to an API
    setSavedNotes([newNote, ...savedNotes]);
    setNoteText('');
    
    // Show success message briefly
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleDeleteNote = (noteId) => {
    const noteToRemove = savedNotes.find(note => note.id === noteId);
    setNoteToDelete(noteToRemove);
    setConfirmDialogOpen(true);
  };

  const confirmDeleteNote = () => {
    if (noteToDelete) {
      setSavedNotes(savedNotes.filter(note => note.id !== noteToDelete.id));
    }
    setConfirmDialogOpen(false);
    setNoteToDelete(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <>
      <Card elevation={2}>
        <CardHeader 
          title="Quick Notes" 
          subheader={`For ${patientName || 'patient'}`}
          action={
            savedNotes.length > 0 && (
              <Tooltip title="View note history">
                <IconButton onClick={() => setShowHistory(!showHistory)}>
                  <HistoryIcon />
                </IconButton>
              </Tooltip>
            )
          }
        />
        <CardContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Enter clinical notes, observations, or follow-up instructions..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          
          {saveSuccess && (
            <Box display="flex" alignItems="center" mt={1} sx={{ color: 'success.main' }}>
              <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">Note saved successfully</Typography>
            </Box>
          )}
          
          {showHistory && savedNotes.length > 0 && (
            <Box mt={3}>
              <Typography variant="subtitle2" gutterBottom>
                Recent Notes
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {savedNotes.map((note, index) => (
                <Box key={note.id} mb={2} p={2} bgcolor="background.paper" borderRadius={1} border={1} borderColor="divider">
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="caption" color="textSecondary">
                      {formatDate(note.timestamp)}
                    </Typography>
                    <Box>
                      <Tooltip title="Copy to clipboard">
                        <IconButton size="small" onClick={() => handleCopyToClipboard(note.text)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete note">
                        <IconButton size="small" onClick={() => handleDeleteNote(note.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="body2">{note.text}</Typography>
                  <Box mt={1}>
                    <Chip 
                      label={note.author} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<SaveIcon />}
            onClick={handleSaveNote}
            disabled={noteText.trim() === ''}
          >
            Save Note
          </Button>
        </CardActions>
      </Card>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Delete Note</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this note? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDeleteNote} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QuickNotesBox;
