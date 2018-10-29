import React from 'react'
import { render } from 'react-dom'
import MunduCarousel from '../lib/index'

const Home = () => (
  <div>
    <MunduCarousel maxWidth={500} width='100%' height={350} autoPlay={false} onClick={(index) => {console.log('click', index)}} swipePixels={10} slideTime={100}>
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

    <h2>Props</h2>
    <pre style={{padding: 20}}>{
      `{
        width: '100%', // width can be integer/pixel/percentage
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
        slideTime: 300 // Time taken to slide in ms
      }`}</pre>
    <h2>Usage</h2>
    <pre style={{padding: 20}}>
      {
        `<MunduCarousel maxWidth={500} height={350}>
          <children1 />
          <children2 />
          <children3 />
        </MunduCarousel>`
      }
    </pre>
  </div>
)

render(<Home />, document.getElementById('app'))
