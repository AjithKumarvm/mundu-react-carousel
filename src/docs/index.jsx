import React from 'react'
import { render } from 'react-dom'
import MunduCarousel from '../lib/index'

function handleEvent (event) {
  const { key } = event // "ArrowLeft", "ArrowRight", "Shift", etc.
  switch (key) {
    case 'ArrowLeft':
      this.refs.carousel.left()
      break
    case 'ArrowRight':
      this.refs.carousel.right()
      break
    default:
      break
  }
}

class Home extends React.Component {
  componentDidMount () {
    document.addEventListener('keydown', handleEvent.bind(this))
  }
  componentWillUnmount () {
    document.removeEventListener('keydown', handleEvent.bind(this))
  }
  render () {
    return (
      <div className='container'>
        <h1>Mundu React Carousel</h1>
        <div className='carouselArea'>
          <MunduCarousel
            ref='carousel'
            maxWidth={500}
            width='100%'
            height={350}
            autoPlay
            onClick={index => {
              console.log('click', index)
            }}
            swipePixels={10}
            autoPlayDuration={2000}
            slideTime={100}
            rotateSlides={false}
            onSlided={index => {
              console.log('slided', index)
            }}
          >
            <img
              ng-src='https://nestaway-houses.akamaized.net/uploads/webp/thumb_large_e65976df-e4c9-4430-9595-696f7236e8a1.webp'
              alt='Sowmya Girish Nest 3 BHK Independent House'
              src='https://nestaway-houses.akamaized.net/uploads/webp/thumb_large_e65976df-e4c9-4430-9595-696f7236e8a1.webp'
            />
            <img
              ng-src='https://nestaway-houses.akamaized.net/uploads/webp/thumb_large_b5ec78e0-f10a-4339-8854-30d04c9381c0.webp'
              alt='Sowmya Girish Nest 3 BHK Independent House'
              src='https://nestaway-houses.akamaized.net/uploads/webp/thumb_large_b5ec78e0-f10a-4339-8854-30d04c9381c0.webp'
            />
            <img
              ng-src='https://nestaway-houses.akamaized.net/uploads/webp/thumb_large_73765af7-559a-4440-87ae-e795296866b5.webp'
              alt='Sowmya Girish Nest 3 BHK Independent House'
              src='https://nestaway-houses.akamaized.net/uploads/webp/thumb_large_73765af7-559a-4440-87ae-e795296866b5.webp'
            />
            <img
              ng-src='https://nestaway-houses.akamaized.net/uploads/webp/thumb_large_4311f65c-bbda-4796-a2a0-5f3647d11eee.webp'
              alt='Sowmya Girish Nest 3 BHK Independent House'
              src='https://nestaway-houses.akamaized.net/uploads/webp/thumb_large_4311f65c-bbda-4796-a2a0-5f3647d11eee.webp'
            />
            <img
              ng-src='https://nestaway-houses.akamaized.net/uploads/webp/thumb_large_ecbc314d-32f0-43dd-9c38-68f14ef3b4bc.webp'
              alt='Sowmya Girish Nest 3 BHK Independent House'
              src='https://nestaway-houses.akamaized.net/uploads/webp/thumb_large_ecbc314d-32f0-43dd-9c38-68f14ef3b4bc.webp'
            />
            <img
              ng-src='https://nestaway-houses.akamaized.net/uploads/webp/thumb_large_fa24f6c0-2581-4551-a373-8d27959e4adb.webp'
              alt='Sowmya Girish Nest 3 BHK Independent House'
              src='https://nestaway-houses.akamaized.net/uploads/webp/thumb_large_fa24f6c0-2581-4551-a373-8d27959e4adb.webp'
            />
          </MunduCarousel>
        </div>

        <h2>Props</h2>
        <pre className='code'>{`{
          width: '100%', // width can be integer/pixel/percentage.
          maxWidth: 500, // maxWidth should be set for desktop and width for mobile
          height: 360, // height is mandatory. All child maintaing this height is ideal
          arrows: true, // show arrows
          arrowSize: 15, // size of the arrow
          arrowColor: 'white', // hashcodes/rgba
          extendedStyles: null, // expects js styles (object) for wrapper
          className: null, // css class for wrapper
          dots: true, // show dots(bool)
          dotStyle: null, // js styles for dots,
          dotsClass: null, // className for dots wrapper
          dotClass: null, // className for each dot
          autoPlay: true, // enable/disable autoplay
          autoPlayDuration: 3000, // duration of a slide
          startPosition: 0, // preset the starting slide
          onClick: (index) => {}, // gives the index of the current slide
          swipePixels: 50, // sensitivity to swipe in px
          slideTime: 300, // Time taken to slide in ms
          rotateSlides: true, // set false to block the transition from end to start
          onSlided: (index) => {}, // triggered when slide transition is completed
          dotsWithArrows: true // shows arrows near the dots
          ref: 'carousel' // send ref to control the slide transitions externally. this.refs.carousel.left() or this.refs.carousel.right()
        }`}</pre>
        <h2>Usage</h2>
        <pre className='code'>
          {`
          import MunduCarousel from 'mundu-react-carousel'

          
          <MunduCarousel maxWidth={500} height={350}>
            <children1 />
            <children2 />
            <children3 />
          </MunduCarousel>`}
        </pre>

        <h2>Handling slide left or right externally</h2>
        <pre className='code'>
          {`
          import MunduCarousel from 'mundu-react-carousel'

          function handleEvent (event) {
            const { key } = event // "ArrowLeft", "ArrowRight", "Shift", etc.
            switch (key) {
              case 'ArrowLeft':
                this.refs.carousel.left()
                break
              case 'ArrowRight':
                this.refs.carousel.right()
                break
              default:
                break
            }
          }

          class Carousel extends React.Component {
            componentDidMount () {
              document.addEventListener('keydown', handleEvent.bind(this))
            }
            componentWillUnmount () {
              document.removeEventListener('keydown', handleEvent.bind(this))
            }
            render () {
              return (<MunduCarousel maxWidth={500} height={350} ref='carousel'>
              <children1 />
              <children2 />
              <children3 />
            </MunduCarousel>)
            }
          }`}
        </pre>
      </div>
    )
  }
}

render(<Home />, document.getElementById('app'))
