import React from 'react'
import styles from './styles'
import { getCurrentStyle } from './functions'
import ArrowSVG from '../assets/svg/Arrow' 

Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2
  if (t < 1) return c / 2 * t * t + b
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

let xDown = null                                                       
let yDown = null
let animating = false
let defaultProps = {
  width: '100%',
  maxWidth: 500,
  height: 360,
  size: 15,
  arrowColor: 'white',
  extendedStyles: null,
  className: null,
  dots: true,
  dotStyle: null
}

class MunduCarousel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      left: 0,
      center: 1,
      right: 2,
      currentSlidePerc: 0,
      slides: 0
    }
  }
  componentDidMount () {
    window.addEventListener('touchstart', () => null, { passive: false })
    const slides = this.props.children.length
    let left = slides - 1
    let center = 0
    let right = 1
    if (slides === 1) {
      left = 0
      center = 0
      right = 0
    } else if (slides === 2) {
      left = slides - 1
      center = 0
      right = 1
    } else {
      left = slides - 1
      center = 0
      right = 1
    }
    this.setState({
      slides,
      left,
      center,
      right
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
    this.handleTouchStart(event)
    // const { percToMove } = this.getTouchParams(event)
  }
  onTouchMove (event) {
    this.handleTouchMove(event)
    // const { percToMove } = this.getTouchParams(event)
    // const currentSlidePerc = this.state.currentSlidePerc
  }
  onTouchEnd (event) {
    // const { percToMove } = this.getTouchParams(event)
  }
  applyTransforms (percToMove, currentSlidePerc) {
    const { left, center, right } = this.state
    const left_slider = this.refs[`slide_${left}`]
    if (left_slider) {
      left_slider.style.transform = `translateX(${percToMove - currentSlidePerc - 100}%)`
    }
    const center_slide = this.refs[`slide_${center}`]
    if (center_slide) {
      center_slide.style.transform = `translateX(${percToMove - currentSlidePerc}%)`
    }
    const right_slider = this.refs[`slide_${right}`]
    if (right_slider) {
      right_slider.style.transform = `translateX(${percToMove - currentSlidePerc + 100}%)`
    }
  }
  handleTouchStart (evt) {
    xDown = evt.touches[0].clientX
    yDown = evt.touches[0].clientY
  }
  handleTouchMove (evt) {
    if (!xDown || !yDown) {
      return
    }

    const xUp = evt.touches[0].clientX
    const yUp = evt.touches[0].clientY

    const xDiff = xDown - xUp
    const yDiff = yDown - yUp
    if (Math.abs(xDiff) + Math.abs(yDiff) > 150) {
      // to deal with to short swipes

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        /* most significant */
        if (xDiff > 0) {
          /* left swipe */
          this.slideRight()
        } else {
          /* right swipe */
          this.slideLeft()
        }
      }
      /* reset values */
      xDown = null
      yDown = null
    }
  }
  animateSlide (direction, duration = 300) {
    const to = direction == 'left' ? 100 : -100
    const start = this.state.currentSlidePerc
    const change = to - start
    let currentTime = 0
    const increment = 5
    const self = this
    const animateScroll = function () {
      animating = true
      currentTime += increment
      const val = Math.easeInOutQuad(currentTime, start, change, duration)
      self.applyTransforms(val, 0)
      if (currentTime < duration) {
        setTimeout(animateScroll, increment)
      } else {
        self.animationEnd(direction)
        animating = false
      }
    }
    animateScroll()
  }
  updatePositions (direction) {
    if(direction === 'left') {
      this.setState({
        left: this.state.left ? --this.state.left : this.state.slides - 1,
        center: this.state.center
          ? --this.state.center
          : this.state.slides - 1,
        right: this.state.right ? --this.state.right : this.state.slides - 1
      })
    } else {
      this.setState({
        left: this.state.left < this.state.slides - 1 ? ++this.state.left : 0,
        center: this.state.center < this.state.slides - 1
          ? ++this.state.center
          : 0,
        right: this.state.right < this.state.slides - 1
          ? ++this.state.right
          : 0
      })
    }
  }
  animationEnd (direction) {
    try {
      this.applyTransforms(0, 0)
      this.updatePositions(direction)
    } catch (e) {
      console.error(e)
    }
  }
  slideLeft () {
    !animating && this.animateSlide('left')
  }
  slideRight () {
    !animating && this.animateSlide('right')
  }
  slideButtons (direction, event) {
    event.stopPropagation()
    event.preventDefault()
    this.setState({
      currentSlidePerc: 0
    }, () => {
      if (direction == 'left') {
        this.slideLeft()
      } else {
        this.slideRight()
      }
    })
  }
  getProps () {
    return {
      ...defaultProps,
      ...this.props
    }
  }
  dotClick (index) {
    const {slides} = this.state
    const positions = {
      left: index-1,
      center: index,
      right: index+1
    }
    this.setState({
      left: positions.left,
      center: positions.center,
      right: positions.right > slides - 1 ? 0 : positions.right
    })
  }
  renderDots (props) {
    const dotStyle = {
      ...styles.dot,
      backgroundColor: props.arrowColor
    }
    const {center} = this.state
    return <div style={styles.dots}>{props.children.map((child, index) => <span key={index} style={{...dotStyle, ...props.dotStyle, opacity: index === center ? 1 : dotStyle.opacity}} onClick={() => this.dotClick(index)} />)}</div>
  }
  render () {
    const { left, center, right } = this.state
    const props = this.getProps()
    return (
      <div
        style={{...styles.carouselWrapper, width: props.width, maxWidth: props.maxWidth, height: props.height, ...props.extendedStyles}}
        ref='carouselWrapper'
        onTouchStart={this.onTouchStart.bind(this)}
        onTouchMove={this.onTouchMove.bind(this)}
        onTouchEnd={this.onTouchEnd.bind(this)}
        className={props.className}
      >
        <div
          style={{ ...styles.slideWrapper, ...getCurrentStyle('left') }}
          key={'left'}
          ref={`slide_${left}`}
          id={`slide_${left}`}
        >
          {props.children[left]}
        </div>

        <div
          style={{ ...styles.slideWrapper, ...getCurrentStyle('center') }}
          key={'center'}
          ref={`slide_${center}`}
          id={`slide_${center}`}
        >
          {props.children[center]}
        </div>

        <div
          style={{ ...styles.slideWrapper, ...getCurrentStyle('right') }}
          key={'right'}
          ref={`slide_${right}`}
          id={`slide_${right}`}
        >
          {props.children[right]}
        </div>
        {props.dots ? this.renderDots(props) : null}
        {props.slideLeft ||
          <div
            style={styles.leftArrow}
            onClick={this.slideButtons.bind(this, 'left')}
          >
            <ArrowSVG rotate='left' color={props.arrowColor} size={props.size} />
          </div>}
        {props.slideRight ||
          <div
            style={styles.rightArrow}
            onClick={this.slideButtons.bind(this, 'right')}
          >
            <ArrowSVG rotate='right' color={props.arrowColor} size={props.size} />
          </div>}
      </div>
    )
  }
}

export default MunduCarousel
