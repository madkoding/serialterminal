import React from 'react'
import { useTranslation } from 'react-i18next'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AddBoxIcon from '@mui/icons-material/AddBox'
import SettingsIcon from '@mui/icons-material/Settings'
import LanguageSelector from './LanguageSelector'

const Header = () => {
    const { t } = useTranslation()
    
    return (
        <AppBar
            position='static'
            sx={{
                background: 'linear-gradient(90deg, #1a237e 0%, #6a1b9a 100%)',
            }}
        >
            <Toolbar>
                <img
                    src='logo768.png'
                    alt='Logo'
                    height='30px'
                />

                <Typography
                    variant='h6'
                    component='h1'
                    noWrap
                    sx={{ 
                        flexGrow: 1,
                        fontFamily: 'Bungee',
                    }}
                >
                    &nbsp;&nbsp;{t('header.title')}
                </Typography>

                <LanguageSelector />

                <Button
                    sx={{ color: '#fff' }}
                    onClick={() => window.dispatchEvent(new CustomEvent('openSettings'))}
                >
                    <SettingsIcon />
                </Button>

                <Button
                    sx={{ color: '#fff' }}
                    target='_blank'
                    href='#'
                >
                    <AddBoxIcon/>
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default Header