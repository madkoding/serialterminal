import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import ChromeIcon from '../icons/Chrome'

const ErrorMessage = (props) => {
    const { t } = useTranslation()

    return (
        <Dialog open={props.open} onClose={props.close}>
            <DialogTitle>{t('error.connectionFailed')}</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    {props.message}
                </DialogContentText>

                <Typography sx={{ mt: 2 }}>
                    {t('error.somethingWentWrong')}<br />
                    {t('error.recommendChrome')}&nbsp;
                    <a href='https://www.google.com/chrome/' target='blank'>
                        <ChromeIcon fontSize='inherit' /> <b>{t('home.browserNotSupported.chrome')}</b>
                    </a> {t('error.forDesktop')}
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={props.close} color='primary'>{t('error.close')}</Button>
            </DialogActions>
        </Dialog>
    )
}

ErrorMessage.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    message: PropTypes.string,
}

export default ErrorMessage