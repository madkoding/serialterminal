import React from 'react'
import { useTranslation } from 'react-i18next'
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material'
import LanguageIcon from '@mui/icons-material/Language'

const LanguageSelector = () => {
  const { i18n, t } = useTranslation()

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value)
  }

  // Asegurar que tenemos un valor válido para el select
  const currentLanguage = i18n.language && ['en', 'es'].includes(i18n.language) ? i18n.language : 'en'

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
      </Select>
    </FormControl>
  )
}

export default LanguageSelector
