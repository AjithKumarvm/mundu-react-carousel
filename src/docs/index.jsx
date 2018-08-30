import React from 'react'
import { render } from 'react-dom'
import MunduCarousel from '../lib/containers/MunduCarousel'

const Home = () => (
  <div>
    <MunduCarousel maxWidth={500} height={350} className='name'>
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
)

render(<Home />, document.getElementById('app'))
