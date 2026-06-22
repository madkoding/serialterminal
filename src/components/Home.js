import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Divider from '@mui/material/Divider'

import ChromeIcon from '../icons/Chrome'
import EdgeIcon from '../icons/Edge'
import OperaIcon from '../icons/Opera'
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices'
import { v, fonts } from '../theme'

const Home = (props) => {
    const { t } = useTranslation()

    if (!props.supported()) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, p: 3 }}>
                <Alert severity='warning' sx={{ maxWidth: 520, width: '100%' }}>
                    <AlertTitle>{t('home.browserNotSupported.title')}</AlertTitle>
                    {t('home.browserNotSupported.tryUsing')}&nbsp;
                    <a href='https://www.google.com/chrome/' target='blank'>
                        <ChromeIcon fontSize='inherit' /> <b>{t('home.browserNotSupported.chrome')}</b>
                    </a>
                    ,&nbsp;
                    <a href='https://www.microsoft.com/en-us/edge' target='blank'>
                        <EdgeIcon fontSize='inherit' /> <b>{t('home.browserNotSupported.edge')}</b>
                    </a>
                    , or&nbsp;
                    <a href='https://www.opera.com/' target='blank'>
                        <OperaIcon fontSize='inherit' /> <b>{t('home.browserNotSupported.opera')}</b>
                    </a>
                    <br />
                    {t('home.browserNotSupported.mobileNotSupported')}
                    <br />
                    <br />
                    {t('home.browserNotSupported.learnMore')}&nbsp;
                    <a href='https://developer.mozilla.org/en-US/docs/Web/API/Serial#browser_compatibility' target='blank'>
                        {t('home.browserNotSupported.browserCompatibility')}
                    </a>
                </Alert>
            </Box>
        )
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                p: 3,
            }}
        >
            <Box
                sx={{
                    maxWidth: 460,
                    width: '100%',
                    backgroundColor: v('bg-1', '#161b22'),
                    border: `1px solid ${v('border', '#30363d')}`,
                    borderRadius: '6px',
                    p: 4,
                    textAlign: 'center',
                }}
            >
                <Box sx={{ mb: 2 }}>
                    <img
                        src='logo768.png'
                        alt='Serial Terminal'
                        height={88}
                        style={{ opacity: 0.95 }}
                    />
                </Box>

                <Typography
                    variant='h5'
                    sx={{
                        color: v('text', '#d4d4d4'),
                        fontWeight: 700,
                        fontSize: '1.4rem',
                        fontFamily: fonts.ui,
                        mb: 0.5,
                    }}
                >
                    {t('header.title')}
                </Typography>

                <Typography
                    variant='body2'
                    sx={{
                        color: v('text-muted', '#8b949e'),
                        fontSize: '0.85rem',
                        fontFamily: fonts.ui,
                        mb: 3,
                    }}
                >
                    Web Serial interface
                </Typography>

                <Button
                    variant='outlined'
                    fullWidth
                    disableElevation
                    onClick={props.connect}
                    startIcon={<ElectricalServicesIcon />}
                    sx={{
                        borderColor: v('accent', '#0db4d6'),
                        color: v('text', '#d4d4d4'),
                        fontFamily: fonts.ui,
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        py: 1.2,
                        mb: 3,
                        '&:hover': {
                            backgroundColor: v('accent-dim', 'rgba(13,180,214,0.15)'),
                            borderColor: v('accent', '#0db4d6'),
                        },
                    }}
                >
                    {t('home.connect')}
                </Button>

                <Divider sx={{ borderColor: v('border', '#30363d'), mb: 2.5 }} />

                <Box
                    sx={{
                        textAlign: 'left',
                        fontFamily: fonts.mono,
                        fontSize: '0.78rem',
                        color: v('text-muted', '#8b949e'),
                        lineHeight: 1.8,
                    }}
                >
                    <div>1.&nbsp;&nbsp;{t('home.instructions.step1').replace('1. ', '')}</div>
                    <div>2.&nbsp;&nbsp;{t('home.instructions.step2').replace('2. ', '')}</div>
                    <div>3.&nbsp;&nbsp;{t('home.instructions.step3').replace('3. ', '').replace(' 😊', '')}</div>
                </Box>
            </Box>
        </Box>
    )
}

Home.propTypes = {
    connect: PropTypes.func,
    supported: PropTypes.func,
    openSettings: PropTypes.func,
}

export default Home
