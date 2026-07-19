import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { FixedSizeList } from 'react-window'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'

import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SearchIcon from '@mui/icons-material/Search'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CloseIcon from '@mui/icons-material/Close'
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom'
import HistoryIcon from '@mui/icons-material/History'
import TerminalIcon from '@mui/icons-material/Terminal'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'

import { v, fonts } from '../theme'
import './TerminalOutput.css'

const LINE_HEIGHT = 19
const BOTTOM_PADDING = 16
const MAX_VISIBLE_LINES = 5000

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
      30: '#000000', 31: '#d32f2f', 32: '#388e3c', 33: '#f9a825',
      34: '#1976d2', 35: '#7b1fa2', 36: '#00838f', 37: '#e0e0e0'
    }
    const fgBright = {
      90: '#9e9e9e', 91: '#ef5350', 92: '#66bb6a', 93: '#ffeb3b',
      94: '#42a5f5', 95: '#ab47bc', 96: '#26c6da', 97: '#ffffff'
    }
    const bgBase = {
      40: '#000000', 41: '#b71c1c', 42: '#1b5e20', 43: '#f57f17',
      44: '#0d47a1', 45: '#4a148c', 46: '#006064', 47: '#bdbdbd'
    }
    const bgBright = {
      100: '#616161', 101: '#e57373', 102: '#81c784', 103: '#fff176',
      104: '#64b5f6', 105: '#ba68c8', 106: '#4dd0e1', 107: '#fafafa'
    }

    if (fgBase[code]) style.color = fgBase[code]
    if (fgBright[code]) style.color = fgBright[code]
    if (bgBase[code]) style.backgroundColor = bgBase[code]
    if (bgBright[code]) style.backgroundColor = bgBright[code]
  }
  return style
}

