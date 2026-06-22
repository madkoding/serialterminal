import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FormControl, Select, MenuItem } from '@mui/material'
import { v, fonts } from '../theme'

const LanguageSelector = () => {
  const { i18n, t } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState('en')

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value)
  }

  useEffect(() => {
    const getCurrentLanguage = () => {
      const currentLang = i18n.language || i18n.languages?.[0] || 'en'
      const supportedLanguages = ['en', 'es', 'fr', 'it', 'pt', 'de', 'ja', 'ko', 'zh', 'ru', 'ar', 'nl']
      if (supportedLanguages.includes(currentLang)) return currentLang
      const langCode = currentLang.split('-')[0].toLowerCase()
      if (supportedLanguages.includes(langCode)) return langCode
      return 'en'
    }

    const updateLanguage = () => {
      const detectedLang = getCurrentLanguage()
      setCurrentLanguage(detectedLang)
    }

    updateLanguage()
    i18n.on('languageChanged', updateLanguage)
    return () => {
      i18n.off('languageChanged', updateLanguage)
    }
  }, [i18n])

  return (
    <FormControl variant='filled' fullWidth sx={{ mt: 0.5, minWidth: '10em' }}>
      <Select
        value={currentLanguage}
        onChange={handleLanguageChange}
        sx={{
          color: v('text', '#d4d4d4'),
          fontFamily: fonts.ui,
          fontSize: '0.82rem',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: v('border', '#30363d') },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: v('text-muted', '#8b949e') },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: v('accent', '#0db4d6') },
          '& .MuiSvgIcon-root': { color: v('text-muted', '#8b949e') },
        }}
      >
        <MenuItem value="en">{t('language.english')}</MenuItem>
        <MenuItem value="es">{t('language.spanish')}</MenuItem>
        <MenuItem value="fr">{t('language.french')}</MenuItem>
        <MenuItem value="it">{t('language.italian')}</MenuItem>
        <MenuItem value="pt">{t('language.portuguese')}</MenuItem>
        <MenuItem value="de">{t('language.german')}</MenuItem>
        <MenuItem value="ja">{t('language.japanese')}</MenuItem>
        <MenuItem value="ko">{t('language.korean')}</MenuItem>
        <MenuItem value="zh">{t('language.chinese')}</MenuItem>
        <MenuItem value="ru">{t('language.russian')}</MenuItem>
        <MenuItem value="ar">{t('language.arabic')}</MenuItem>
        <MenuItem value="nl">{t('language.dutch')}</MenuItem>
      </Select>
    </FormControl>
  )
}

export default LanguageSelector
