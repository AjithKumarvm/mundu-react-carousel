import React from 'react'

const styleMap = {
  up: {
    transform: 'rotate(180deg)'
  },
  down: {
    transform: 'rotate(0deg)'
  },
  left: {
    transform: 'rotate(90deg)'
  },
  right: {
    transform: 'rotate(270deg)'
  }
}

const Arrow = ({ size = 10, color = '#282828', rotate = 'down', style = null }) => (
  <svg
    width={size}
    viewBox='0 0 10 6'
    style={{...styleMap[rotate], ...style}}
  >
    <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
      <g
        transform='translate(-308.000000, -38.000000)'
        fill={color}
        fillRule='nonzero'
      >
        <g transform='translate(230.000000, 31.000000)'>
          <polygon
            transform='translate(83.000000, 10.000000) rotate(-270.000000) translate(-83.000000, -10.000000) '
            points='80 6.2534273 81.2026307 5 86 10 81.2026307 15 80 13.7465727 83.5872931 10'
          />
        </g>
      </g>
    </g>
  </svg>
)

export default Arrow
