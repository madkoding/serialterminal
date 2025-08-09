import React from 'react'

const TrackerIcon = ({ width = 24, height = 24, color = '#ffffff' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 3V21H21V3H3ZM5 5H19V19H5V5Z"
      fill={color}
    />
    <circle
      cx="12"
      cy="12"
      r="2"
      fill={color}
    />
    <path
      d="M7 7H9V9H7V7Z"
      fill={color}
    />
    <path
      d="M15 7H17V9H15V7Z"
      fill={color}
    />
    <path
      d="M7 15H9V17H7V15Z"
      fill={color}
    />
    <path
      d="M15 15H17V17H15V15Z"
      fill={color}
    />
  </svg>
)

export default TrackerIcon
