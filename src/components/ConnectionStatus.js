import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { v, fonts } from '../theme'

const statusColors = {
    connected: '#3fb950',
    reconnecting: '#d29922',
    disconnected: '#f85149',
}

const ConnectionStatus = ({ connectionType, connectionState, reconnectAttempt, reconnectMaxAttempts, reconnectDelay, compact }) => {
    const { t } = useTranslation()

    const getConnectionInfo = () => {
        if (connectionType === 'receiver') {
            return t('connectionStatus.usbReceiver')
        }
        if (connectionType === 'tracker') {
            return t('connectionStatus.tracker')
        }
        return t('connectionStatus.connected')
    }

    const dotColor = statusColors[connectionState] || '#3fb950'

    let statusText = getConnectionInfo()
    if (connectionState === 'reconnecting') {
        statusText = t('connectionStatus.reconnectingCountdown', {
            attempt: reconnectAttempt,
            maxAttempts: reconnectMaxAttempts,
            seconds: Math.ceil((reconnectDelay || 3000) / 1000),
        })
    } else if (connectionState === 'disconnected') {
        statusText = t('connectionStatus.disconnected')
    }

    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: compact ? 1 : 1.5,
                py: 0.3,
                borderRadius: '4px',
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                mr: 1,
            }}
        >
            <Box
                sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: dotColor,
                    flexShrink: 0,
                    boxShadow: `0 0 4px ${dotColor}`,
                }}
            />
            <Typography
                variant='caption'
                sx={{
                    color: v('text', '#d4d4d4'),
                    fontWeight: 400,
                    fontSize: '0.72rem',
                    fontFamily: compact ? fonts.mono : fonts.ui,
                    whiteSpace: 'nowrap',
                    lineHeight: 1,
                }}
            >
                {statusText}
            </Typography>
        </Box>
    )
}

ConnectionStatus.propTypes = {
    connectionType: PropTypes.oneOf(['receiver', 'tracker', null]),
    connectionState: PropTypes.oneOf(['connected', 'reconnecting', 'disconnected']),
    reconnectAttempt: PropTypes.number,
    reconnectMaxAttempts: PropTypes.number,
    reconnectDelay: PropTypes.number,
    compact: PropTypes.bool,
}

export default ConnectionStatus
