import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Button,
  TextField,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tooltip
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import axios from 'axios';

const TelehealthRoom = ({ sessionId, onEndCall }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [notes, setNotes] = useState('');
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const twilioRoomRef = useRef(null);
  
  useEffect(() => {
    // Fetch session details and initialize Twilio
    fetchSessionDetails();
    
    // Clean up when component unmounts
    return () => {
      disconnectFromTwilio();
    };
  }, [sessionId]);
  
  const fetchSessionDetails = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/telehealth/session/${sessionId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setSession(response.data);
      
      // Initialize Twilio with the token from the response
      if (response.data.twilioToken) {
        initializeTwilio(response.data.twilioToken);
      } else {
        setError('No Twilio token available for this session.');
      }
    } catch (error) {
      console.error('Error fetching session details:', error);
      setError('Failed to load session details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const initializeTwilio = async (token) => {
    try {
      // In a real implementation, this would use the Twilio Video SDK
      // For this implementation, we'll simulate the connection
      
      // Simulate connecting to Twilio
      setTimeout(() => {
        setConnected(true);
        
        // Simulate getting local video stream
        if (localVideoRef.current) {
          // In a real implementation, this would be:
          // localVideoRef.current.srcObject = localStream;
          
          // For simulation, we'll just add a placeholder
          localVideoRef.current.poster = '/assets/local-video-placeholder.jpg';
        }
        
        // Simulate getting remote video stream
        if (remoteVideoRef.current) {
          // In a real implementation, this would be:
          // remoteVideoRef.current.srcObject = remoteStream;
          
          // For simulation, we'll just add a placeholder
          remoteVideoRef.current.poster = '/assets/remote-video-placeholder.jpg';
        }
      }, 2000);
    } catch (error) {
      console.error('Error initializing Twilio:', error);
      setError('Failed to connect to the video session. Please try again.');
    }
  };
  
  const disconnectFromTwilio = () => {
    // In a real implementation, this would disconnect from Twilio
    // For this implementation, we'll just simulate disconnection
    
    if (twilioRoomRef.current) {
      // twilioRoomRef.current.disconnect();
      twilioRoomRef.current = null;
    }
    
    setConnected(false);
  };
  
  const toggleAudio = () => {
    // In a real implementation, this would enable/disable the audio track
    // For this implementation, we'll just toggle the state
    setAudioEnabled(!audioEnabled);
  };
  
  const toggleVideo = () => {
    // In a real implementation, this would enable/disable the video track
    // For this implementation, we'll just toggle the state
    setVideoEnabled(!videoEnabled);
  };
  
  const toggleScreenSharing = () => {
    // In a real implementation, this would start/stop screen sharing
    // For this implementation, we'll just toggle the state
    setScreenSharing(!screenSharing);
  };
  
  const endCall = async () => {
    try {
      // Disconnect from Twilio
      disconnectFromTwilio();
      
      // Update session status to completed
      await axios.post(
        `${process.env.REACT_APP_API_URL}/telehealth/end-session/${sessionId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Save notes if any
      if (notes.trim()) {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/telehealth/session-notes/${sessionId}`,
          { notes },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      }
      
      // Call the onEndCall callback
      if (onEndCall) {
        onEndCall();
      }
    } catch (error) {
      console.error('Error ending call:', error);
      setError('Failed to properly end the session. Please try again.');
    }
  };
  
  const sendChatMessage = () => {
    if (!messageText.trim()) return;
    
    // In a real implementation, this would send the message through Twilio
    // For this implementation, we'll just add it to the local state
    
    const newMessage = {
      id: Date.now().toString(),
      sender: 'You',
      text: messageText,
      timestamp: new Date().toISOString()
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setMessageText('');
  };
  
  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchSessionDetails} 
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!session) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>No session data available.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">
              Session with {session.patientName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(session.scheduledAt).toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Chip 
              label={connected ? 'Connected' : 'Connecting...'}
              color={connected ? 'success' : 'warning'}
            />
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid item xs={12} md={showChat ? 8 : 12}>
          <Box sx={{ position: 'relative', height: '100%', minHeight: '400px' }}>
            {/* Main video (remote participant) */}
            <Box 
              component="video"
              ref={remoteVideoRef}
              autoPlay
              playsInline
              muted={false}
              sx={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                backgroundColor: '#000',
                borderRadius: 1
              }}
            />
            
            {/* Local video (picture-in-picture) */}
            <Box 
              component="video"
              ref={localVideoRef}
              autoPlay
              playsInline
              muted={true}
              sx={{ 
                position: 'absolute',
                bottom: 16,
                right: 16,
                width: '25%',
                maxWidth: '200px',
                borderRadius: 1,
                border: '2px solid white',
                backgroundColor: '#000'
              }}
            />
            
            {/* Video controls */}
            <Box 
              sx={{ 
                position: 'absolute',
                bottom: 16,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: 2
              }}
            >
              <Tooltip title={audioEnabled ? 'Mute Microphone' : 'Unmute Microphone'}>
                <IconButton 
                  onClick={toggleAudio}
                  sx={{ 
                    backgroundColor: audioEnabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,0,0,0.6)',
                    '&:hover': {
                      backgroundColor: audioEnabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,0,0,0.8)'
                    }
                  }}
                >
                  {audioEnabled ? <MicIcon /> : <MicOffIcon />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title={videoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}>
                <IconButton 
                  onClick={toggleVideo}
                  sx={{ 
                    backgroundColor: videoEnabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,0,0,0.6)',
                    '&:hover': {
                      backgroundColor: videoEnabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,0,0,0.8)'
                    }
                  }}
                >
                  {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title={screenSharing ? 'Stop Sharing Screen' : 'Share Screen'}>
                <IconButton 
                  onClick={toggleScreenSharing}
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  {screenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title={showChat ? 'Hide Chat' : 'Show Chat'}>
                <IconButton 
                  onClick={() => setShowChat(!showChat)}
                  sx={{ 
                    backgroundColor: showChat ? 'rgba(0,0,255,0.2)' : 'rgba(255,255,255,0.2)',
                    '&:hover': {
                      backgroundColor: showChat ? 'rgba(0,0,255,0.3)' : 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  <ChatIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="End Call">
                <IconButton 
                  onClick={endCall}
                  sx={{ 
                    backgroundColor: 'rgba(255,0,0,0.6)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,0,0,0.8)'
                    }
                  }}
                >
                  <CallEndIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Grid>
        
        {showChat && (
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardHeader 
                title="Session Chat" 
                titleTypographyProps={{ variant: 'h6' }}
              />
              
              <Divider />
              
              <CardContent sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
                <List sx={{ p: 0 }}>
                  {chatMessages.length === 0 ? (
                    <ListItem>
                      <ListItemText 
                        primary="No messages yet" 
                        secondary="Start the conversation by sending a message." 
                        primaryTypographyProps={{ align: 'center' }}
                        secondaryTypographyProps={{ align: 'center' }}
                      />
                    </ListItem>
                  ) : (
                    chatMessages.map((message) => (
                      <ListItem key={message.id} alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={message.sender}
                          secondary={
                            <>
                              {message.text}
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                                sx={{ display: 'block', mt: 0.5, fontSize: '0.75rem' }}
                              >
                                {formatTime(message.timestamp)}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </CardContent>
              
              <Divider />
              
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  variant="outlined"
                  size="small"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendChatMessage();
                    }
                  }}
                />
                <IconButton 
                  color="primary" 
                  onClick={sendChatMessage}
                  disabled={!messageText.trim()}
                  sx={{ ml: 1 }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        )}
      </Grid>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Session Notes
          <NoteAddIcon sx={{ ml: 1, verticalAlign: 'middle' }} />
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Enter notes about this session..."
          value={notes}
          onChange={handleNotesChange}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Notes will be saved automatically when the session ends.
        </Typography>
      </Paper>
    </Box>
  );
};

export default TelehealthRoom;
