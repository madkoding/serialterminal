import React from 'react'

const UsbIcon = ({ width = 24, height = 24, color = '#ffffff' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L10.5 4H8C7.45 4 7 4.45 7 5S7.45 6 8 6H10.5L12 8L13.5 6H16C16.55 6 17 5.55 17 5S16.55 4 16 4H13.5L12 2ZM6 6V18C6 19.1 6.9 20 8 20H16C17.1 20 18 19.1 18 18V6H6ZM8 8H16V18H8V8Z"
      fill={color}
    />
  </svg>
)

export default UsbIcon
