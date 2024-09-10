import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import Box from '@mui/material/Box';
import icon from '../assets/MainLogoFinal.png';

export default function LogoIcon() {
  return (
    <Box
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
