import React from 'react'
import PropTypes from 'prop-types'

import Box from '@mui/material/Box'

import TerminalOutput from './TerminalOutput'
import TerminalInput from './TerminalInput'
import { saveSession, loadSession, clearSession } from '../modules/logStorage'

const Terminal = (props) => {
    const [input, setInput] = React.useState('')
    const received = React.useRef('')
    const [history, setHistory] = React.useState([])
    const lineIdCounter = React.useRef(0)
    const batchRef = React.useRef([])
    const rafPending = React.useRef(false)
    const saveTimerRef = React.useRef(null)
    const restoredRef = React.useRef(false)

    // Restore persisted session on mount
    React.useEffect(() => {
        if (props.persistLog && !restoredRef.current) {
            restoredRef.current = true
            loadSession().then(savedLines => {
                if (savedLines && savedLines.length > 0) {
                    setHistory(savedLines)
                    // Restore the line counter past the max existing id
                    const maxId = savedLines.reduce((max, l) => Math.max(max, l.id != null ? l.id : 0), 0)
                    lineIdCounter.current = maxId + 1
                    if (props.restoreToast) props.restoreToast(savedLines.length)
                }
            })
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // rAF batching for incoming serial data
    const flushBatch = React.useCallback(() => {
        if (batchRef.current.length === 0) {
            rafPending.current = false
            return
        }

        const entries = batchRef.current.splice(0)
        rafPending.current = false

        setHistory(prev => {
            let newHistory = prev
            for (const entry of entries) {
                const str = `${received.current}${entry.value}`
                const lines = str.split('\n')

                let newReceived = str
                const newLines = []

                if (lines.length > 1) {
                    newReceived = lines.pop()
                    lines.forEach(line => {
                        newLines.push({
                            id: lineIdCounter.current++,
                            type: 'output',
                            value: `${line}`,
                            time: entry.time,
                        })
                    })

                    const maxLines = props.maxLines || 50000
                    newHistory = newHistory.concat(newLines)
                    if (newHistory.length > maxLines) {
                        newHistory = newHistory.slice(-maxLines)
                    }
                }
                received.current = newReceived
            }
            return newHistory
        })
    }, [props.maxLines])

    React.useEffect(() => {
        if (!props.received.value) return
        batchRef.current.push({ value: props.received.value, time: props.received.time })
        if (!rafPending.current) {
            rafPending.current = true
            requestAnimationFrame(flushBatch)
        }
    }, [props.received, flushBatch])

    // Persist history to IndexedDB (debounced)
    React.useEffect(() => {
        if (!props.persistLog || history.length === 0) return

        if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
        saveTimerRef.current = setTimeout(() => {
            const linesToSave = history.slice(-5000)
            saveSession(linesToSave)
        }, 2000)

        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
        }
    }, [history, props.persistLog])

    const handleSend = () => {
        props.send(input)

        setHistory(prev => [
            ...prev,
            {
                id: lineIdCounter.current++,
                type: 'userInput',
                value: input,
                time: new Date(),
            },
        ])
        setInput('')
    }

    const handleKeyDown = (e) => {
        if (props.ctrl) {
            let charCode = String.fromCharCode(e.which).toUpperCase()

            if ((e.ctrlKey || e.metaKey) && charCode === 'C') {
                e.preventDefault()
                props.sendRaw(3)
            } else if ((e.ctrlKey || e.metaKey) && charCode === 'D') {
                e.preventDefault()
                props.sendRaw(4)
            }
        }
    }

    const handleClearHistory = () => {
        setHistory([])
        if (props.persistLog) {
            clearSession()
        }
        props.clearToast()
    }

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, p: 0.75, gap: 0.5 }} onKeyDown={handleKeyDown}>
            <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <TerminalOutput
                    history={history}
                    setHistory={setHistory}
                    setInput={setInput}
                    openSettings={props.openSettings}
                    echo={props.echo}
                    time={props.time}
                    crtTheme={props.crtTheme}
                    clearToast={handleClearHistory}
                />
            </Box>

            <Box sx={{ flexShrink: 0 }}>
                <TerminalInput
                    input={input}
                    setInput={setInput}
                    send={handleSend}
                    disabled={!props.connected}
                    connect={props.connect}
                    baudRate={props.baudRate}
                    ctrl={props.ctrl}
                    crtTheme={props.crtTheme}
                />
            </Box>
        </Box>
    )
}

Terminal.propTypes = {
    received: PropTypes.object,
    send: PropTypes.func,
    sendRaw: PropTypes.func,
    openSettings: PropTypes.func,
    echo: PropTypes.bool,
    time: PropTypes.bool,
    ctrl: PropTypes.bool,
    clearToast: PropTypes.func,
    connected: PropTypes.bool,
    connect: PropTypes.func,
    maxLines: PropTypes.number,
    persistLog: PropTypes.bool,
    restoreToast: PropTypes.func,
    baudRate: PropTypes.number,
    crtTheme: PropTypes.bool,
}

export default Terminal
