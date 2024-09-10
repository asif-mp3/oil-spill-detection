import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Features from './Features';
import Highlights from './Highlights';
import Divider from '@mui/material/Divider';
import FAQ from './FAQ';
import Footer from './Footer';
import Hero from './Hero';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  padding: '8px 12px',
}));


export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const homeRef = React.useRef(null);
  const scrollToHome = () => {
    if (homeRef.current) {
      homeRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featuresRef = React.useRef(null);
  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const highlightsRef = React.useRef(null);
  const scrollToHighlights = () => {
    if (highlightsRef.current) {
      highlightsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqRef = React.useRef(null);
  const scrollToFAQ = () => {
    if (faqRef.current) {
      faqRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };


  return (
    <>
      <AppBar
        position="fixed"
        sx={{ boxShadow: 0, bgcolor: 'transparent', backgroundImage: 'none', mt: 10, justifyContent:'space-between' }}
      >
        <Container maxWidth="lg">
          <StyledToolbar variant="dense" disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button variant="text" color="info" size="small" onClick={scrollToHome}>
                  Home
                </Button>
                <Button variant="text" color="info" size="small" onClick={scrollToFeatures}>
                  Features
                </Button>
                <Button variant="text" color="info" size="small" onClick={scrollToHighlights}>
                  Highlights
                </Button>
                <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }} onClick={scrollToFAQ}>
                  FAQ
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 1,
                alignItems: 'center',
              }}
            >
            </Box>
            <Typography 
              color='text.primary'
              variant='body2'
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              by
            </Typography>
            <Box sx={{ display: { sm: 'flex', md: 'none' } }}>
              <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
          </StyledToolbar>
        </Container>
      </AppBar>
      <Hero ref={homeRef}/>

      {/* The Features section should be rendered in your app */}
      <div>
          <Features ref={featuresRef} />
          <Divider />
          <Divider />
          <Highlights ref={highlightsRef}/>
          <Divider />
          <Divider />
          <FAQ ref={faqRef} />
          <Divider />
          <Footer />
        </div>

    </>
  );
}
