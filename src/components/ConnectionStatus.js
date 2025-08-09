import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import UsbIcon from '../icons/Usb'
import TrackerIcon from '../icons/Tracker'

const ConnectionStatus = ({ connectionType }) => {
    const { t } = useTranslation()

    if (!connectionType) return null

    const getConnectionInfo = () => {
        switch (connectionType) {
            case 'receiver':
                return {
                    text: t('connectionStatus.usbReceiver'),
                    icon: <UsbIcon width={20} height={20} color="#4caf50" />
                }
            case 'tracker':
                return {
                    text: t('connectionStatus.tracker'),
                    icon: <TrackerIcon width={20} height={20} color="#2196f3" />
                }
            default:
                return null
        }
    }

    const connectionInfo = getConnectionInfo()
    
    if (!connectionInfo) return null

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                py: 1,
                px: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 1,
                margin: '8px 12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
        >
            {connectionInfo.icon}
            <Typography
                variant="body2"
                sx={{
                    color: '#ffffff',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                }}
            >
                {connectionInfo.text}
            </Typography>
        </Box>
    )
}

ConnectionStatus.propTypes = {
    connectionType: PropTypes.oneOf(['receiver', 'tracker', null]),
}

export default ConnectionStatus