function renderAnsi(text) {
  // eslint-disable-next-line no-control-regex
  const regex = /\x1b\[((?:\d{1,3})(?:;(?:\d{1,3}))*)m/g
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

const Row = React.memo(({ index, style, data }) => {
  const line = data.lines[index]
  const showTime = data.showTime
  const isMatch = data.searchIndices && data.searchIndices.includes(index)
  const isCurrent = isMatch && data.currentMatchIndex != null && data.searchIndices[data.currentMatchIndex] === index
  const searchTerm = data.searchTerm
  const crtTheme = data.crtTheme

  let className = 'lineRow'
  if (isMatch) className += ' searchMatch'
  if (isCurrent) className += ' searchCurrent'
  if (crtTheme) className += ' crt'

  let displayValue = String(line.value || '')
  if (searchTerm && isMatch && data.highlightInLine) {
    const lowerVal = displayValue.toLowerCase()
    const lowerTerm = searchTerm.toLowerCase()
    const startIdx = lowerVal.indexOf(lowerTerm)
    if (startIdx !== -1) {
      const before = displayValue.slice(0, startIdx)
      const match = displayValue.slice(startIdx, startIdx + searchTerm.length)
      const after = displayValue.slice(startIdx + searchTerm.length)
      displayValue = (
        <>
          {renderAnsi(before)}
          <span className="highlightText">{match}</span>
          {renderAnsi(after)}
        </>
      )
    } else {
      displayValue = renderAnsi(displayValue)
    }
  } else {
    displayValue = renderAnsi(displayValue)
  }

  return (
    <div style={style} className={className}>
      <span className='time'>
        {showTime && line.time ? `${line.time.toTimeString().substring(0, 8)} ` : ''}
      </span>
      <span className={line.type}>{displayValue}</span>
    </div>
  )
})

Row.displayName = 'TerminalRow'

Row.propTypes = {
  index: PropTypes.number,
  style: PropTypes.object,
  data: PropTypes.object,
}

function useContainerSize(ref) {
  const [size, setSize] = React.useState({ width: 0, height: 0 })

  React.useEffect(() => {
    if (!ref.current) return
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setSize({ width, height })
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])

  return size
}

const TerminalOutput = (props) => {
  const { t } = useTranslation()
  const containerRef = React.useRef(null)
  const listRef = React.useRef(null)
  const outerRef = React.useRef(null)
  const size = useContainerSize(containerRef)

  const [isSticky, setIsSticky] = React.useState(true)
  const [paused, setPaused] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [historyOpen, setHistoryOpen] = React.useState(false)
  const [currentMatchIdx, setCurrentMatchIdx] = React.useState(0)
  const [copied, setCopied] = React.useState(false)

  const liveHistory = props.history

  // When paused, freeze the visible slice so new incoming events are not rendered.
  const frozenSnapshot = React.useRef(null)
  const visibleHistory = React.useMemo(() => {
    if (paused) {
      if (!frozenSnapshot.current) {
        frozenSnapshot.current = liveHistory
      }
      return frozenSnapshot.current || []
    }
    frozenSnapshot.current = null
    return liveHistory
  }, [paused, liveHistory])

  const displayLines = React.useMemo(() => {
    let filtered = visibleHistory.filter((line, index, arr) => {
      if (props.echo) {
        if (line.type === 'output' && arr[index - 1]?.type === 'userInput') return false
        return true
      }
      return line.type === 'output'
    })
    if (filtered.length > MAX_VISIBLE_LINES) {
      filtered = filtered.slice(-MAX_VISIBLE_LINES)
    }
    return filtered
  }, [visibleHistory, props.echo])

  const searchIndices = React.useMemo(() => {
    if (!searchTerm) return null
    const term = searchTerm.toLowerCase()
    const indices = []
    displayLines.forEach((line, idx) => {
      if (String(line.value).toLowerCase().includes(term)) indices.push(idx)
    })
    return indices
  }, [displayLines, searchTerm])

  const prevLength = React.useRef(displayLines.length)

  React.useEffect(() => {
    if (prevLength.current !== displayLines.length) {
      prevLength.current = displayLines.length
      if (isSticky && !paused && listRef.current && displayLines.length > 0) {
        listRef.current.scrollToItem(displayLines.length - 1, 'end')
      }
    }
  }, [displayLines.length, isSticky, paused])

  React.useEffect(() => {
    if (outerRef.current) {
      outerRef.current.style.overflowX = 'hidden'
      outerRef.current.style.overflowY = 'scroll'
    }
  }, [size])

  const handleScroll = ({ scrollOffset }) => {
    if (!listRef.current) return
    const totalHeight = displayLines.length * LINE_HEIGHT + BOTTOM_PADDING
    const { height } = size
    const atBottom = height > 0 && totalHeight - scrollOffset - height < 24
    setIsSticky(atBottom)
  }

  const scrollToBottom = () => {
    if (listRef.current && displayLines.length > 0) {
      listRef.current.scrollToItem(displayLines.length - 1, 'end')
      setIsSticky(true)
    }
  }

  const handleClear = () => {
    props.clearToast && props.clearToast()
    props.setHistory && props.setHistory([])
  }

  const togglePause = () => {
    setPaused(prev => {
      const next = !prev
      if (next) {
        frozenSnapshot.current = liveHistory
      } else {
        frozenSnapshot.current = null
      }
      return next
    })
  }

  const toggleSearch = () => {
    setSearchOpen(prev => !prev)
    if (searchOpen) {
      setSearchTerm('')
      setCurrentMatchIdx(0)
    }
  }

  const goToNextMatch = () => {
    if (!searchIndices || searchIndices.length === 0) return
    const next = (currentMatchIdx + 1) % searchIndices.length
    setCurrentMatchIdx(next)
    listRef.current?.scrollToItem(searchIndices[next], 'center')
  }

  const goToPrevMatch = () => {
    if (!searchIndices || searchIndices.length === 0) return
    const prev = (currentMatchIdx - 1 + searchIndices.length) % searchIndices.length
    setCurrentMatchIdx(prev)
    listRef.current?.scrollToItem(searchIndices[prev], 'center')
  }

  const buildExportText = React.useCallback((lines) => {
    return lines
      .map(line => {
        const ts = props.time && line.time ? `${line.time.toTimeString().substring(0, 8)} ` : ''
        return `${ts}${line.value}`
      })
      .join('\n')
  }, [props.time])

  const handleExport = () => {
    const text = buildExportText(displayLines)

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const now = new Date()
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
    a.download = `terminal-log-${dateStr}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyAll = async () => {
    const text = buildExportText(displayLines)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy terminal output:', err)
    }
  }

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
        setSearchTerm('')
        setCurrentMatchIdx(0)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen])

  const hasSearchResults = searchIndices && searchIndices.length > 0
  const currentDisplayMatch = hasSearchResults ? currentMatchIdx + 1 : 0
  const showScrollBtn = !isSticky && displayLines.length > 0

  // Memoize itemData to avoid re-creating React elements for every render.
  const itemData = React.useMemo(() => ({
    lines: displayLines,
    showTime: !!props.time,
    searchTerm: searchOpen ? searchTerm : '',
    searchIndices: searchOpen ? searchIndices : null,
    currentMatchIndex: searchOpen ? currentMatchIdx : null,
    highlightInLine: searchOpen && searchTerm.length > 0,
    crtTheme: props.crtTheme,
  }), [displayLines, props.time, searchOpen, searchTerm, searchIndices, currentMatchIdx, props.crtTheme])

  const toolbarBtnSx = {
    color: v('text-muted', '#8b949e'),
    '&:hover': { color: v('text', '#d4d4d4'), backgroundColor: 'transparent' },
    p: 0.5,
    minWidth: 28,
    borderRadius: '4px',
  }

  const innerElementType = React.useMemo(() => {
    return React.forwardRef(({ style, ...rest }, ref) => (
      <div
        ref={ref}
        style={{
          ...style,
          paddingBottom: `${BOTTOM_PADDING}px`,
        }}
        {...rest}
      />
    ))
  }, [])

  const frameClass = `terminalFrame${props.crtTheme ? ' crt' : ''}`

  return (
    <Box className={frameClass}>
      <Box className='terminalToolbar'>
        <Box className='terminalToolbarLeft'>
          <span className='terminalTitle'>Terminal</span>
          <span className='lineCount'>{displayLines.length} lines</span>
          {paused && <span className='pauseBadge'>Paused</span>}
        </Box>
        <Box className='terminalToolbarRight'>
          <Tooltip title={t('terminal.toolbar.clear')}>
            <IconButton size='small' sx={toolbarBtnSx} onClick={handleClear}>
              <HighlightOffIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title={paused ? t('terminal.toolbar.resume') : t('terminal.toolbar.pause')}>
            <IconButton size='small' sx={toolbarBtnSx} onClick={togglePause}>
              {paused ? <PlayArrowIcon fontSize='small' /> : <PauseIcon fontSize='small' />}
            </IconButton>
          </Tooltip>
          <Divider orientation='vertical' flexItem sx={{ mx: 0.5, borderColor: v('border', '#30363d') }} />
          <Tooltip title={t('terminal.toolbar.search')}>
            <IconButton size='small' sx={toolbarBtnSx} onClick={toggleSearch}>
              <SearchIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title={copied ? t('terminal.copied') : t('terminal.toolbar.copyAll')}>
            <IconButton size='small' sx={toolbarBtnSx} onClick={handleCopyAll}>
              <ContentCopyIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('terminal.toolbar.export')}>
            <IconButton size='small' sx={toolbarBtnSx} onClick={handleExport}>
              <FileDownloadIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Divider orientation='vertical' flexItem sx={{ mx: 0.5, borderColor: v('border', '#30363d') }} />
          <Tooltip title={t('terminal.history')}>
            <IconButton size='small' sx={toolbarBtnSx} onClick={() => setHistoryOpen(true)}>
              <HistoryIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {searchOpen && (
        <div className='searchBar'>
          <TextField
            variant='outlined'
            size='small'
            placeholder={t('terminal.searchPlaceholder')}
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentMatchIdx(0) }}
            autoFocus
            className='searchInput'
            InputProps={{
              sx: {
                color: v('text', '#d4d4d4'),
                fontSize: '0.78rem',
                fontFamily: fonts.mono,
                backgroundColor: v('bg-2', '#21262d'),
                '& .MuiOutlinedInput-notchedOutline': { borderColor: v('border', '#30363d') },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: v('text-muted', '#8b949e') },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: v('accent', '#0db4d6') },
              }
            }}
          />
          {hasSearchResults && (
            <span className='searchCounter'>{currentDisplayMatch}/{searchIndices.length}</span>
          )}
          {!hasSearchResults && searchTerm && (
            <span className='searchCounter searchNoMatch'>0/0</span>
          )}
          <IconButton size='small' onClick={goToPrevMatch} sx={{ color: v('text-muted', '#8b949e'), '&:hover': { color: v('text', '#d4d4d4') } }}>
            <KeyboardArrowUpIcon fontSize='small' />
          </IconButton>
          <IconButton size='small' onClick={goToNextMatch} sx={{ color: v('text-muted', '#8b949e'), '&:hover': { color: v('text', '#d4d4d4') } }}>
            <KeyboardArrowDownIcon fontSize='small' />
          </IconButton>
          <IconButton size='small' onClick={() => { setSearchOpen(false); setSearchTerm(''); setCurrentMatchIdx(0) }} sx={{ color: v('text-muted', '#8b949e'), '&:hover': { color: v('text', '#d4d4d4') } }}>
            <CloseIcon fontSize='small' />
          </IconButton>
        </div>
      )}

      <Box className='codeContainer' ref={containerRef}>
        {size.width > 0 && size.height > 0 && (
          <FixedSizeList
            ref={listRef}
            outerRef={outerRef}
            height={size.height}
            width={size.width}
            itemCount={displayLines.length}
            itemSize={LINE_HEIGHT}
            itemData={itemData}
            onScroll={handleScroll}
            overscanCount={8}
            innerElementType={innerElementType}
          >
            {Row}
          </FixedSizeList>
        )}
      </Box>

      {showScrollBtn && (
        <Tooltip title={t('terminal.scrollToBottom')}>
          <IconButton className='scrollToBottomBtn' onClick={scrollToBottom} size='small'>
            <VerticalAlignBottomIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      )}

      <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} PaperProps={{
        sx: { backgroundColor: v('bg-1', '#161b22'), border: `1px solid ${v('border', '#30363d')}`, color: v('text', '#d4d4d4') }
      }}>
        <DialogTitle sx={{ fontFamily: fonts.ui, fontSize: '0.95rem' }}>{t('terminal.history')}</DialogTitle>
        <List sx={{ minWidth: '10em' }}>
          {props.history
            .filter(line => line.type === 'userInput')
            .map((line, i) => (
              <ListItem
                key={`userInput-${line.id != null ? line.id : `${line.time?.getTime() || Date.now()}-${i}`}`}
                onClick={() => {
                  props.setInput && props.setInput(String(line.value))
                  setHistoryOpen(false)
                }}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: v('bg-2', '#21262d') } }}
              >
                <ListItemIcon sx={{ color: v('accent', '#0db4d6'), minWidth: 36 }}>
                  <TerminalIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText
                  primary={String(line.value)}
                  primaryTypographyProps={{
                    sx: { fontFamily: fonts.mono, fontSize: '0.82rem', color: v('text', '#d4d4d4') }
                  }}
                />
              </ListItem>
            ))}
        </List>
      </Dialog>
    </Box>
  )
}

TerminalOutput.propTypes = {
  history: PropTypes.array,
  setHistory: PropTypes.func,
  setInput: PropTypes.func,
  openSettings: PropTypes.func,
  echo: PropTypes.bool,
  time: PropTypes.bool,
  crtTheme: PropTypes.bool,
  clearToast: PropTypes.func,
}

export default TerminalOutput
