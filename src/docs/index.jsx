import React from 'react'
import { render } from 'react-dom'
import MunduCarousel from '../lib/index'

function handleEvent(event) {
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

const mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

class Home extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', handleEvent.bind(this))
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', handleEvent.bind(this))
  }
  render() {
    return (
      <React.Fragment>
        <header className='header'>
          <h1 className='colored'>Mundu React Carousel</h1>
          <h5 className='headerSubText'>No dependencies &bull; feather light carousel for React &bull; with swipe for mobile &bull; customisable ui &bull; external handle to slide next</h5>
        </header>
        <div className='carouselArea'>
          <MunduCarousel
            className='carousel'
            ref='carousel'
            maxWidth={mobilecheck() ? 500 : 750}
            width='100%'
            height={mobilecheck() ? 275 : 500}
            autoPlay
            onClick={index => {
              console.log('click', index)
            }}
            swipePixels={10}
            autoPlayDuration={2000}
            slideTime={100}
            rotateSlides
            onSlided={index => {
              console.log('slided', index)
            }}
          >
            <img
              alt='Fox caught in action under the rain'
              src='https://i.imgur.com/vt1Bu3m.jpg'
            />
            <img
              alt='Hummingbird'
              src='https://i.imgur.com/dma96XC.jpg'
            />
            <img
              alt={`Moving at a snail's pace`}
              src='https://i.imgur.com/oPGJUzw.jpg'
            />
            <img
              alt='Bathing  in the snowflake'
              src='https://i.imgur.com/z6iTu7s.jpg'
            />
            <img
              alt='Dragging you deep into the woods'
              src='https://i.imgur.com/4HpORDw.jpg'
            />
            <img
              alt='Alien lights'
              src='https://i.imgur.com/6SWgo50.jpg'
            />
          </MunduCarousel>
        </div>
        <div className='container'>
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
          <h2>Tip 1: Swipe on mobile</h2>
          <div className='para'>
            Swipe will work on mobile browser or check mobile view in Chrome dev tools.
        </div>
          <h2>Tip 2: Image Flickering issue</h2>
          <div className='para'>
            If images in slides are flickering after sliding. Set image file header Cache-Control: max-age=1535272 in your cdn or files server. Or host your images in https://imgur.com
        </div>
        </div>
      </React.Fragment>
    )
  }
}

render(<Home />, document.getElementById('app'))
