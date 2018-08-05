import React from 'react'

const styles = {
  carouselWrapper: {
    width: 500,
    height: 360,
    display: 'inline-block',
    position: 'relative',
    border: '1px solid #CCC',
    marginLeft: 200,
    touchAction: 'none'
  },
  slideWrapper: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  leftArrow: {
    position: 'absolute',
    top: 200,
    left: 0
  },
  rightArrow: {
    position: 'absolute',
    top: 200,
    right: 0
  }
}
const getCurrentStyle = index => {
  const positions = {
    0: { transform: 'translateX(-100%)' },
    1: { transform: 'translateX(0%)' },
    2: { transform: 'translateX(100%)' }
  }
  return positions[index]
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

Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2
  if (t < 1) return c / 2 * t * t + b
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

class MunduCarousel extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: 293,
      left: 0,
      center: 1,
      right: 2,
      currentSlidePerc: 0
    }
  }
  componentDidMount () {
    window.addEventListener('touchstart', () => null, { passive: false })
    this.setState({
      slides: this.props.children.length
    })
  }
  getTouchParams (event) {
    const carouselWrapper = this.refs.carouselWrapper
    const carouselWidth = carouselWrapper.offsetWidth
    const touchX = event.changedTouches[0].pageX
    const offsetX =
      event.changedTouches[0].target.offsetLeft ||
      event.changedTouches[0].target.x
    const relativeOffset = touchX - offsetX
    const percToMove = relativeOffset / carouselWidth * 100
    return { percToMove }
  }
  onTouchStart (event) {
    const { percToMove } = this.getTouchParams(event)
    this.setState({
      currentSlidePerc: percToMove
    })
  }
  onTouchEnd (event) {
    const { percToMove } = this.getTouchParams(event)
    this.setState({
      currentSlidePerc: percToMove
    })
  }
  applyTransforms (percToMove, currentSlidePerc) {
    const { left, center, right } = this.state
    const center_slide = this.refs[`slide_${center}`]
    center_slide.style.transform = `translateX(${percToMove - currentSlidePerc}%)`
    const left_slider = this.refs[`slide_${left}`]
    left_slider.style.transform = `translateX(${percToMove - currentSlidePerc - 100}%)`
    const right_slider = this.refs[`slide_${right}`]
    right_slider.style.transform = `translateX(${percToMove - currentSlidePerc + 100}%)`
  }
  onTouchMove (event) {
    const { percToMove } = this.getTouchParams(event)
    const currentSlidePerc = this.state.currentSlidePerc
    this.applyTransforms(percToMove, currentSlidePerc)
  }
  animateSlide (direction, duration = 500) {
    const to = direction == 'left'?100:-100
    const start = 0
    const change = to - start
    let currentTime = 0
    const increment = 20
    const self = this

    const animateScroll = function () {
      currentTime += increment
      const val = Math.easeInOutQuad(currentTime, start, change, duration)
      self.applyTransforms(val, 0)
      if (currentTime < duration) {
        setTimeout(animateScroll, increment)
      }else{
          self.animationEnd(direction)
      }
    }
    animateScroll()
  }
  animationEnd(direction){
    console.log('animationEnd', direction)
  }
  slideLeft () {
    this.animateSlide('left')
  }
  slideRight () {
    this.animateSlide('right')
  }
  slideButtons (direction) {
    if (direction == 'left') {
      this.slideLeft()
    } else {
      this.slideRight()
    }
  }
  render () {
    const { left, right } = this.state
    return (
      <div
        style={styles.carouselWrapper}
        ref='carouselWrapper'
        onTouchStart={this.onTouchStart.bind(this)}
        onTouchMove={this.onTouchMove.bind(this)}
        onTouchEnd={this.onTouchEnd.bind(this)}
      >
        {this.props.children.slice(left, right + 1).map((child, index) => {
          return (
            <div
              style={{ ...styles.slideWrapper, ...getCurrentStyle(index) }}
              key={index}
              ref={`slide_${index}`}
            >
              {child}
            </div>
          )
        })}
        {this.props.slideLeft ||
          <div
            style={styles.leftArrow}
            onClick={this.slideButtons.bind(this, 'left')}
          >
            {'<<'}
          </div>}
        {this.props.slideLeft ||
          <div
            style={styles.rightArrow}
            onClick={this.slideButtons.bind(this, 'right')}
          >
            {'>>'}
          </div>}
      </div>
    )
  }
}

export default MunduCarousel
