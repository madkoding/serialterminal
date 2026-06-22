const THEMES = {
  'dev-tools': {
    label: 'Dev Tools',
    bg0: '#0d1117', bg1: '#161b22', bg2: '#21262d',
    bgTerminal: '#0d1117', border: '#30363d',
    borderSubtle: 'rgba(255,255,255,0.08)',
    text: '#d4d4d4', textMuted: '#8b949e',
    accent: '#0db4d6', accentDim: 'rgba(13,180,214,0.15)',
    success: '#3fb950', warning: '#d29922', error: '#f85149',
    userInput: '#0db4d6',
  },
  monokai: {
    label: 'Monokai',
    bg0: '#272822', bg1: '#1e1f1c', bg2: '#3e3d32',
    bgTerminal: '#272822', border: '#3e3d32',
    borderSubtle: 'rgba(248,248,242,0.08)',
    text: '#f8f8f2', textMuted: '#8f908a',
    accent: '#a6e22e', accentDim: 'rgba(166,226,46,0.15)',
    success: '#a6e22e', warning: '#fd971f', error: '#f92672',
    userInput: '#66d9ef',
  },
  dracula: {
    label: 'Dracula',
    bg0: '#282a36', bg1: '#1e1f29', bg2: '#3a3c4a',
    bgTerminal: '#282a36', border: '#3a3c4a',
    borderSubtle: 'rgba(248,248,242,0.08)',
    text: '#f8f8f2', textMuted: '#908f9f',
    accent: '#bd93f9', accentDim: 'rgba(189,147,249,0.15)',
    success: '#50fa7b', warning: '#ffb86c', error: '#ff5555',
    userInput: '#8be9fd',
  },
  'solarized-dark': {
    label: 'Solarized Dark',
    bg0: '#002b36', bg1: '#073642', bg2: '#073642',
    bgTerminal: '#002b36', border: '#073642',
    borderSubtle: 'rgba(131,148,150,0.08)',
    text: '#93a1a1', textMuted: '#657b83',
    accent: '#268bd2', accentDim: 'rgba(38,139,210,0.15)',
    success: '#859900', warning: '#b58900', error: '#dc322f',
    userInput: '#2aa198',
  },
  nord: {
    label: 'Nord',
    bg0: '#2e3440', bg1: '#3b4252', bg2: '#434c5e',
    bgTerminal: '#2e3440', border: '#434c5e',
    borderSubtle: 'rgba(216,222,233,0.08)',
    text: '#d8dee9', textMuted: '#7b88a1',
    accent: '#88c0d0', accentDim: 'rgba(136,192,208,0.15)',
    success: '#a3be8c', warning: '#d08770', error: '#bf616a',
    userInput: '#81a1c1',
  },
  'one-dark': {
    label: 'One Dark',
    bg0: '#282c34', bg1: '#21252b', bg2: '#3a3f4b',
    bgTerminal: '#282c34', border: '#3a3f4b',
    borderSubtle: 'rgba(171,178,191,0.08)',
    text: '#abb2bf', textMuted: '#7f848e',
    accent: '#61afef', accentDim: 'rgba(97,175,239,0.15)',
    success: '#98c379', warning: '#e5c07b', error: '#e06c75',
    userInput: '#56b6c2',
  },
  gruvbox: {
    label: 'Gruvbox',
    bg0: '#282828', bg1: '#1d2021', bg2: '#3c3836',
    bgTerminal: '#282828', border: '#3c3836',
    borderSubtle: 'rgba(235,219,178,0.08)',
    text: '#ebdbb2', textMuted: '#928374',
    accent: '#fe8019', accentDim: 'rgba(254,128,25,0.15)',
    success: '#b8bb26', warning: '#fabd2f', error: '#fb4934',
    userInput: '#83a598',
  },
  'tokyo-night': {
    label: 'Tokyo Night',
    bg0: '#1a1b26', bg1: '#16161e', bg2: '#2f3346',
    bgTerminal: '#1a1b26', border: '#2f3346',
    borderSubtle: 'rgba(169,177,214,0.08)',
    text: '#a9b1d6', textMuted: '#565f89',
    accent: '#7aa2f7', accentDim: 'rgba(122,162,247,0.15)',
    success: '#9ece6a', warning: '#e0af68', error: '#f7768e',
    userInput: '#7dcfff',
  },
  catppuccin: {
    label: 'Catppuccin',
    bg0: '#1e1e2e', bg1: '#181825', bg2: '#313244',
    bgTerminal: '#1e1e2e', border: '#313244',
    borderSubtle: 'rgba(205,214,244,0.08)',
    text: '#cdd6f4', textMuted: '#6c7086',
    accent: '#f5c2e7', accentDim: 'rgba(245,194,231,0.15)',
    success: '#a6e3a1', warning: '#f9e2af', error: '#f38ba8',
    userInput: '#89b4fa',
  },
  synthwave: {
    label: 'Synthwave',
    bg0: '#241b2d', bg1: '#1a1225', bg2: '#362748',
    bgTerminal: '#241b2d', border: '#362748',
    borderSubtle: 'rgba(244,238,228,0.08)',
    text: '#f4eee4', textMuted: '#8b8198',
    accent: '#ff7edb', accentDim: 'rgba(255,126,219,0.15)',
    success: '#36f9f6', warning: '#fede5d', error: '#fe4450',
    userInput: '#72f1b8',
  },
}

export const themeSchemes = Object.entries(THEMES).map(([id, t]) => ({
  id,
  label: t.label,
  bg0: t.bg0,
  text: t.text,
  accent: t.accent,
}))

export const applyTheme = (name) => {
  const theme = THEMES[name]
  if (!theme) return
  const root = document.documentElement
  for (const [key, value] of Object.entries(theme)) {
    if (key === 'label') continue
    const cssName = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    root.style.setProperty(`--${cssName}`, value)
  }
}

export const v = (name, fallback) => `var(--${name}, ${fallback})`

export const palette = THEMES['dev-tools']

export const fonts = {
  mono: `'Courier Prime', 'Cascadia Code', 'Fira Code', monospace`,
  ui: `Inter, system-ui, -apple-system, sans-serif`,
}

export const injectTheme = () => applyTheme('dev-tools')
