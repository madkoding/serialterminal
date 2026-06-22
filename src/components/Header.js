import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import SettingsIcon from '@mui/icons-material/Settings'
import ConnectionStatus from './ConnectionStatus'
import { v, fonts } from '../theme'

const Header = ({ connectionType, connectionState, reconnectAttempt, reconnectMaxAttempts, reconnectDelay }) => {
    const { t } = useTranslation()

    return (
        <AppBar
            position='static'
            sx={{
                backgroundColor: v('bg-1', '#161b22'),
                borderBottom: `1px solid ${v('border', '#30363d')}`,
                boxShadow: 'none',
            }}
        >
            <Toolbar sx={{ minHeight: '48px !important', px: 2 }}>
                <Typography
                    variant='h6'
                    component='div'
                    noWrap
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        color: v('text', '#d4d4d4'),
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        fontFamily: fonts.ui,
                    }}
                >
                    <img
                        src='logo768.png'
                        alt='Logo'
                        height={24}
                        style={{ opacity: 0.9 }}
                    />
                    {t('header.title')}
                </Typography>

                {connectionState && connectionState !== 'disconnected' && (
                    <ConnectionStatus
                        connectionType={connectionType}
                        connectionState={connectionState}
                        reconnectAttempt={reconnectAttempt}
                        reconnectMaxAttempts={reconnectMaxAttempts}
                        reconnectDelay={reconnectDelay}
                        compact
                    />
                )}

                <IconButton
                    size='small'
                    sx={{ color: v('text-muted', '#8b949e'), '&:hover': { color: v('text', '#d4d4d4') } }}
                    onClick={() => window.dispatchEvent(new CustomEvent('openSettings'))}
                >
                    <SettingsIcon fontSize='small' />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

Header.propTypes = {
    connectionType: PropTypes.string,
    connectionState: PropTypes.string,
    reconnectAttempt: PropTypes.number,
    reconnectMaxAttempts: PropTypes.number,
    reconnectDelay: PropTypes.number,
}

export default Header
