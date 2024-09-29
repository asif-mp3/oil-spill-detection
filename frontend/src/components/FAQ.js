import React, { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Tooltip } from '@mui/material';

// Custom hook for managing local storage state
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const FAQ = React.forwardRef((props, ref) => {
  const [expanded, setExpanded] = useLocalStorage('expandedPanel', false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container
      ref={ref}
      id="faq"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
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
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
          fontWeight: 700,
          letterSpacing: '0.05em',
        }}
      >
        Frequently Asked Questions
      </Typography>
      <Box sx={{ width: '100%' }}>
        {[
          {
            id: 'panel1',
            question: 'What datasets are used for oil spill detection?',
            answer:
              'We utilize two primary datasets: Automatic Identification System (AIS) data to track ship movements, and Synthetic Aperture Radar (SAR) imagery to detect potential oil spills. SAR provides high-resolution images of the ocean surface, making it ideal for detecting oil slicks.',
            icon: '🛳️',
          },
          {
            id: 'panel2',
            question: 'How accurate is the detection of oil spills using SAR data?',
            answer:
              'The system uses advanced Convolutional Neural Networks (CNNs) trained on satellite data to accurately distinguish between oil spills and natural phenomena. The accuracy is further improved by integrating AIS data to correlate the detected spills with nearby vessels.',
            icon: '🛰️',
          },
          {
            id: 'panel3',
            question: 'How does AIS data contribute to oil spill detection?',
            answer:
              'AIS data allows us to track the exact location of ships in real-time, providing critical context for potential oil spills. By analyzing ship movements, we can pinpoint vessels that might be responsible for detected spills.',
            icon: '📡',
          },
          {
            id: 'panel4',
            question: 'What are the environmental impacts of undetected oil spills?',
            answer:
              'Undetected oil spills can have devastating impacts on marine ecosystems, including the death of marine life, contamination of food chains, and long-term degradation of water quality. Early detection is crucial to minimize these effects.',
            icon: '🌊',
          },
          {
            id: 'panel5',
            question: 'What is the typical response time for oil spill detection?',
            answer:
              'Using real-time SAR imagery and AIS data, our system can detect oil spills within minutes of their occurrence. Once detected, alerts can be sent to environmental agencies and response teams for immediate action.',
            icon: '⏱️',
          },
          {
            id: 'panel6',
            question: 'Can this system differentiate between oil spills and natural phenomena?',
            answer:
              'Yes, our deep learning models are trained on diverse datasets, allowing the system to differentiate between oil spills and natural occurrences like algae blooms, currents, and other oceanic patterns that may look similar.',
            icon: '🔍',
          },
        ].map((faq) => (
          <Accordion
            key={faq.id}
            expanded={expanded === faq.id}
            onChange={handleChange(faq.id)}
            sx={{
              mb: 2,
              borderRadius: '8px',
              backgroundColor: theme.palette.background.default,
              boxShadow: isMobile ? 'none' : theme.shadows[3],
              transition: 'all 0.3s ease-in-out',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${faq.id}-content`}
              id={`${faq.id}-header`}
              sx={{
                '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                  transform: 'rotate(180deg)',
                },
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center',
                },
              }}
              role="button"
              aria-labelledby={`${faq.id}-header`}
              aria-hidden={expanded !== faq.id}
            >
              <Tooltip title={faq.question} arrow>
                <Typography
                  component="h3"
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {faq.icon} &nbsp; {faq.question}
                </Typography>
              </Tooltip>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                textAlign="left"
                gutterBottom
                sx={{
                  maxWidth: { sm: '100%', md: '70%' },
                  color: theme.palette.text.secondary,
                  lineHeight: 1.8,
                }}
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
});
export default FAQ;
