import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Grid'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import ChromeIcon from '../icons/Chrome'
import EdgeIcon from '../icons/Edge'
import OperaIcon from '../icons/Opera'
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices'

const gridCSS = {
    height: 'calc(100vh - 160px)',
    minHeight: '10em',
}

const Home = (props) => {
    const { t } = useTranslation()
    
    return (
        <Grid
            container
            spacing={0}
            direction='column'
            alignItems='center'
            justifyContent='center'
            sx={gridCSS}
        >

            <Grid item xs={3}>

                {props.supported() ?
                    <Box align='center'>
                        <Box>
                            <Button variant='contained' color='success' size='large' onClick={props.connect} sx={{ m: 1 }} startIcon={<ElectricalServicesIcon />}>
                                {t('home.connect')}
                            </Button>
                        </Box>

                        <Alert severity='info' align='left'>
                            {t('home.instructions.step1')}<br />
                            {t('home.instructions.step2')}<br />
                            {t('home.instructions.step3')}<br />
                        </Alert>
                    </Box>

                    :

                    <Alert severity='warning'>
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
                }
            </Grid>

        </Grid>
    )
}

Home.propTypes = {
    connect: PropTypes.func,
    supported: PropTypes.func,
    openSettings: PropTypes.func,
}

export default Home