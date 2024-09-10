import React, { useState, useEffect } from "react";
import InputLabel from '@mui/material/InputLabel';
import { visuallyHidden } from '@mui/utils';
import { TextField, Button } from "@mui/material";

const API_KEY = "836c9036603183429d928b5d7cf6f12d0ccc0627";

const ShipInfo = () => {
    const [mmsi, setMmsi] = useState('');
    const [ws, setWs] = useState(null);
    const [position, setPosition] = useState(null);
  
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (mmsi) {
          // Open WebSocket connection to FastAPI backend
          const socket = new WebSocket("ws://localhost:8000/ws/ship"); // Update URL if necessary
    
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
            } else {
              console.error('No data received or invalid response');
            }
          };
    
          socket.onerror = (error) => {
            console.error('WebSocket error:', error);
          };
    
          socket.onclose = () => {
            console.log('WebSocket connection closed');
          };
    
          // Cleanup WebSocket connection when not needed anymore
          setWs(socket);
        } else {
          console.error('MMSI number is empty');
        }
      };
    
 
  return (
    <div>
      <form onSubmit={handleSubmit}>
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
      </form>

      {/* {shipData && <pre>{JSON.stringify(shipData, null, 2)}</pre>} */}
    </div>
  );
};

export default ShipInfo;
