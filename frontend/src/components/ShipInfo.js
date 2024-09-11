import React, { useState, useEffect } from "react";
import InputLabel from '@mui/material/InputLabel';
import { visuallyHidden } from '@mui/utils';
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { styled } from '@mui/material/styles';

const API_KEY = "836c9036603183429d928b5d7cf6f12d0ccc0627";


const StyledBox = styled('div')(({ theme }) => ({
  alignSelf: 'center',
  width: '100%',
  height: 400,
  marginTop: theme.spacing(8),
  borderRadius: theme.shape.borderRadius,
  outline: '6px solid',
  outlineColor: 'hsla(220, 25%, 80%, 0.2)',
  border: '1px solid',
  borderColor: theme.palette.grey[200],
  boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
  backgroundImage: `url(${'/static/screenshots/material-ui/getting-started/templates/dashboard.jpg'})`,
  backgroundSize: 'cover',
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(10),
    height: 700,
  },
  ...theme.applyStyles('dark', {
    boxShadow: '0 0 24px 12px hsla(210, 100%, 25%, 0.2)',
    backgroundImage: `url(${'/static/screenshots/material-ui/getting-started/templates/dashboard-dark.jpg'})`,
    outlineColor: 'hsla(220, 20%, 42%, 0.1)',
    borderColor: theme.palette.grey[700],
  }),
}));


const ShipInfo = () => {
    const [mmsi, setMmsi] = useState('');
    const [ws, setWs] = useState(null);
    const [error, setError] = useState(null);
    const [position, setPosition] = useState(null);
    const [loading, setLoading] = useState(false); 
  
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (mmsi) {
          // Open WebSocket connection to FastAPI backend
          const socket = new WebSocket("ws://localhost:8000/ws/ship"); // Update URL if necessary
          setLoading(true);
    
          socket.onopen = () => {
            console.log('WebSocket connection opened');
            socket.send(JSON.stringify({ mmsi }));
          };
    
          socket.onmessage = (event) => {
            console.log(event.data);
            const data = JSON.parse(event.data);
            console.log('Received data:', data);
            // Update state with position data
            if (data.ShipId) {
                console.log(data);
                setPosition({
                    ShipId: data.ShipId,
                    Latitude: data.Latitude,
                    Longitude: data.Longitude
                })
                setError(null);
                setLoading(false);
            } else {
              console.error('No data received or invalid response');
              setLoading(false);
            }
          };
    
          socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setLoading(false);
          };
    
          socket.onclose = () => {
            console.log('WebSocket connection closed');
            setLoading(false);
          };
    
          // Cleanup WebSocket connection when not needed anymore
          setWs(socket);
        } else {
          console.error('MMSI number is empty');
        }
      };
    
 
  return (
    <div>
      <form 
      onSubmit={handleSubmit}
      style={{ display: 'flex', alignItems: 'center', gap: '10px' }} >
        <InputLabel htmlFor="shipnumber" sx={visuallyHidden}>
            ShipNumber
        </InputLabel>
        <TextField
          id="ShipNumber"
          hiddenLabel
          size="small"
          variant="outlined"
          aria-label="Enter Ship ID"
          placeholder="Your Ship's MMSI number"
          fullWidth
          value={mmsi}
          onChange={(e) => setMmsi(e.target.value)}
          margin="normal"
          sx={{ flexGrow: 1 }}
        />
        
        <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            sx={{ minWidth: 'fit-content' }}
        >
            Track now
        </Button>

        {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <CircularProgress />
          <span style={{ marginLeft: '10px' }}>Obtaining AIS data from Server...</span>
        </div>
        )}

        {position && !loading && (
            <div>
            <br/>
            <br/>
            <hr/>
            <Typography
                sx={{
                    textAlign: 'center',
                    width: { sm: '100%', md: '100%' },
                    fontSize: 'clamp(1.5rem, 7vw, 1.5rem)',
                }}
            >
                Ship Position:
            </Typography>
            
            <Typography
                sx={{
                    textAlign: 'Left',
                    width: { sm: '100%', md: '80%' },
                    fontSize: 'clamp(1rem, 7vw, 1rem)',
                }}
            >
            Ship ID: {position.ShipId}<br/>
            Latitude: {position.Latitude}<br/>
            Longitude: {position.Longitude}<br/>
            Heading: {position.Heading}<br/>
            </Typography>

            </div>
        )}

        {error && !loading && (
            <div style={{ color: 'red' }}>
            <p>{error}</p>
            </div>
        )}
      </form>

      {/* {shipData && <pre>{JSON.stringify(shipData, null, 2)}</pre>} */}
    </div>
  );
};

export default ShipInfo;
