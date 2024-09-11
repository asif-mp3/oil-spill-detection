import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import Box from '@mui/material/Box';
import icon from '../assets/MainLogoFinal.png';
import Hero from './Hero';
import AppAppBar from './AppAppBar';

export default function LogoIcon() {
  const homeRef = React.useRef(null);
  const scrollToHome = () => {
    if (homeRef.current) {
      homeRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }
  return (
    <Box 
      onClick={scrollToHome}
      sx={{
        width: 110,
        height: 50,
        backgroundImage: `url(${icon})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        display: 'inline-block',
      }}
    /> 
  );
}
