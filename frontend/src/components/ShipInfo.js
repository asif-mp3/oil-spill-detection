import React, { useState, useEffect } from "react";
import InputLabel from '@mui/material/InputLabel';
import { visuallyHidden } from '@mui/utils';
import { TextField, Button, Typography, CircularProgress, Stack } from "@mui/material";
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
    const [show_analysis, set_show_analysis] = useState(null);
    const [mmsi, setMmsi] = useState('');
    const [ws, setWs] = useState(null);
    const [error, setError] = useState(null);
    const [position, setPosition] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [loading2, setLoading2] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [yesorno, setYesOrNo] = useState('');


    useEffect(() => {
      if (show_analysis){
        setLoading2(true);
        const timer = setTimeout(() => {
          setLoading2(false)
        }, 5000);

        const timer2 = setTimeout(() => {
          setShowImage(true);
        }, 5000);

        // clearTimeout(timer2);

        return () => clearTimeout(timer);
      }
    }, [show_analysis]);
    
    const handleSubmit = async (event) => {
        set_show_analysis(false);
        event.preventDefault();
        if (mmsi) {
          // Open WebSocket connection to FastAPI backend
          set_show_analysis(false);
          const socket = new WebSocket("ws://localhost:8000/ws/ship"); // Update URL if necessary
          setLoading(true);
    
          socket.onopen = () => {
            console.log('WebSocket connection opened');
            socket.send(JSON.stringify({ mmsi }));
          };
    
          socket.onmessage = async (event) => {
            console.log(event.data);
            
            if(event.data == "No data received"){
              console.log("Error!!!");
              setLoading(false);
              return;
            }

            const data = JSON.parse(event.data);
            console.log('Received data:', data);
            // Update state with position data
            if (data.ShipId) {
                console.log(data);
                setPosition({
                    ShipId: data.ShipId,
                    Latitude: data.Latitude,
                    Longitude: data.Longitude,
                    Heading: data.Heading,
                    SOG: data.SOG,
                    COG: data.COG
                })
                setError(null);
                setLoading(false);
                set_show_analysis(true);
                setYesOrNo(data.yesorno);


            } else {
              console.error('No data received or invalid response');
              setLoading(false);
              set_show_analysis(false);
            }
          };
    
          socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setLoading(false);
            set_show_analysis(false);
          };
    
          socket.onclose = () => {
            console.log('WebSocket connection closed');
            setLoading(false);
            set_show_analysis(false);
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
        </form>

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
            Latitude: {Math.round(position.Latitude * 100) / 100}<br/>
            Longitude: {Math.round(position.Longitude * 100) / 100}<br/>
            Heading: {position.Heading}<br/>
            Speed Over Ground: {position.SOG}<br/>
            Course Over Ground: {position.COG}<br/>
            </Typography>

          </div>
        )}

        {error && !loading && (
            <div style={{ color: 'red' }}>
            <p>{error}</p>
            </div>
        )}

        
        {show_analysis && (
          <div>
          {yesorno == "yes" && (
            <div>
            <Typography
                  sx={{
                      textAlign: 'center',
                      width: { sm: '100%', md: '100%' },
                      fontSize: 'clamp(1.7rem, 7vw, 1.7rem)',
                      color: 'red'
                  }}
              >
                Warning
              </Typography>
            <Typography
              sx = {{
                textAlign: 'center',
                width: { sm: '100%', md: '100%' },
                fontSize: 'clamp(1.1rem, 7vw, 1.1rem)',
              }}>
                Warning: Vessel Anomaly Detected.<br/>
            </Typography>
            </div>
          )}

          {yesorno == "no" && (
            <div>
            <Typography
                  sx={{
                      textAlign: 'center',
                      width: { sm: '100%', md: '100%' },
                      fontSize: 'clamp(1.7rem, 7vw, 1.7rem)',
                  }}
              >
                Information
              </Typography>
            <Typography
              sx = {{
                textAlign: 'center',
                width: { sm: '100%', md: '100%' },
                fontSize: 'clamp(1.1rem, 7vw, 1.1rem)',
              }}>
                No Anomalies detected in Vessel Detected.<br/>
            </Typography>
            </div>
          )}

            {loading2 && (


            <div>
            <Typography
              sx = {{
                textAlign: 'center',
                width: { sm: '100%', md: '100%' },
                fontSize: 'clamp(1.1rem, 7vw, 1.1rem)',
              }}>
                Analysing SAR data....
              </Typography>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <CircularProgress /> {/* or your preferred spinner component */}
              </div>
            </div>
            )}

            {showImage &&  (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Typography>
                  Analysis Completed.
                </Typography>
                <img 
                  src="http://localhost:8000/static/result.jpg"  
                  alt="SAR Analysis" 
                  style={{ maxWidth: '100%', maxHeight: '100%' }} />
              </div>
            )}

          </div>
        )}



      {/* {shipData && <pre>{JSON.stringify(shipData, null, 2)}</pre>} */}
    </div>
  );
};

export default ShipInfo;
