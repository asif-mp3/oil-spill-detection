import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import Box from '@mui/material/Box';
import icon from '../assets/euler6ix_v3.png';

export default function SitemarkIcon() {
  return (
    <Box
      sx={{
        width: 104,
        height: 44,
        backgroundImage: `url(${icon})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        display: 'inline-block',
      }}
    /> 
  );
}
