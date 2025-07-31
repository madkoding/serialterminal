import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Thanks https://stackoverflow.com/questions/28889826/how-to-set-focus-on-an-input-field-after-rendering
const useFocus = () => {
    const htmlElRef = React.useRef(null)
    const setFocus = () => { htmlElRef.current?.focus() }

    return [htmlElRef, setFocus]
}

const TerminalInput = (props) => {
    const { t } = useTranslation()
    //const [disableSend, setDisableSend] = React.useState(false)
    const [inputFocus, setInputFocus] = useFocus()

    React.useEffect(() => {
        setInputFocus()
        //console.log('focused')
    }, [props.input, setInputFocus])

    return (
        <Grid container spacing={0}>
            <Grid item sx={{
                width: 'calc(100% - 8rem)',
                paddingRight: '.5em',
            }}>
                <TextField
                    label={t('terminal.input')}
                    variant='outlined'
                    onChange={(e) => props.setInput(e.target.value)}
                    value={props.input}
                    fullWidth
                    onKeyDown={(e) => e.key === 'Enter' && props.send()}
                    //disabled={disableSend}
                    autoComplete='off'
                    autoFocus
                    inputRef={inputFocus}
                    sx={{
                        '& .MuiInputBase-root': {
                            backgroundColor: '#111',
                            color: '#fff',
                            fontFamily: 'Workbench, monospace',
                            fontSize: '1.5rem',
                            fontVariationSettings: '"BLED" 0, "SCAN" -40',
                            textShadow: '0 0 1px #00ffff, 0 0 3px #00ffff33, 0 0 8px #00ffff22, 0 0 15px #00ffff11',
                        },
                        '& .MuiInputBase-input': {
                            color: '#fff',
                            fontFamily: 'Workbench, monospace',
                            fontSize: '1.5rem',
                            fontVariationSettings: '"BLED" 0, "SCAN" -40',
                            textShadow: '0 0 1px #00ffff, 0 0 3px #00ffff33, 0 0 8px #00ffff22, 0 0 15px #00ffff11',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#444',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#888',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#fff',
                        },
                        '& .MuiInputLabel-root': {
                            color: '#fff',
                            fontSize: '1.3rem',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#fff',
                        },
                    }}
                />
            </Grid>
            <Grid item sx={{
                width: '8rem',
            }}>
                <Button sx={{
                    height: 56,
                    color: '#fff',
                    '&.Mui-disabled': {
                        color: '#aaa'
                    },
                    '&.MuiButtonGroup-groupedTextHorizontal:not(:last-child)': {
                        borderColor: '#777'
                    }
                }}
                    variant='contained'
                    disableElevation
                    onClick={() => props.send()}
                    //disabled={disableSend}
                    fullWidth
                >{t('terminal.send')}</Button>
            </Grid>
        </Grid>
    )
}

TerminalInput.propTypes = {
    input: PropTypes.string,
    setInput: PropTypes.func,
    send: PropTypes.func,
}

export default TerminalInput