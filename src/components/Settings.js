import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'

import { v, fonts, themeSchemes } from '../theme'

const baudrates = [
    300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 74880,
    115200, 230400, 250000, 500000, 921600, 1000000, 2000000,
]

const lineEndings = ['None', '\\n', '\\r', '\\r\\n']
const maxLinesOptions = [1000, 5000, 10000, 50000, 100000]
const reconnectIntervals = [1000, 2000, 3000, 5000, 10000]

const sectionSx = { mb: 2.5 }
const sectionHeaderSx = {
    fontFamily: fonts.ui,
    fontSize: '0.68rem',
    fontWeight: 600,
    color: v('text-muted', '#8b949e'),
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    mb: 1.5,
    pb: 0.5,
    borderBottom: `1px solid ${v('border', '#30363d')}`,
}
const formControlSx = { mt: 0.5, minWidth: '10em' }
const selectSx = {
    color: v('text', '#d4d4d4'),
    fontFamily: fonts.ui,
    fontSize: '0.82rem',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: v('border', '#30363d') },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: v('text-muted', '#8b949e') },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: v('accent', '#0db4d6') },
    '& .MuiSvgIcon-root': { color: v('text-muted', '#8b949e') },
}
const checkboxSx = {
    color: v('text-muted', '#8b949e'),
    '&.Mui-checked': { color: v('accent', '#0db4d6') },
}

