const styles = {
  carouselWrapper: {
    display: 'inline-block',
    position: 'relative',
    touchAction: 'pan-y',
    overflow: 'hidden'
  },
  slideWrapper: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0
  },
  leftArrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: 0,
    padding: 20,
    touchAction: 'none',
    cursor: 'pointer'
  },
  rightArrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: 0,
    padding: 20,
    touchAction: 'none',
    cursor: 'pointer'
  },
  dots: {
    width: '100%',
    textAlign: 'center',
    position: 'absolute',
    top: '85%',
    transform: 'translateY(-50%)',
    right: 0,
    touchAction: 'none'
  },
  dot: {
    width: 8,
    height: 8,
    display: 'inline-block',
    borderRadius: '50%',
    margin: 4,
    opacity: .6,
    cursor: 'pointer',
    verticalAlign: 'middle'
  },
  inlineBlockArrows: {
    display: 'inline-block',
    verticalAlign: 'middle',
    cursor: 'pointer',
    padding: 10
  }
}

export default styles