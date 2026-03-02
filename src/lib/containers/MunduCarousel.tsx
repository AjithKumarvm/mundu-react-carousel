import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  Children,
  cloneElement,
  isValidElement,
} from 'react';
import type { CSSProperties, ReactElement, TouchEvent as ReactTouchEvent, MouseEvent as ReactMouseEvent } from 'react';
import styles from './styles';
import { getCurrentStyle } from './functions';
import ArrowSVG from '../assets/svg/Arrow';

// Easing function — extracted from the old Math.easeInOutQuad monkey-patch
function easeInOutQuad(t: number, b: number, c: number, d: number): number {
  let time = t / (d / 2);
  if (time < 1) return (c / 2) * time * time + b;
  time--;
  return (-c / 2) * (time * (time - 2) - 1) + b;
}

export interface MunduCarouselProps {
  children: React.ReactNode;
  width?: string | number;
  maxWidth?: number;
  height?: number;
  arrows?: boolean;
  arrowSize?: number;
  arrowColor?: string;
  extendedStyles?: CSSProperties | null;
  className?: string;
  dots?: boolean;
  dotStyle?: CSSProperties | null;
  dotsClass?: string;
  dotClass?: string;
  autoPlay?: boolean;
  autoPlayDuration?: number;
  startPosition?: number;
  onClick?: (index: number) => void;
  swipePixels?: number;
  slideTime?: number;
  rotateSlides?: boolean;
  onSlided?: ((index: number) => void) | null;
  dotsWithArrows?: boolean;
}

export interface MunduCarouselHandle {
  left: () => void;
  right: () => void;
}

interface SlotState {
  left: number;
  center: number;
  right: number;
}

const DEFAULTS = {
  width: '100%' as string | number,
  maxWidth: 500,
  height: 360,
  arrows: true,
  arrowSize: 15,
  arrowColor: 'white',
  extendedStyles: null as CSSProperties | null,
  className: '',
  dots: true,
  dotStyle: null as CSSProperties | null,
  dotsClass: '',
  dotClass: '',
  autoPlay: true,
  autoPlayDuration: 3000,
  startPosition: 0,
  swipePixels: 50,
  slideTime: 300,
  rotateSlides: true,
  onSlided: null as ((index: number) => void) | null,
  dotsWithArrows: false,
};

