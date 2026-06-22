import React from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { v, fonts } from '../theme'

const Footer = () => {
    return (
        <Box
            sx={{
                borderTop: `1px solid ${v('border', '#30363d')}`,
                py: 1,
                mt: 'auto',
            }}
        >
            <Typography
                variant='caption'
                align='center'
                display='block'
                sx={{
                    color: v('text-muted', '#8b949e'),
                    fontFamily: fonts.ui,
                    fontSize: '0.72rem',
                }}
            >
                madTrackers &copy;2025
            </Typography>
        </Box>
    )
}

export default Footer
