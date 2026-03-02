import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { MunduCarousel } from '../lib';
import type { MunduCarouselHandle } from '../lib';

function mobileCheck(): boolean {
  if (typeof navigator === 'undefined') return false;
  const a = navigator.userAgent || (navigator as unknown as Record<string, string>).vendor || (window as unknown as Record<string, string>).opera || '';
  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(a.substr(0, 4));
}

const PROPS_DATA = [
  { name: 'width', type: 'string | number', default: "'100%'", desc: 'Width of the carousel. Accepts px, %, or number.' },
  { name: 'maxWidth', type: 'number', default: '500', desc: 'Maximum width in pixels. Set for desktop, use width for mobile.' },
  { name: 'height', type: 'number', default: '360', desc: 'Height of the carousel in pixels. Required.' },
  { name: 'arrows', type: 'boolean', default: 'true', desc: 'Show navigation arrows.' },
  { name: 'arrowSize', type: 'number', default: '15', desc: 'Size of the arrow icon in pixels.' },
  { name: 'arrowColor', type: 'string', default: "'white'", desc: 'Color of arrows and dot indicators. Accepts hex, rgba, or named colors.' },
  { name: 'dots', type: 'boolean', default: 'true', desc: 'Show dot indicators below the slides.' },
  { name: 'dotStyle', type: 'CSSProperties', default: 'null', desc: 'Custom inline styles for individual dots.' },
  { name: 'dotsClass', type: 'string', default: "''", desc: 'CSS class for the dots wrapper container.' },
  { name: 'dotClass', type: 'string', default: "''", desc: 'CSS class for each individual dot element.' },
  { name: 'dotsWithArrows', type: 'boolean', default: 'false', desc: 'Render arrows inline next to the dots instead of overlaying the slides.' },
  { name: 'autoPlay', type: 'boolean', default: 'true', desc: 'Enable automatic slide advancement.' },
  { name: 'autoPlayDuration', type: 'number', default: '3000', desc: 'Time between auto-advances in milliseconds.' },
  { name: 'slideTime', type: 'number', default: '300', desc: 'Duration of the slide animation in milliseconds.' },
  { name: 'startPosition', type: 'number', default: '0', desc: 'Index of the initially visible slide.' },
  { name: 'rotateSlides', type: 'boolean', default: 'true', desc: 'Enable infinite loop. Set false to stop at first/last slide.' },
  { name: 'swipePixels', type: 'number', default: '50', desc: 'Minimum swipe distance in pixels to trigger a slide change.' },
  { name: 'className', type: 'string', default: "''", desc: 'CSS class for the carousel wrapper.' },
  { name: 'extendedStyles', type: 'CSSProperties', default: 'null', desc: 'Additional inline styles for the carousel wrapper.' },
  { name: 'onClick', type: '(index: number) => void', default: '-', desc: 'Callback fired when a slide is clicked. Receives slide index.' },
  { name: 'onSlided', type: '(index: number) => void', default: '-', desc: 'Callback fired after a slide transition completes. Receives new slide index.' },
  { name: 'ref', type: 'MunduCarouselHandle', default: '-', desc: 'Ref exposing left() and right() methods for external control.' },
];