const MunduCarousel = forwardRef<MunduCarouselHandle, MunduCarouselProps>(
  function MunduCarousel(rawProps, ref) {
    const {
      width = DEFAULTS.width,
      maxWidth = DEFAULTS.maxWidth,
      height = DEFAULTS.height,
      arrows = DEFAULTS.arrows,
      arrowSize = DEFAULTS.arrowSize,
      arrowColor = DEFAULTS.arrowColor,
      extendedStyles = DEFAULTS.extendedStyles,
      className = DEFAULTS.className,
      dots = DEFAULTS.dots,
      dotStyle = DEFAULTS.dotStyle,
      dotsClass = DEFAULTS.dotsClass,
      dotClass = DEFAULTS.dotClass,
      autoPlay = DEFAULTS.autoPlay,
      autoPlayDuration = DEFAULTS.autoPlayDuration,
      startPosition = DEFAULTS.startPosition,
      onClick,
      swipePixels = DEFAULTS.swipePixels,
      slideTime = DEFAULTS.slideTime,
      rotateSlides = DEFAULTS.rotateSlides,
      onSlided = DEFAULTS.onSlided,
      dotsWithArrows = DEFAULTS.dotsWithArrows,
    } = rawProps;

    // Refs
    const carouselWrapperRef = useRef<HTMLDivElement>(null);
    const leftSlideRef = useRef<HTMLDivElement>(null);
    const centerSlideRef = useRef<HTMLDivElement>(null);
    const rightSlideRef = useRef<HTMLDivElement>(null);
    const animatingRef = useRef(false);
    const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const xDownRef = useRef<number | null>(null);
    const yDownRef = useRef<number | null>(null);
    const mountedRef = useRef(false);

    // Prepare children with dimensions and onClick
    const preparedChildren = useMemo(() => {
      return Children.map(rawProps.children, (child, index) => {
        if (!isValidElement(child)) return child;
        return cloneElement(child as ReactElement<Record<string, unknown>>, {
          onClick: () => onClick?.(index),
          style: {
            width,
            maxWidth,
            height,
          },
        });
      }) ?? [];
    }, [rawProps.children, width, maxWidth, height, onClick]);

    const slideCount = preparedChildren.length;

    // Slot state (which slide index occupies left/center/right)
    const [slots, setSlots] = useState<SlotState>(() => {
      let sp = startPosition;
      if (sp < 0 || sp >= slideCount) {
        console.error('Mundu Carousel: Invalid Start Position', sp);
        sp = 0;
      }
      if (slideCount <= 1) {
        return { left: 0, center: 0, right: 0 };
      }
      return {
        left: sp - 1 < 0 ? slideCount - 1 : sp - 1,
        center: sp,
        right: sp + 1 > slideCount - 1 ? 0 : sp + 1,
      };
    });

    // Keep a ref to slots for use inside setTimeout chains (avoids stale closures)
    const slotsRef = useRef(slots);
    slotsRef.current = slots;

    // Apply CSS transforms directly to DOM elements (animation frames)
    const applyTransforms = useCallback((percToMove: number) => {
      const setTransform = (el: HTMLDivElement | null, offset: number) => {
        if (!el) return;
        const value = `translateX(${percToMove + offset}%)`;
        el.style.transform = value;
        el.style.webkitTransform = value;
      };
      setTransform(leftSlideRef.current, -100);
      setTransform(centerSlideRef.current, 0);
      setTransform(rightSlideRef.current, 100);
    }, []);

    // Update slot positions after animation completes
    const updatePositions = useCallback((direction: 'left' | 'right') => {
      setSlots((prev) => {
        const max = slideCount - 1;
        if (direction === 'left') {
          return {
            left: prev.left > 0 ? prev.left - 1 : max,
            center: prev.center > 0 ? prev.center - 1 : max,
            right: prev.right > 0 ? prev.right - 1 : max,
          };
        } else {
          return {
            left: prev.left < max ? prev.left + 1 : 0,
            center: prev.center < max ? prev.center + 1 : 0,
            right: prev.right < max ? prev.right + 1 : 0,
          };
        }
      });
    }, [slideCount]);

    // Animation end handler
    const animationEnd = useCallback((direction: 'left' | 'right') => {
      try {
        applyTransforms(0);
        updatePositions(direction);
      } catch (e) {
        console.error(e);
      }
    }, [applyTransforms, updatePositions]);

    // Animate slide with easing
    const animateSlide = useCallback((direction: 'left' | 'right') => {
      const to = direction === 'left' ? 100 : -100;
      const start = 0;
      const change = to - start;
      let currentTime = 0;
      const increment = 5;

      const animateScroll = () => {
        animatingRef.current = true;
        currentTime += increment;
        const val = easeInOutQuad(currentTime, start, change, slideTime);
        applyTransforms(val);
        if (currentTime < slideTime) {
          setTimeout(animateScroll, increment);
        } else {
          animationEnd(direction);
          animatingRef.current = false;
        }
      };
      animateScroll();
    }, [slideTime, applyTransforms, animationEnd]);

    // Slide left/right with rotation guard
    const slideLeftInternal = useCallback(() => {
      if (!rotateSlides && slotsRef.current.center === 0) return;
      if (!animatingRef.current) animateSlide('left');
    }, [rotateSlides, animateSlide]);

    const slideRightInternal = useCallback(() => {
      if (!rotateSlides && slotsRef.current.right === 0) return;
      if (!animatingRef.current) animateSlide('right');
    }, [rotateSlides, animateSlide]);

    // Auto-play
    const startAutoPlay = useCallback(() => {
      if (!autoPlay) return;
      if (autoPlayTimerRef.current !== null) {
        clearTimeout(autoPlayTimerRef.current);
      }
      autoPlayTimerRef.current = setTimeout(() => {
        slideRightInternal();
        startAutoPlay();
      }, autoPlayDuration);
    }, [autoPlay, autoPlayDuration, slideRightInternal]);

    // Public triggers (slide + restart autoplay)
    const triggerLeft = useCallback(() => {
      slideLeftInternal();
      startAutoPlay();
    }, [slideLeftInternal, startAutoPlay]);

    const triggerRight = useCallback(() => {
      slideRightInternal();
      startAutoPlay();
    }, [slideRightInternal, startAutoPlay]);

    // Expose left() and right() via ref
    useImperativeHandle(ref, () => ({
      left: triggerLeft,
      right: triggerRight,
    }), [triggerLeft, triggerRight]);

    // Auto-play lifecycle
    useEffect(() => {
      startAutoPlay();
      return () => {
        if (autoPlayTimerRef.current !== null) {
          clearTimeout(autoPlayTimerRef.current);
        }
      };
    }, [startAutoPlay]);

    // Fire onSlided after slot changes (skip initial mount)
    useEffect(() => {
      if (mountedRef.current) {
        onSlided?.(slots.center);
      } else {
        mountedRef.current = true;
      }
    }, [slots.center, onSlided]);

    // Passive touchstart listener (matches original behavior)
    useEffect(() => {
      const noop = () => {};
      window.addEventListener('touchstart', noop, { passive: false });
      return () => {
        window.removeEventListener('touchstart', noop);
      };
    }, []);

    // Touch handlers
    const handleTouchStart = useCallback((evt: ReactTouchEvent<HTMLDivElement>) => {
      xDownRef.current = evt.touches[0].clientX;
      yDownRef.current = evt.touches[0].clientY;
    }, []);

    const handleTouchMove = useCallback((evt: ReactTouchEvent<HTMLDivElement>) => {
      if (xDownRef.current === null || yDownRef.current === null) return;

      const xUp = evt.touches[0].clientX;
      const yUp = evt.touches[0].clientY;
      const xDiff = xDownRef.current - xUp;
      const yDiff = yDownRef.current - yUp;

      if (Math.abs(xDiff) + Math.abs(yDiff) > swipePixels) {
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
          if (xDiff > 0) {
            slideRightInternal();
          } else {
            slideLeftInternal();
          }
          startAutoPlay();
        }
        xDownRef.current = null;
        yDownRef.current = null;
      }
    }, [swipePixels, slideRightInternal, slideLeftInternal, startAutoPlay]);

    // Arrow button handler
    const handleSlideButton = useCallback((direction: 'left' | 'right', event: ReactMouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      if (direction === 'left') {
        slideLeftInternal();
      } else {
        slideRightInternal();
      }
      startAutoPlay();
    }, [slideLeftInternal, slideRightInternal, startAutoPlay]);

    // Dot click handler
    const handleDotClick = useCallback((index: number) => {
      setSlots({
        left: index - 1 < 0 ? slideCount - 1 : index - 1,
        center: index,
        right: index + 1 > slideCount - 1 ? 0 : index + 1,
      });
      startAutoPlay();
    }, [slideCount, startAutoPlay]);

    // Arrow visibility
    const showLeftArrow = arrows && (rotateSlides || slots.center !== 0);
    const showRightArrow = arrows && (rotateSlides || slots.right !== 0);

    // Render arrow
    const renderArrow = (direction: 'left' | 'right') => {
      const show = direction === 'left' ? showLeftArrow : showRightArrow;
      const arrowStyle = dotsWithArrows
        ? styles.inlineBlockArrows
        : direction === 'left'
          ? styles.leftArrow
          : styles.rightArrow;

      return (
        <div
          style={arrowStyle}
          onClick={show ? (e) => handleSlideButton(direction, e) : undefined}
        >
          <ArrowSVG
            style={{ visibility: show ? 'visible' : 'hidden' }}
            rotate={direction}
            color={arrowColor}
            size={arrowSize}
          />
        </div>
      );
    };

    // Render dots
    const renderDots = () => {
      const dotBaseStyle: CSSProperties = {
        ...styles.dot,
        backgroundColor: arrowColor,
      };

      return (
        <div style={styles.dots} className={dotsClass}>
          {dotsWithArrows && renderArrow('left')}
          {preparedChildren.map((_, index) => (
            <span
              className={`${index === slots.center ? 'dot active ' : 'dot '}${dotClass}`}
              key={index}
              style={{
                ...dotBaseStyle,
                ...dotStyle,
                opacity: index === slots.center ? 1 : 0.6,
              }}
              onClick={() => handleDotClick(index)}
            />
          ))}
          {dotsWithArrows && renderArrow('right')}
        </div>
      );
    };

    return (
      <div
        style={{
          ...styles.carouselWrapper,
          width,
          maxWidth,
          height,
          ...extendedStyles,
        }}
        ref={carouselWrapperRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={className}
      >
        <div
          style={{ ...styles.slideWrapper, ...getCurrentStyle('left') }}
          key="left"
          ref={leftSlideRef}
        >
          {preparedChildren[slots.left]}
        </div>
        <div
          style={{ ...styles.slideWrapper, ...getCurrentStyle('center') }}
          key="center"
          ref={centerSlideRef}
        >
          {preparedChildren[slots.center]}
        </div>
        <div
          style={{ ...styles.slideWrapper, ...getCurrentStyle('right') }}
          key="right"
          ref={rightSlideRef}
        >
          {preparedChildren[slots.right]}
        </div>
        {dots && renderDots()}
        {showLeftArrow && !dotsWithArrows && renderArrow('left')}
        {showRightArrow && !dotsWithArrows && renderArrow('right')}
      </div>
    );
  }
);

export default MunduCarousel;
