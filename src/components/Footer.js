import React from 'react'
// import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
// import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

// import version from '../version.js'

const Footer = () => {
    // const { t } = useTranslation()
    
    return (
        <Box sx={{ marginTop: 'auto' }}>
            <Typography
                variant='caption'
                align='center'
                display='block'
                sx={{ color: '#ddd' }}>
                madTrackers @2025
            </Typography>
        </Box>
    )
}

export default Footer
