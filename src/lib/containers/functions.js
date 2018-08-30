const getCurrentStyle = position => {
  const positions = {
    left: { transform: 'translateX(-100%)' },
    center: { transform: 'translateX(0%)' },
    right: { transform: 'translateX(100%)' }
  }
  return positions[position]
}

const getPosition = element => {
  let xPosition = 0
  let yPosition = 0

  while (element) {
    xPosition += element.offsetLeft - element.scrollLeft + element.clientLeft
    yPosition += element.offsetTop - element.scrollTop + element.clientTop
    element = element.offsetParent
  }

  return { x: xPosition, y: yPosition }
}

export {
  getCurrentStyle,
  getPosition
}