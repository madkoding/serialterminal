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
import { v, fonts } from '../theme'

const ErrorMessage = (props) => {
    const { t } = useTranslation()

    return (
        <Dialog
            open={props.open}
            onClose={props.close}
            PaperProps={{
                sx: {
                    backgroundColor: v('bg-1', '#161b22'),
                    border: `1px solid ${v('border', '#30363d')}`,
                    color: v('text', '#d4d4d4'),
                }
            }}
        >
            <DialogTitle sx={{ fontFamily: fonts.ui, fontSize: '1rem' }}>{t('error.connectionFailed')}</DialogTitle>

            <DialogContent>
                <DialogContentText sx={{ color: v('text-muted', '#8b949e'), fontFamily: fonts.ui, fontSize: '0.85rem' }}>
                    {props.message}
                </DialogContentText>

                <Typography sx={{ mt: 2, color: v('text-muted', '#8b949e'), fontFamily: fonts.ui, fontSize: '0.82rem' }}>
                    {t('error.somethingWentWrong')}<br />
                    {t('error.recommendChrome')}&nbsp;
                    <a href='https://www.google.com/chrome/' target='blank'>
                        <ChromeIcon fontSize='inherit' /> <b>{t('home.browserNotSupported.chrome')}</b>
                    </a> {t('error.forDesktop')}
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={props.close}
                    sx={{ color: v('accent', '#0db4d6'), fontFamily: fonts.ui, fontSize: '0.82rem' }}
                >
                    {t('error.close')}
                </Button>
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
