import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'
import Terminal from './components/Terminal'
import Settings from './components/Settings'
import ErrorMessage from './components/ErrorMessage'

import Serial from './modules/Serial'
import { setCookie, getCookie } from './modules/cookie.js'
import { applyTheme, v } from './theme'

const DEFAULT_SETTINGS = {
  baudRate: 115200,
  lineEnding: '\\r\\n',
  echoFlag: true,
  timeFlag: false,
  ctrlFlag: true,
  maxLines: 50000,
  persistLog: true,
  autoReconnect: true,
  reconnectInterval: 3000,
  backoffEnabled: true,
  crtTheme: false,
  colorScheme: 'dev-tools',
}

const loadSettings = () => {
  let settings = { ...DEFAULT_SETTINGS }

  const cookieValue = getCookie('settings')

  try {
    const cookieJSON = JSON.parse(cookieValue)

    for (const key of Object.keys(DEFAULT_SETTINGS)) {
      if (key in cookieJSON) settings[key] = cookieJSON[key]
    }
  } catch (e) {
    console.error(e)
  }

  return settings
}

function App() {
  const { t } = useTranslation()
  const [serial] = React.useState(() => new Serial())

  const [connected, setConnected] = React.useState(false)
  const [connectionState, setConnectionState] = React.useState('disconnected')
  const [connectionType, setConnectionType] = React.useState(null)
  const [terminalOpened, setTerminalOpened] = React.useState(false)

  const [reconnectInfo, setReconnectInfo] = React.useState({ attempt: 0, maxAttempts: 0, delay: 0 })

  const [received, setReceived] = React.useState({ time: new Date(), value: '' })

  const [toast, setToast] = React.useState({ open: false, severity: 'info', value: '' })

  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [settings, setSettings] = React.useState(loadSettings())

  const [errorOpen, setErrorOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  const serialRef = React.useRef(serial)

  // Sync serial options when settings change
  React.useEffect(() => {
    const s = serialRef.current
    s.setBaudRate(settings.baudRate)
    s.setReconnectOptions({
      maxAttempts: settings.autoReconnect ? 20 : 0,
      interval: settings.reconnectInterval,
      backoff: settings.backoffEnabled,
    })
  }, [settings])

  // Apply theme when colorScheme changes
  React.useEffect(() => {
    applyTheme(settings.colorScheme)
  }, [settings.colorScheme])

  const saveSettings = (newSettings) => {
    const s = serialRef.current
    s.setBaudRate(newSettings.baudRate)
    s.setReconnectOptions({
      maxAttempts: newSettings.autoReconnect ? 20 : 0,
      interval: newSettings.reconnectInterval,
      backoff: newSettings.backoffEnabled,
    })
    setSettings(newSettings)
    setCookie('settings', JSON.stringify(newSettings), 365)
  }

  const closeToast = () => {
    setToast({ ...toast, open: false })
  }

  const connect = () => {
    const s = serialRef.current

    if (!s.supported()) {
      console.error(`Serial not supported`)
      return
    }

    s.onSuccess = () => {
      setConnected(true)
      setConnectionState('connected')
      setTerminalOpened(true)
      setToast({ open: true, severity: 'success', value: t('app.toasts.connected') })
    }

    s.onFail = () => {
      setConnected(false)
      setConnectionState('disconnected')
      setConnectionType(null)
      setToast({ open: true, severity: 'error', value: t('app.toasts.disconnected') })
    }

    s.onReconnecting = (attempt, maxAttempts, delay) => {
      setConnected(false)
      setConnectionState('reconnecting')
      setReconnectInfo({ attempt, maxAttempts, delay })
      setToast({
        open: true,
        severity: 'warning',
        value: t('app.toasts.reconnectingWithDelay', { attempt, maxAttempts, seconds: Math.ceil(delay / 1000) }),
      })
    }

    s.onReconnectFailed = () => {
      setToast({ open: true, severity: 'error', value: t('app.toasts.reconnectFailed') })
    }

    s.onReceive = (value) => {
      setReceived({
        time: new Date(),
        value: `${value}`,
      })

      const receivedString = `${value}`.toLowerCase()
      if (receivedString.includes('slimevr slimenrf receiver')) {
        setConnectionType('receiver')
      } else if (receivedString.includes('slimevr slimenrf tracker')) {
        setConnectionType('tracker')
      }
    }

    s.requestPort().then(res => {
      if (res !== '') {
        setErrorMessage(res)
        setErrorOpen(true)
      }
    })
  }

  const handleSend = (str) => {
    const map = {
      'None': '',
      '\\r': '\r',
      '\\n': '\n',
      '\\r\\n': '\r\n',
    }
    serialRef.current.send(`${str}${map[settings.lineEnding]}`)
  }

  const handleRawSend = (byte) => {
    serialRef.current.sendByte(byte)
  }

  React.useEffect(() => {
    const handler = () => setSettingsOpen(true)
    window.addEventListener('openSettings', handler)
    return () => window.removeEventListener('openSettings', handler)
  }, [])

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: v('bg-0', '#0d1117'),
    }}>
      <Header
        connectionType={connectionType}
        connectionState={connectionState}
        reconnectAttempt={reconnectInfo.attempt}
        reconnectMaxAttempts={reconnectInfo.maxAttempts}
        reconnectDelay={reconnectInfo.delay}
      />

      {(connected || terminalOpened) ?
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <Terminal
          received={received}
          send={handleSend}
          sendRaw={handleRawSend}
          openSettings={() => setSettingsOpen(true)}
          echo={settings.echoFlag}
          time={settings.timeFlag}
          ctrl={settings.ctrlFlag}
          clearToast={() => setToast({ open: true, severity: 'info', value: t('app.toasts.historyCleared') })}
          crtTheme={settings.crtTheme}
          connected={connected}
          connect={connect}
          maxLines={settings.maxLines}
          persistLog={settings.persistLog}
          restoreToast={(count) => setToast({ open: true, severity: 'info', value: t('app.toasts.restoredSession', { count }) })}
          baudRate={settings.baudRate}
        />
        </Box>
        :
        <Home
          connect={connect}
          supported={serialRef.current.supported}
          openSettings={() => setSettingsOpen(true)}
        />
      }

      <Settings
        open={settingsOpen}
        close={() => setSettingsOpen(false)}
        settings={settings}
        save={saveSettings}
        openPort={connected}
        saveToast={() => setToast({ open: true, severity: 'success', value: t('app.toasts.settingsSaved') })}
      />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={closeToast}>
        <Alert onClose={closeToast} severity={toast.severity}>
          {toast.value}
        </Alert>
      </Snackbar>

      <ErrorMessage
        open={errorOpen}
        close={() => setErrorOpen(false)}
        message={errorMessage}
      />

      <Footer />
    </Box>
  )
}

export default App
