import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material'
import LanguageIcon from '@mui/icons-material/Language'

const LanguageSelector = () => {
  const { i18n, t } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState('en')

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value)
  }

  // Actualizar el idioma cuando cambie i18n
  useEffect(() => {
    // Detectar correctamente el idioma actual
    const getCurrentLanguage = () => {
      const currentLang = i18n.language || i18n.languages?.[0] || 'en'
      
      // Lista de idiomas soportados
      const supportedLanguages = ['en', 'es', 'fr', 'it', 'pt', 'de', 'ja', 'ko', 'zh', 'ru', 'ar', 'nl']
      
      // Verificar si el idioma actual está directamente soportado
      if (supportedLanguages.includes(currentLang)) {
        return currentLang
      }
      
      // Si no, verificar por código de idioma (primeras dos letras)
      const langCode = currentLang.split('-')[0].toLowerCase()
      if (supportedLanguages.includes(langCode)) {
        return langCode
      }
      
      // Por defecto, usar inglés
      return 'en'
    }

    const updateLanguage = () => {
      const detectedLang = getCurrentLanguage()
      setCurrentLanguage(detectedLang)
    }

    // Actualizar inmediatamente
    updateLanguage()

    // Escuchar cambios de idioma
    i18n.on('languageChanged', updateLanguage)

    // Cleanup
    return () => {
      i18n.off('languageChanged', updateLanguage)
    }
  }, [i18n])

  return (
    <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
      <InputLabel 
        id="language-select-label" 
        sx={{ 
          color: '#fff',
          '&.Mui-focused': {
            color: '#fff'
          }
        }}
      >
        <LanguageIcon sx={{ mr: 0.5, fontSize: 16 }} />
      </InputLabel>
      <Select
        labelId="language-select-label"
        value={currentLanguage}
        onChange={handleLanguageChange}
        sx={{
          color: '#fff',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#fff',
          },
          '& .MuiSvgIcon-root': {
            color: '#fff',
          },
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
