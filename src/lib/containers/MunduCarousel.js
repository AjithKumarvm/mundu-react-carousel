import React from 'react'

const styles = {
  carouselWrapper: {
    width: 500,
    height: 360,
    display: 'inline-block',
    position: 'relative',
    border: '1px solid #CCC',
    marginLeft: 200,
    touchAction: 'none',
    overflow: 'hidden'
  },
  slideWrapper: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  leftArrow: {
    position: 'absolute',
    top: 200,
    left: 0,
    padding: 20,
    touchAction: 'none'
  },
  rightArrow: {
    position: 'absolute',
    top: 200,
    right: 0,
    padding: 20,
    touchAction: 'none'
  }
}
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

Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2
  if (t < 1) return c / 2 * t * t + b
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

let xDown = null                                                       
let yDown = null
let activeAnimationId = null
let animating = false

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
    let left = 0
    let center = 1
    let right = 2
    if (slides === 1) {
      left = 0
      center = 0
      right = 0
    } else if (slides === 2) {
      left = 0
      center = 1
      right = 0
    } else {
      left = 0
      center = 1
      right = 2
    }
    console.log(slides, 'sliders')
    console.log(left, center, right)
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
    const { percToMove } = this.getTouchParams(event)
    console.log('percToMove', percToMove)
    // this.setState({
    //   currentSlidePerc: percToMove
    // })
  }
  onTouchMove (event) {
    this.handleTouchMove(event)
    const { percToMove } = this.getTouchParams(event)
    const currentSlidePerc = this.state.currentSlidePerc
    //this.applyTransforms(percToMove, currentSlidePerc)
  }
  onTouchEnd (event) {
    const { percToMove } = this.getTouchParams(event)
    // this.setState({
    //   currentSlidePerc: percToMove
    // })
    console.log('onTouchEnd', percToMove)
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
    const animationId = Date.now()
    activeAnimationId = animationId
    const to = direction == 'left' ? 100 : -100
    const start = this.state.currentSlidePerc
    console.log('start', start)
    const change = to - start
    let currentTime = 0
    const increment = 5
    const self = this
    const animateScroll = function () {
      animating = true
      // if(activeAnimationId !== animationId){
      //   // early animation exit
      //   console.log('animation aborted')
      //   self.applyTransforms(to, 0)
      //   self.animationEnd(direction)
      //   return
      // }
      currentTime += increment
      const val = Math.easeInOutQuad(currentTime, start, change, duration)
      self.applyTransforms(val, 0)
      if (currentTime < duration) {
        setTimeout(animateScroll, increment)
      } else {
        activeAnimationId = animationId
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
    console.log('animationEnd', direction)
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
        // setInterval(() => this.slideLeft(),540)
      } else {
        this.slideRight()
      }
    })
  }
  render () {
    const { left, center, right } = this.state
    return (
      <div
        style={styles.carouselWrapper}
        ref='carouselWrapper'
        onTouchStart={this.onTouchStart.bind(this)}
        onTouchMove={this.onTouchMove.bind(this)}
        onTouchEnd={this.onTouchEnd.bind(this)}
      >
        <div
          style={{ ...styles.slideWrapper, ...getCurrentStyle('left') }}
          key={'left'}
          ref={`slide_${left}`}
        >
          {this.props.children[left]}
          {`slide_${left}`}
        </div>

        <div
          style={{ ...styles.slideWrapper, ...getCurrentStyle('center') }}
          key={'center'}
          ref={`slide_${center}`}
        >
          {this.props.children[center]}
          {`slide_${center}`}
        </div>

        <div
          style={{ ...styles.slideWrapper, ...getCurrentStyle('right') }}
          key={'right'}
          ref={`slide_${right}`}
        >
          {this.props.children[right]}
          {`slide_${right}`}
        </div>

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
          <div style={{position:'fixed', bottom: 0, left: 0}}>
            left: {this.state.left} center: {this.state.center} right: {this.state.right} current: {this.state.currentSlidePerc}
          </div>
      </div>
    )
  }
}

export default MunduCarousel
