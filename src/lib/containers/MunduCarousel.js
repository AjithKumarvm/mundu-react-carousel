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
    this.xDown = null                                                       
    this.yDown = null
    this.animating = false
    this.autoPlayTimer = null
    this.left = this.triggerLeft.bind(this)
    this.right = this.triggerRight.bind(this)
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
    }, () => {
      this.fixStartPosition(() => {
        this.startAutoPlay()
      })
    })
  }
  triggerLeft() {
    this.slideLeft()
    this.startAutoPlay()
  }
  triggerRight() {
    this.slideRight()
    this.startAutoPlay()
  }
  fixStartPosition(callback) {
    const {startPosition} = this.getProps()
    let {left, center, right, slides} = this.state
    if(startPosition < 0 || startPosition > slides -1) {
      console.error('Mundu Carousel: Invalid Start Position', startPosition)
      startPosition = 0
    }
    center = startPosition
    left = startPosition - 1
    right = startPosition + 1
    if(left < 0) {
      left = slides - 1
    }
    if(right > slides - 1) {
      right = 0
    }
    this.setState({
      left,
      center,
      right
    }, () => {
      callback()
    })
  }
  startAutoPlay() {
    const { autoPlay, autoPlayDuration } = this.getProps()
    if (!autoPlay) {
      return
    }
    clearTimeout(this.autoPlayTimer)
    this.autoPlayTimer =  setTimeout(() => {
      this.slideRight()
      this.startAutoPlay()
    }, autoPlayDuration)
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
      left_slider.style.webkitTransform = `translateX(${percToMove - currentSlidePerc - 100}%)`
      left_slider.style.transform = `translateX(${percToMove - currentSlidePerc - 100}%)`
    }
    const center_slide = this.refs[`slide_${center}`]
    if (center_slide) {
      center_slide.style.webkitTransform = `translateX(${percToMove - currentSlidePerc}%)`
      center_slide.style.transform = `translateX(${percToMove - currentSlidePerc}%)`
    }
    const right_slider = this.refs[`slide_${right}`]
    if (right_slider) {
      right_slider.style.webkitTransform = `translateX(${percToMove - currentSlidePerc + 100}%)`
      right_slider.style.transform = `translateX(${percToMove - currentSlidePerc + 100}%)`
    }
  }
  handleTouchStart (evt) {
    this.xDown = evt.touches[0].clientX
    this.yDown = evt.touches[0].clientY
  }
  handleTouchMove (evt) {
    if (!this.xDown || !this.yDown) {
      return
    }

    const xUp = evt.touches[0].clientX
    const yUp = evt.touches[0].clientY

    const xDiff = this.xDown - xUp
    const yDiff = this.yDown - yUp
    const { swipePixels } = this.getProps()
    if (Math.abs(xDiff) + Math.abs(yDiff) > swipePixels) {
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
        this.startAutoPlay()
      }
      /* reset values */
      this.xDown = null
      this.yDown = null
    }
  }
  animateSlide (direction) {
    const { slideTime } = this.getProps()
    const to = direction == 'left' ? 100 : -100
    const start = this.state.currentSlidePerc
    const change = to - start
    let currentTime = 0
    const increment = 5
    const self = this
    const animateScroll = () => {
      this.animating = true
      currentTime += increment
      const val = Math.easeInOutQuad(currentTime, start, change, slideTime)
      self.applyTransforms(val, 0)
      if (currentTime < slideTime) {
        setTimeout(animateScroll, increment)
      } else {
        self.animationEnd(direction)
        this.animating = false
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
      const {onSlided} = this.getProps()
      onSlided && onSlided(this.state.center)
    } catch (e) {
      console.error(e)
    }
  }
  slideLeft () {
    const {rotateSlides} = this.getProps()
    if(!rotateSlides && this.state.center === 0) {
      return
    }
    !this.animating && this.animateSlide('left')
  }
  slideRight () {
    const {rotateSlides} = this.getProps()
    if(!rotateSlides && this.state.right === 0) {
      return
    }
    !this.animating && this.animateSlide('right')
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
      this.startAutoPlay()
    })
  }
  getProps () {
    const defaultProps = {
      width: '100%',
      maxWidth: 500,
      height: 360,
      arrows: true,
      arrowSize: 15,
      arrowColor: 'white',
      extendedStyles: null,
      className: '',
      dots: true,
      dotStyle: null,
      dotsClass: '',
      dotClass: '',
      autoPlay: true,
      autoPlayDuration: 3000,
      startPosition: 0,
      swipePixels: 50,
      slideTime: 300,
      rotateSlides: true,
      onSlided: null,
      dotsWithArrows: false
    }
    let allProps = {
      ...defaultProps,
      ...this.props
    }
    allProps.children =  React.Children.map(allProps.children, (child, index) => {
      return React.cloneElement(child, {
        onClick: () => {
          allProps.onClick && allProps.onClick(index)
        },
        style: { // copied the parent dimentions to children also
          width: allProps.width,
          maxWidth: allProps.maxWidth,
          height: allProps.height
        }
      })
    })
    return allProps
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
    }, () => {
      const {onSlided} = this.getProps()
      onSlided && onSlided(this.state.center)
    })
    this.startAutoPlay()
  }
  renderDots ({props, dotsWithArrows}) {
    const dotStyle = {
      ...styles.dot,
      backgroundColor: props.arrowColor
    }
    const {center} = this.state
    const activeClass = 'dot active '
    return <div style={styles.dots} className={props.dotsClass}>
      {dotsWithArrows && this.renderArrows({props, direction: 'left'})}
      {
        props.children.map((child, index) => 
          <span className={`${index === center ? activeClass : 'dot '}${props.dotClass}`} key={index} style={{...dotStyle, ...props.dotStyle, opacity: index === center ? 1 : dotStyle.opacity}} onClick={() => this.dotClick(index)} />
        )
      }
      {dotsWithArrows && this.renderArrows({props, direction: 'right'})}
    </div>
  }
  renderArrows ({direction, props}) {
    const { showLeftArrow, showRightArrow } = this.showArrowsCheck({props})
    if (direction === 'left') {
      return <div
        style={props.dotsWithArrows ? styles.inlineBlockArrows : styles.leftArrow}
        onClick={showLeftArrow && this.slideButtons.bind(this, 'left')}
      >
        <ArrowSVG style={{visibility: showLeftArrow ? 'visible' : 'hidden'}} rotate='left' color={props.arrowColor} size={props.arrowSize} />
      </div>
    } else {
      return <div
        style={props.dotsWithArrows ? styles.inlineBlockArrows : styles.rightArrow}
        onClick={showRightArrow && this.slideButtons.bind(this, 'right')}
      >
        <ArrowSVG style={{visibility : showRightArrow ? 'visible' : 'hidden'}} rotate='right' color={props.arrowColor} size={props.arrowSize} />
      </div>
    }
  }
  showArrowsCheck ({props}) {
    const { center, right } = this.state
    let showLeftArrow = props.arrows
    if(showLeftArrow && !props.rotateSlides && center === 0) {
      showLeftArrow = false
    }
    let showRightArrow = props.arrows
    if(showRightArrow && !props.rotateSlides && right === 0) {
      showRightArrow = false
    }
    return {
      showLeftArrow,
      showRightArrow
    }
  }
  render () {
    const { left, center, right } = this.state
    const props = this.getProps()
    const { showLeftArrow, showRightArrow } = this.showArrowsCheck({props})
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
        >
          {props.children[left]}
        </div>

        <div
          style={{ ...styles.slideWrapper, ...getCurrentStyle('center') }}
          key={'center'}
          ref={`slide_${center}`}
        >
          {props.children[center]}
        </div>

        <div
          style={{ ...styles.slideWrapper, ...getCurrentStyle('right') }}
          key={'right'}
          ref={`slide_${right}`}
        >
          {props.children[right]}
        </div>
        {props.dots && this.renderDots({props, dotsWithArrows: props.dotsWithArrows})}
        {showLeftArrow && !props.dotsWithArrows &&
          this.renderArrows({direction: 'left', props})}
        {showRightArrow && !props.dotsWithArrows &&
          this.renderArrows({direction: 'right', props})}
      </div>
    )
  }
}

export default MunduCarousel
