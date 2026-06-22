import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

import { v, fonts } from '../theme'

const useFocus = () => {
    const htmlElRef = React.useRef(null)
    const setFocus = () => { htmlElRef.current?.focus() }
    return [htmlElRef, setFocus]
}

const TerminalInput = (props) => {
    const { t } = useTranslation()
    const [inputFocus, setInputFocus] = useFocus()

    React.useEffect(() => {
        setInputFocus()
    }, [props.input, setInputFocus])

    return (
        <Box sx={{ mt: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {props.baudRate && (
                    <Chip
                        label={`${props.baudRate}`}
                        size='small'
                        sx={{
                            color: v('text-muted', '#8b949e'),
                            backgroundColor: v('bg-2', '#21262d'),
                            fontFamily: fonts.mono,
                            fontSize: '0.7rem',
                            height: 24,
                            border: `1px solid ${v('border', '#30363d')}`,
                            borderRadius: '4px',
                            flexShrink: 0,
                        }}
                    />
                )}

                <TextField
                    label={t('terminal.input')}
                    variant='outlined'
                    size='small'
                    onChange={(e) => props.setInput(e.target.value)}
                    value={props.input}
                    fullWidth
                    onKeyDown={(e) => e.key === 'Enter' && !props.disabled && props.send()}
                    disabled={props.disabled}
                    autoComplete='off'
                    autoFocus
                    inputRef={inputFocus}
                    sx={{
                        flex: 1,
                        '& .MuiInputBase-root': {
                            backgroundColor: v('bg-2', '#21262d'),
                            color: v('text', '#d4d4d4'),
                            fontFamily: fonts.mono,
                            fontSize: '0.9rem',
                            '& fieldset': { borderColor: v('border', '#30363d') },
                            '&:hover fieldset': { borderColor: v('text-muted', '#8b949e') },
                            '&.Mui-focused fieldset': { borderColor: v('accent', '#0db4d6') },
                            caretColor: v('accent', '#0db4d6'),
                        },
                        '& .MuiInputBase-input': {
                            color: v('text', '#d4d4d4'),
                            fontFamily: fonts.mono,
                            fontSize: '0.9rem',
                            textShadow: props.crtTheme ? `0 0 2px ${v('accent', '#0db4d6')}, 0 0 6px ${v('accent-dim', 'rgba(13,180,214,0.15)')}` : 'none',
                        },
                        '& .MuiInputLabel-root': {
                            color: v('text-muted', '#8b949e'),
                            fontSize: '0.85rem',
                            fontFamily: fonts.ui,
                            '&.Mui-focused': {
                                color: v('accent', '#0db4d6'),
                            },
                        },
                    }}
                />

                {props.disabled ? (
                    <Button
                        variant='outlined'
                        disableElevation
                        onClick={() => props.connect()}
                        startIcon={
                            <Box component='span' sx={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: v('error', '#f85149'), display: 'inline-block' }} />
                        }
                        sx={{
                            height: 40,
                            borderColor: v('error', '#f85149'),
                            color: v('error', '#f85149'),
                            fontFamily: fonts.ui,
                            fontWeight: 500,
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            minWidth: 110,
                            '&:hover': {
                                backgroundColor: 'rgba(248,81,73,0.1)',
                                borderColor: v('error', '#f85149'),
                            },
                        }}
                    >
                        {t('terminal.reconnect')}
                    </Button>
                ) : (
                    <Button
                        variant='outlined'
                        disableElevation
                        onClick={() => props.send()}
                        sx={{
                            height: 40,
                            borderColor: v('border', '#30363d'),
                            color: v('text', '#d4d4d4'),
                            fontFamily: fonts.ui,
                            fontWeight: 500,
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            minWidth: 80,
                            '&:hover': {
                                backgroundColor: v('accent-dim', 'rgba(13,180,214,0.15)'),
                                borderColor: v('accent', '#0db4d6'),
                                color: v('text', '#d4d4d4'),
                            },
                        }}
                    >
                        {t('terminal.send')}
                    </Button>
                )}
            </Box>
        </Box>
    )
}

TerminalInput.propTypes = {
    input: PropTypes.string,
    setInput: PropTypes.func,
    send: PropTypes.func,
    disabled: PropTypes.bool,
    connect: PropTypes.func,
    baudRate: PropTypes.number,
    ctrl: PropTypes.bool,
    crtTheme: PropTypes.bool,
}

export default TerminalInput
