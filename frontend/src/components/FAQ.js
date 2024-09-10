import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function FAQ() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


  return (
    <Container
      id="faq"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Typography
        component="h2"
        variant="h4"
        sx={{
          color: 'text.primary',
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        Frequently asked questions
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Accordion
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1d-content"
            id="panel1d-header"
          >
            <Typography component="h3" variant="subtitle2">
                What is this system used for?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              textAlign="left"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              This system detects oil spills in marine environments using satellite imagery
              and Automatic Identification System (AIS) data. It helps monitor and identify spills in 
              real-time, ensuring rapid response to mitigate environmental damage.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel2'}
          onChange={handleChange('panel2')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2d-content"
            id="panel2d-header"
          >
            <Typography component="h3" variant="subtitle2">
              What kind of data does the system use?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              textAlign="left"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              The system primarily uses two types of data:

              <br/>AIS Data: This data is used to track ship movements in real-time.
              <br/>SAR Imagery: Satellite-based radar images are used to detect oil spills 
              on the ocean surface.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel3'}
          onChange={handleChange('panel3')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3d-content"
            id="panel3d-header"
          >
            <Typography component="h3" variant="subtitle2">
              How accurate is the spill detection?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              textAlign="left"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
            The system leverages advanced deep learning models trained on satellite data, 
            offering high accuracy in distinguishing between water and oil slicks. 
            It also integrates AIS data to accurately link spills to potential sources.

            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel4'}
          onChange={handleChange('panel4')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4d-content"
            id="panel4d-header"
          >
            <Typography component="h3" variant="subtitle2">
              What technologies are used in the system?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              textAlign="left"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
            The system is built using cutting-edge technologies like Convolutional Neural Networks (CNNs), 
            real-time satellite data (SAR), AIS APIs for ship tracking, and cloud services for processing 
            and storage.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
}