function PropsTable() {
  return (
    <table className="props-table">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {PROPS_DATA.map((prop) => (
          <tr key={prop.name}>
            <td className="prop-name">{prop.name}</td>
            <td className="prop-type">{prop.type}</td>
            <td className="prop-default">{prop.default}</td>
            <td>{prop.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Home() {
  const carouselRef = useRef<MunduCarouselHandle>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          carouselRef.current?.left();
          break;
        case 'ArrowRight':
          carouselRef.current?.right();
          break;
        default:
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isMobile = mobileCheck();

  return (
    <>
      <header className="header">
        <h1 className="colored">Mundu React Carousel</h1>
        <h5 className="headerSubText">
          A feather-light, zero-dependency carousel for React with touch support, autoplay, and full TypeScript types.
        </h5>
        <div className="badges">
          <span className="badge badge--ts">TypeScript</span>
          <span className="badge badge--react">React 16-19+</span>
          <span className="badge badge--zero">Zero Dependencies</span>
          <span className="badge badge--light">~14 KB</span>
        </div>
      </header>

      <div className="carouselArea">
        <MunduCarousel
          className="carousel"
          ref={carouselRef}
          maxWidth={isMobile ? 500 : 750}
          width="100%"
          height={isMobile ? 275 : 500}
          autoPlay
          onClick={(index) => console.log('click', index)}
          swipePixels={10}
          autoPlayDuration={2000}
          slideTime={100}
          rotateSlides
          onSlided={(index) => console.log('slided', index)}
        >
          <img alt="Colors" src="https://images.freeimages.com/images/large-previews/753/light-effects-14-1200296.jpg" />
          <img alt="Bottle" src="https://images.freeimages.com/images/large-previews/a62/pour-1187721.jpg" />
          <img alt="Cars" src="https://images.freeimages.com/images/large-previews/ef8/cars-1420635.jpg" />
          <img alt="Tyres" src="https://images.freeimages.com/images/large-previews/1b4/car-1555101.jpg" />
          <img alt="Perfect family" src="https://images.freeimages.com/images/large-previews/3ec/bikes-on-a-cliff-1439703.jpg" />
          <img alt="Beach" src="https://images.freeimages.com/images/large-previews/d1b/ocean-1540203.jpg" />
        </MunduCarousel>
      </div>

      <div className="container">
        {/* Install */}
        <h2>Installation</h2>
        <div className="install-section">
          <code>npm install mundu-react-carousel</code>
          <code>yarn add mundu-react-carousel</code>
        </div>

        {/* Basic Usage */}
        <h2>Basic Usage</h2>
        <p className="section-desc">Wrap any elements as children. Each child becomes a slide.</p>
        <pre className="code">{`import { MunduCarousel } from 'mundu-react-carousel'

function App() {
  return (
    <MunduCarousel maxWidth={500} height={350}>
      <img src="/slide-1.jpg" alt="Slide 1" />
      <img src="/slide-2.jpg" alt="Slide 2" />
      <img src="/slide-3.jpg" alt="Slide 3" />
    </MunduCarousel>
  )
}`}</pre>

        {/* Props */}
        <h2>Props</h2>
        <p className="section-desc">All props are optional except children. The carousel works out of the box with sensible defaults.</p>
        <PropsTable />

        {/* External Control */}
        <h2>External Control</h2>
        <p className="section-desc">
          Use a ref to programmatically slide left or right. The ref exposes <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: 4, fontSize: '0.85rem' }}>left()</code> and <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: 4, fontSize: '0.85rem' }}>right()</code> methods.
        </p>
        <pre className="code">{`import { useEffect, useRef } from 'react'
import { MunduCarousel } from 'mundu-react-carousel'
import type { MunduCarouselHandle } from 'mundu-react-carousel'

function App() {
  const carouselRef = useRef<MunduCarouselHandle>(null)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  carouselRef.current?.left()
      if (e.key === 'ArrowRight') carouselRef.current?.right()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <MunduCarousel ref={carouselRef} maxWidth={500} height={350}>
      <img src="/slide-1.jpg" alt="Slide 1" />
      <img src="/slide-2.jpg" alt="Slide 2" />
      <img src="/slide-3.jpg" alt="Slide 3" />
    </MunduCarousel>
  )
}`}</pre>

        {/* Customisation */}
        <h2>Customisation Examples</h2>

        <h3>No autoplay, no infinite loop</h3>
        <pre className="code">{`<MunduCarousel
  autoPlay={false}
  rotateSlides={false}
  maxWidth={600}
  height={400}
>
  {slides}
</MunduCarousel>`}</pre>

        <h3>Dots with inline arrows</h3>
        <pre className="code">{`<MunduCarousel
  dotsWithArrows
  arrowColor="#333"
  arrowSize={12}
  maxWidth={600}
  height={400}
>
  {slides}
</MunduCarousel>`}</pre>

        <h3>Custom dot styling</h3>
        <pre className="code">{`<MunduCarousel
  dotStyle={{ width: 12, height: 12, borderRadius: 2 }}
  arrowColor="#e74c3c"
  maxWidth={600}
  height={400}
>
  {slides}
</MunduCarousel>`}</pre>

        {/* Tips */}
        <h2>Tips</h2>

        <div className="tip">
          <div className="tip-title">Swipe on Mobile</div>
          <p>Touch swipe works natively on mobile browsers. You can also test it using Chrome DevTools device mode. Adjust sensitivity with the <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: 4, fontSize: '0.85rem' }}>swipePixels</code> prop.</p>
        </div>

        <div className="tip">
          <div className="tip-title">Image Flickering</div>
          <p>If images flicker after sliding, set the <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: 4, fontSize: '0.85rem' }}>Cache-Control: max-age=31536000</code> header on your image CDN, or use a reliable image host.</p>
        </div>

        <div className="tip">
          <div className="tip-title">Keyboard Navigation</div>
          <p>This demo page supports arrow key navigation. Use the ref-based external control pattern shown above to add it to your own app.</p>
        </div>
      </div>

      <footer className="footer">
        Built by <a href="https://github.com/AjithKumarvm" target="_blank" rel="noopener noreferrer">Ajith Kumar VM</a>
        {' '}&bull;{' '}
        <a href="https://github.com/AjithKumarvm/mundu-react-carousel" target="_blank" rel="noopener noreferrer">GitHub</a>
        {' '}&bull;{' '}
        <a href="https://www.npmjs.com/package/mundu-react-carousel" target="_blank" rel="noopener noreferrer">npm</a>
      </footer>
    </>
  );
}

const rootElement = document.getElementById('app');
if (rootElement) {
  createRoot(rootElement).render(<Home />);
}
