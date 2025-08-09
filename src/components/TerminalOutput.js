import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import HistoryIcon from '@mui/icons-material/History'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import SettingsIcon from '@mui/icons-material/Settings'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import TerminalIcon from '@mui/icons-material/Terminal'

import './TerminalOutput.css'

/**
 * Convierte un arreglo de SGR (códigos ANSI) a un estilo CSS acumulado.
 * @param {object} prevStyle
 * @param {number[]} codes
 * @returns {object}
 */
function applySgr(prevStyle, codes) {
  const style = { ...prevStyle }
  for (const code of codes) {
    if (code === 0) {
      for (const k of Object.keys(style)) delete style[k]
      continue
    }
    if (code === 1) style.fontWeight = 'bold'
    if (code === 2) style.opacity = 0.8
    if (code === 3) style.fontStyle = 'italic'
    if (code === 4) style.textDecoration = 'underline'
    if (code === 22) delete style.fontWeight
    if (code === 23) delete style.fontStyle
    if (code === 24) delete style.textDecoration

    const fgBase = {
      30: '#000000',
      31: '#d32f2f',
      32: '#388e3c',
      33: '#f9a825',
      34: '#1976d2',
      35: '#7b1fa2',
      36: '#00838f',
      37: '#e0e0e0'
    }
    const fgBright = {
      90: '#9e9e9e',
      91: '#ef5350',
      92: '#66bb6a',
      93: '#ffeb3b',
      94: '#42a5f5',
      95: '#ab47bc',
      96: '#26c6da',
      97: '#ffffff'
    }
    const bgBase = {
      40: '#000000',
      41: '#b71c1c',
      42: '#1b5e20',
      43: '#f57f17',
      44: '#0d47a1',
      45: '#4a148c',
      46: '#006064',
      47: '#bdbdbd'
    }
    const bgBright = {
      100: '#616161',
      101: '#e57373',
      102: '#81c784',
      103: '#fff176',
      104: '#64b5f6',
      105: '#ba68c8',
      106: '#4dd0e1',
      107: '#fafafa'
    }

    if (fgBase[code]) style.color = fgBase[code]
    if (fgBright[code]) style.color = fgBright[code]
    if (bgBase[code]) style.backgroundColor = bgBase[code]
    if (bgBright[code]) style.backgroundColor = bgBright[code]
  }
  return style
}

/**
 * Parsea texto con secuencias ANSI SGR (\x1b[...m) y devuelve nodos React con estilos inline.
 * @param {string} text
 * @returns {Array<React.ReactNode>}
 */
function renderAnsi(text) {
  const regex = /\x1b\[((?:\d{1,3})(?:;(?:\d{1,3}))*)m/g
  /** @type {Array<React.ReactNode>} */
  const nodes = []
  let lastIndex = 0
  let currentStyle = {}
  let key = 0

  for (const match of text.matchAll(regex)) {
    const idx = match.index ?? 0
    if (idx > lastIndex) {
      const chunk = text.slice(lastIndex, idx)
      if (chunk) {
        nodes.push(<span style={currentStyle} key={`c-${key++}`}>{chunk}</span>)
      }
    }
    const raw = match[1]
    const codes = raw.split(';').map(n => parseInt(n, 10)).filter(n => !Number.isNaN(n))
    currentStyle = applySgr(currentStyle, codes)
    lastIndex = idx + match[0].length
  }

  if (lastIndex < text.length) {
    nodes.push(<span style={currentStyle} key={`c-${key++}`}>{text.slice(lastIndex)}</span>)
  }
  return nodes
}

/**
 * Renderiza una línea del historial con soporte ANSI.
 * @param {{ value: string, type: string, time?: Date }} line
 * @param {boolean} showTime
 * @returns {React.ReactElement}
 */
function Line({ line, showTime }) {
  return (
    <p>
      <span className='time'>{showTime && line.time ? `${line.time.toTimeString().substring(0, 8)} ` : ''}</span>
      <span className={line.type}>{renderAnsi(String(line.value || ''))}</span>
    </p>
  )
}

Line.propTypes = {
  line: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    time: PropTypes.instanceOf(Date)
  }).isRequired,
  showTime: PropTypes.bool.isRequired
}

/**
 * TerminalOutput: muestra historial de terminal con colores ANSI y utilidades.
 * @component
 * @param {object} props
 * @param {Array<{type:string,value:string|number,time?:Date}>} props.history
 * @param {(xs:Array)=>void} props.setHistory
 * @param {(s:string)=>void} props.setInput
 * @param {() => void} props.openSettings
 * @param {boolean} props.echo
 * @param {boolean} props.time
 * @param {() => void} props.clearToast
 * @returns {React.ReactElement}
 */
const TerminalOutput = (props) => {
  const { t } = useTranslation()
  const [historyOpen, setHistoryOpen] = React.useState(false)

  const handleClear = () => {
    props.clearToast && props.clearToast()
    props.setHistory && props.setHistory([])
  }

  return (
    <pre className='terminalOutput'>
      <ButtonGroup variant='text' className='terminalButtons'>
        <Button onClick={handleClear}>
          <HighlightOffIcon color='inherit' />
        </Button>
        <Button onClick={() => setHistoryOpen(true)}>
          <HistoryIcon color='inherit' />
        </Button>
        <Button onClick={props.openSettings}>
          <SettingsIcon color='inherit' />
        </Button>
      </ButtonGroup>

      <Box className='codeContainer'>
        <code>
          {props.history
            .filter(line => {
              if (props.echo) {
                return line.type === 'output';
              }
              return line.type === 'output' || line.type === 'userInput';
            })
            .map((line, i) => (
              <Line
                key={`${line.time?.getTime() || Date.now()}-${i}-${line.type}`}
                line={line}
                showTime={!!props.time}
              />
            ))}
        </code>
      </Box>

      <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)}>
        <DialogTitle>{t('terminal.history')}</DialogTitle>
        <List sx={{ minWidth: '10em' }}>
          {props.history
            .filter(line => line.type === 'userInput')
            .map((line, i) => (
              <ListItem
                key={`userInput-${line.time?.getTime() || Date.now()}-${i}-${String(line.value).substring(0, 20)}`}
                onClick={() => {
                  props.setInput && props.setInput(String(line.value))
                  setHistoryOpen(false)
                }}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemIcon>
                  <TerminalIcon />
                </ListItemIcon>
                <ListItemText primary={String(line.value)} />
              </ListItem>
            ))}
        </List>
      </Dialog>
    </pre>
  )
}

TerminalOutput.propTypes = {
  history: PropTypes.array,
  setHistory: PropTypes.func,
  setInput: PropTypes.func,
  openSettings: PropTypes.func,
  echo: PropTypes.bool,
  time: PropTypes.bool,
  clearToast: PropTypes.func
}

export default TerminalOutput