const Settings = (props) => {
    const { t } = useTranslation()
    const [baudRate, setBaudRate] = React.useState(props.settings.baudRate)
    const [lineEnding, setLineEnding] = React.useState(props.settings.lineEnding)
    const [echoFlag, setEchoFlag] = React.useState(props.settings.echoFlag)
    const [timeFlag, setTimeFlag] = React.useState(props.settings.timeFlag)
    const [ctrlFlag, setCtrlFlag] = React.useState(props.settings.ctrlFlag)
    const [maxLines, setMaxLines] = React.useState(props.settings.maxLines || 50000)
    const [persistLog, setPersistLog] = React.useState(props.settings.persistLog !== false)
    const [autoReconnect, setAutoReconnect] = React.useState(props.settings.autoReconnect !== false)
    const [reconnectInterval, setReconnectInterval] = React.useState(props.settings.reconnectInterval || 3000)
    const [backoffEnabled, setBackoffEnabled] = React.useState(props.settings.backoffEnabled !== false)
    const [crtTheme, setCrtTheme] = React.useState(props.settings.crtTheme !== false)
    const [colorScheme, setColorScheme] = React.useState(props.settings.colorScheme || 'dev-tools')

    const cancel = () => {
        setBaudRate(props.settings.baudRate)
        setLineEnding(props.settings.lineEnding)
        setEchoFlag(props.settings.echoFlag)
        setTimeFlag(props.settings.timeFlag)
        setCtrlFlag(props.settings.ctrlFlag)
        setMaxLines(props.settings.maxLines || 50000)
        setPersistLog(props.settings.persistLog !== false)
        setAutoReconnect(props.settings.autoReconnect !== false)
        setReconnectInterval(props.settings.reconnectInterval || 3000)
        setBackoffEnabled(props.settings.backoffEnabled !== false)
        setCrtTheme(props.settings.crtTheme !== false)
        setColorScheme(props.settings.colorScheme || 'dev-tools')
        props.close()
    }

    const reset = () => {
        if (!props.openPort) setBaudRate(115200)
        setLineEnding('\\r\\n')
        setEchoFlag(true)
        setTimeFlag(false)
        setCtrlFlag(true)
        setMaxLines(50000)
        setPersistLog(true)
        setAutoReconnect(true)
        setReconnectInterval(3000)
        setBackoffEnabled(true)
        setCrtTheme(false)
        setColorScheme('dev-tools')
    }

    const save = () => {
        props.save({
            baudRate, lineEnding, echoFlag, timeFlag, ctrlFlag,
            maxLines, persistLog, autoReconnect, reconnectInterval,
            backoffEnabled, crtTheme, colorScheme,
        })
        props.close()
        props.saveToast()
    }

    return (
        <Dialog
            open={props.open}
            onClose={props.close}
            maxWidth='sm'
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: v('bg-1', '#161b22'),
                    border: `1px solid ${v('border', '#30363d')}`,
                    color: v('text', '#d4d4d4'),
                }
            }}
        >
            <DialogTitle sx={{ fontFamily: fonts.ui, fontSize: '1rem', fontWeight: 600, pb: 1 }}>
                {t('settings.title')}
            </DialogTitle>

            <DialogContent>
                <Box sx={sectionSx}>
                    <Typography sx={sectionHeaderSx}>{t('settings.serialConnection')}</Typography>

                    <FormControl variant='filled' fullWidth sx={formControlSx}>
                        <InputLabel sx={{ color: v('text-muted', '#8b949e'), '&.Mui-focused': { color: v('accent', '#0db4d6') } }}>
                            {props.openPort ? t('settings.baudRateReconnect') : t('settings.baudRate')}
                        </InputLabel>
                        <Select
                            value={baudRate}
                            onChange={(e) => setBaudRate(e.target.value)}
                            disabled={props.openPort}
                            sx={selectSx}
                        >
                            {baudrates.map(baud =>
                                <MenuItem value={baud} key={baud} sx={{ fontFamily: fonts.mono }}>{baud} baud</MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <FormControl variant='filled' fullWidth sx={formControlSx}>
                        <InputLabel sx={{ color: v('text-muted', '#8b949e'), '&.Mui-focused': { color: v('accent', '#0db4d6') } }}>
                            {t('settings.lineEnding')}
                        </InputLabel>
                        <Select
                            value={lineEnding}
                            onChange={(e) => setLineEnding(e.target.value)}
                            sx={selectSx}
                        >
                            {lineEndings.map(name =>
                                <MenuItem value={name} key={name} sx={{ fontFamily: fonts.mono }}>{name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={sectionSx}>
                    <Typography sx={sectionHeaderSx}>{t('settings.colorScheme')}</Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {themeSchemes.map(theme => {
                            const selected = colorScheme === theme.id
                            return (
                                <Tooltip key={theme.id} title={theme.label}>
                                    <Box
                                        onClick={() => setColorScheme(theme.id)}
                                        sx={{
                                            width: 72,
                                            height: 36,
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            backgroundColor: theme.bg0,
                                            border: selected
                                                ? `2px solid ${v('accent', '#0db4d6')}`
                                                : `2px solid ${v('border', '#30363d')}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 0.5,
                                            transition: 'border-color 0.15s',
                                            '&:hover': {
                                                borderColor: selected ? v('accent', '#0db4d6') : v('text-muted', '#8b949e'),
                                            },
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: theme.accent, flexShrink: 0 }} />
                                        <Box sx={{ width: 20, height: 2, borderRadius: '1px', backgroundColor: theme.text, opacity: 0.6 }} />
                                        <Box sx={{ width: 10, height: 2, borderRadius: '1px', backgroundColor: theme.text, opacity: 0.3 }} />
                                    </Box>
                                </Tooltip>
                            )
                        })}
                    </Box>

                    <Typography sx={{ fontFamily: fonts.ui, fontSize: '0.75rem', color: v('text-muted', '#8b949e'), mb: 1.5 }}>
                        {t('settings.colorSchemeDescription')}
                    </Typography>

                    <Typography sx={sectionHeaderSx}>{t('settings.display')}</Typography>

                    <FormGroup>
                        <FormControlLabel control={
                            <Checkbox checked={echoFlag} onChange={(e) => setEchoFlag(e.target.checked)} sx={checkboxSx} />
                        } label={<Typography sx={{ fontFamily: fonts.ui, fontSize: '0.82rem', color: v('text', '#d4d4d4') }}>{t('settings.showInput')}</Typography>} />
                    </FormGroup>

                    <FormGroup>
                        <FormControlLabel control={
                            <Checkbox checked={timeFlag} onChange={(e) => setTimeFlag(e.target.checked)} sx={checkboxSx} />
                        } label={<Typography sx={{ fontFamily: fonts.ui, fontSize: '0.82rem', color: v('text', '#d4d4d4') }}>{t('settings.showTimestamps')}</Typography>} />
                    </FormGroup>

                    <FormGroup>
                        <FormControlLabel control={
                            <Checkbox checked={ctrlFlag} onChange={(e) => setCtrlFlag(e.target.checked)} sx={checkboxSx} />
                        } label={<Typography sx={{ fontFamily: fonts.ui, fontSize: '0.82rem', color: v('text', '#d4d4d4') }}>{t('settings.detectCtrl')}</Typography>} />
                    </FormGroup>

                    <FormGroup>
                        <FormControlLabel control={
                            <Checkbox checked={crtTheme} onChange={(e) => setCrtTheme(e.target.checked)} sx={checkboxSx} />
                        } label={<Typography sx={{ fontFamily: fonts.ui, fontSize: '0.82rem', color: v('text', '#d4d4d4') }}>{t('settings.crtTheme')}</Typography>} />
                    </FormGroup>

                    <FormControl variant='filled' fullWidth sx={formControlSx}>
                        <InputLabel sx={{ color: v('text-muted', '#8b949e'), '&.Mui-focused': { color: v('accent', '#0db4d6') } }}>
                            {t('settings.maxLines')}
                        </InputLabel>
                        <Select
                            value={maxLines}
                            onChange={(e) => setMaxLines(e.target.value)}
                            sx={selectSx}
                        >
                            {maxLinesOptions.map(n =>
                                <MenuItem value={n} key={n} sx={{ fontFamily: fonts.mono }}>{n.toLocaleString()}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={sectionSx}>
                    <Typography sx={sectionHeaderSx}>{t('settings.reconnection')}</Typography>

                    <FormGroup>
                        <FormControlLabel control={
                            <Checkbox checked={autoReconnect} onChange={(e) => setAutoReconnect(e.target.checked)} sx={checkboxSx} />
                        } label={<Typography sx={{ fontFamily: fonts.ui, fontSize: '0.82rem', color: v('text', '#d4d4d4') }}>{t('settings.autoReconnect')}</Typography>} />
                    </FormGroup>

                    <FormGroup>
                        <FormControlLabel control={
                            <Checkbox checked={backoffEnabled} onChange={(e) => setBackoffEnabled(e.target.checked)} sx={checkboxSx} />
                        } label={<Typography sx={{ fontFamily: fonts.ui, fontSize: '0.82rem', color: v('text', '#d4d4d4') }}>{t('settings.backoffEnabled')}</Typography>} />
                    </FormGroup>

                    <FormControl variant='filled' fullWidth sx={formControlSx}>
                        <InputLabel sx={{ color: v('text-muted', '#8b949e'), '&.Mui-focused': { color: v('accent', '#0db4d6') } }}>
                            {t('settings.reconnectInterval')}
                        </InputLabel>
                        <Select
                            value={reconnectInterval}
                            onChange={(e) => setReconnectInterval(e.target.value)}
                            sx={selectSx}
                        >
                            {reconnectIntervals.map(n =>
                                <MenuItem value={n} key={n} sx={{ fontFamily: fonts.mono }}>{n / 1000}s</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={sectionSx}>
                    <Typography sx={sectionHeaderSx}>{t('settings.storage')}</Typography>

                    <FormGroup>
                        <FormControlLabel control={
                            <Checkbox checked={persistLog} onChange={(e) => setPersistLog(e.target.checked)} sx={checkboxSx} />
                        } label={<Typography sx={{ fontFamily: fonts.ui, fontSize: '0.82rem', color: v('text', '#d4d4d4') }}>{t('settings.persistLog')}</Typography>} />
                    </FormGroup>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, borderTop: `1px solid ${v('border', '#30363d')}`, pt: 2 }}>
                <Button onClick={reset} sx={{ color: v('error', '#f85149'), fontFamily: fonts.ui, fontSize: '0.8rem' }}>
                    {t('settings.buttons.reset')}
                </Button>
                <Button onClick={cancel} sx={{ color: v('text-muted', '#8b949e'), fontFamily: fonts.ui, fontSize: '0.8rem' }}>
                    {t('settings.buttons.cancel')}
                </Button>
                <Button
                    onClick={save}
                    variant='contained'
                    disableElevation
                    sx={{
                        backgroundColor: v('accent', '#0db4d6'),
                        color: '#000',
                        fontFamily: fonts.ui,
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        '&:hover': { backgroundColor: '#0bc5e8' },
                    }}
                >
                    {t('settings.buttons.save')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

Settings.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    settings: PropTypes.object,
    save: PropTypes.func,
    openPort: PropTypes.bool,
    saveToast: PropTypes.func,
}

export default Settings
