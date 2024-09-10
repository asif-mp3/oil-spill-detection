import React, { useState, useEffect } from "react";
import InputLabel from '@mui/material/InputLabel';
import { visuallyHidden } from '@mui/utils';
import { TextField, Button } from "@mui/material";

const ShipInfo = () => {
    const [mmsi, setMmsi] = useState("");
    const [shipData, setShipData] = useState(null);
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Create WebSocket connection when button is clicked
      const socket = new WebSocket("wss://stream.aisstream.io/v0/stream ");
  
      socket.onopen = () => {
        console.log("WebSocket connected.");
  
        const subscriptionMessage = {
          ApiKey: "836c9036603183429d928b5d7cf6f12d0ccc0627",
          BoundingBoxes: [[-90, -180], [90, 180]],
          FiltersShipMMSI: [mmsi],  // Use the MMSI entered by the user
          FilterMessageTypes: ["PositionReport"],
        };
  
        // Send the subscription message within 3 seconds of WebSocket connection
        socket.send(JSON.stringify(subscriptionMessage));
        console.log("Subscription message sent:", subscriptionMessage);
      };
  
      socket.onmessage = (event) => {
        const aisMessage = JSON.parse(event.data);
        setShipData(aisMessage);
        console.log("Received AIS data:", aisMessage);
      };
  
      socket.onclose = () => {
        console.log("WebSocket connection closed.");
      };
  
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
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

      {shipData && <pre>{JSON.stringify(shipData, null, 2)}</pre>}
    </div>
  );
};

export default ShipInfo;
