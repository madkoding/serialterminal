import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslation from './locales/en.json'
import esTranslation from './locales/es.json'

const resources = {
  en: {
    translation: enTranslation
  },
  es: {
    translation: esTranslation
  }
}

// Países hispanohablantes
const spanishSpeakingCountries = [
  'AR', // Argentina
  'BO', // Bolivia
  'CL', // Chile
  'CO', // Colombia
  'CR', // Costa Rica
  'CU', // Cuba
  'DO', // República Dominicana
  'EC', // Ecuador
  'SV', // El Salvador
  'GQ', // Guinea Ecuatorial
  'GT', // Guatemala
  'HN', // Honduras
  'MX', // México
  'NI', // Nicaragua
  'PA', // Panamá
  'PY', // Paraguay
  'PE', // Perú
  'PR', // Puerto Rico
  'ES', // España
  'UY', // Uruguay
  'VE'  // Venezuela
]

// Función para detectar el país y determinar el idioma por defecto
const getDefaultLanguage = () => {
  try {
    // Intenta obtener la zona horaria para determinar el país
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    
    // Mapeo de zonas horarias a países hispanohablantes
    const timezoneToCountry = {
      'America/Argentina/Buenos_Aires': 'AR',
      'America/Argentina/Catamarca': 'AR',
      'America/Argentina/Cordoba': 'AR',
      'America/Argentina/Jujuy': 'AR',
      'America/Argentina/La_Rioja': 'AR',
      'America/Argentina/Mendoza': 'AR',
      'America/Argentina/Rio_Gallegos': 'AR',
      'America/Argentina/Salta': 'AR',
      'America/Argentina/San_Juan': 'AR',
      'America/Argentina/San_Luis': 'AR',
      'America/Argentina/Tucuman': 'AR',
      'America/Argentina/Ushuaia': 'AR',
      'America/La_Paz': 'BO',
      'America/Santiago': 'CL',
      'America/Bogota': 'CO',
      'America/Costa_Rica': 'CR',
      'America/Havana': 'CU',
      'America/Santo_Domingo': 'DO',
      'America/Guayaquil': 'EC',
      'America/El_Salvador': 'SV',
      'Africa/Malabo': 'GQ',
      'America/Guatemala': 'GT',
      'America/Tegucigalpa': 'HN',
      'America/Mexico_City': 'MX',
      'America/Managua': 'NI',
      'America/Panama': 'PA',
      'America/Asuncion': 'PY',
      'America/Lima': 'PE',
      'America/Puerto_Rico': 'PR',
      'Europe/Madrid': 'ES',
      'America/Montevideo': 'UY',
      'America/Caracas': 'VE'
    }
    
    const countryCode = timezoneToCountry[timeZone]
    
    if (countryCode && spanishSpeakingCountries.includes(countryCode)) {
      return 'es'
    }
    
    // Fallback: verificar el idioma del navegador
    const browserLang = navigator.language || navigator.languages?.[0]
    if (browserLang?.startsWith('es')) {
      return 'es'
    }
    
    return 'en'
  } catch (error) {
    // Si hay algún error, registrarlo y verificar el idioma del navegador como fallback
    console.warn('Error detecting country from timezone:', error.message)
    const browserLang = navigator.language || navigator.languages?.[0]
    return browserLang?.startsWith('es') ? 'es' : 'en'
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: getDefaultLanguage(),
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  })

export default i18n
