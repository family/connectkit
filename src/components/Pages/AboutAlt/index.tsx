import React, { useEffect, useRef, useState } from 'react';
import {
  ImageContainer,
  ImageContainerInner,
  Slider,
  Slides,
  Slide,
  Dots,
  Dot,
} from './styles';

import localizations, { localize } from '../../../constants/localizations';
import { useContext } from '../../ConnectKit';

import {
  PageContent,
  ModalBody,
  ModalContent,
  ModalH1,
  ModalHeadingBlock,
} from '../../Common/Modal/styles';

import Button from '../../Common/Button';
import { Easing, SlideOne, SlideThree, SlideTwo } from './graphics';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { OrDivider } from '../../Common/Modal';

const About: React.FC = () => {
  const localizeText = (text: string) => {
    return localize(text, {
      //CONNECTORNAME: connector.name,
    });
  };
  const context = useContext();
  const copy = localizations[context.lang].aboutScreen;

  const [ready, setReady] = useState(true);
  const [slider, setSlider] = useState(0);
  const interacted = useRef(false);
  const scrollPos = useRef(0);

  const animationEase: Easing = [0.25, 1, 0.5, 1];
  const animationDuration = 600;
  const autoplayDelay = 5100;

  let interval: ReturnType<typeof setTimeout>;
  useEffect(() => {
    //interval = setTimeout(nextSlide, autoplayDelay);

    return () => clearInterval(interval);
  }, []);

  const isSwipe = () => {
    if (sliderRef.current) {
      const { overflow } = getComputedStyle(sliderRef.current);
      return overflow !== 'visible';
    }
    return false;
  };

  const gotoSlide = (index: number) => {
    setReady(false);
    if (isSwipe()) {
      scrollToSlide(index);
    } else {
      setSlider(index);
    }
  };

  const nextSlide = () => {
    if (interacted.current) return;

    setSlider((prevSlider) => {
      const index = (prevSlider + 1) % slides.length;
      scrollToSlide(index);
      return index;
    });
    interval = setTimeout(nextSlide, autoplayDelay);
  };

  const scrollToSlide = (index: number) => {
    if (sliderRef.current) {
      const { offsetWidth: width } = sliderRef.current;
      sliderRef.current.scrollLeft = width * index;
    }
  };

  // This event should not fire on mobile
  const onScroll = () => {
    if (!sliderRef.current) return;

    const { offsetWidth: width, scrollLeft: x } = sliderRef.current;

    const prevScroll = scrollPos.current;
    scrollPos.current = x;

    // Limit when the slider should be set after swipe
    const threshold = 4;
    if (prevScroll - x > -threshold && prevScroll - x < threshold) {
      const currentSlide = Math.round(x / width);
      setSlider(currentSlide);
    }
  };
  const onTouchMove = () => {
    didInteract();
  };
  const onTouchEnd = () => {
    const { offsetWidth: width, scrollLeft: x } = sliderRef.current;
    const currentSlide = Math.round(x / width);
    setSlider(currentSlide);
  };
  const didInteract = () => {
    interacted.current = true;
    clearTimeout(interval);
  };

  const sliderRef = useRef<any>(null);
  useEffect(() => {
    if (!sliderRef.current) return;
    sliderRef.current.addEventListener('scroll', onScroll);
    sliderRef.current.addEventListener('touchmove', onTouchMove);
    sliderRef.current.addEventListener('touchend', onTouchEnd);
    return () => {
      if (!sliderRef.current) return;
      sliderRef.current.removeEventListener('scroll', onScroll);
      sliderRef.current.removeEventListener('touchmove', onTouchMove);
      sliderRef.current.removeEventListener('touchend', onTouchEnd);
    };
  }, [sliderRef]);

  const graphics: React.ReactNode[] = [
    <SlideOne duration={animationDuration} ease={animationEase} />,
    <SlideTwo duration={animationDuration} ease={animationEase} />,
    <SlideThree duration={animationDuration} ease={animationEase} />,
  ];

  const slides: React.ReactNode[] = [
    <>
      <ModalH1 $small>{localizeText(copy.a_h1)}</ModalH1>
      <ModalBody>{localizeText(copy.a_p)}</ModalBody>
    </>,
    <>
      <ModalH1 $small>{localizeText(copy.b_h1)}</ModalH1>
      <ModalBody>{localizeText(copy.b_p)}</ModalBody>
    </>,
    <>
      <ModalH1 $small>{localizeText(copy.c_h1)}</ModalH1>
      <ModalBody>{localizeText(copy.c_p)}</ModalBody>
    </>,
  ];

  return (
    <PageContent>
      <ModalHeadingBlock />
      <Slider>
        <ImageContainer>
          <MotionConfig
            transition={{
              duration: animationDuration / 1000,
              ease: animationEase,
            }}
          >
            <AnimatePresence
              initial={false}
              onExitComplete={() => setReady(true)}
            >
              {graphics.map(
                (g, i) =>
                  slider === i && (
                    <ImageContainerInner
                      key={i}
                      style={{ position: 'absolute' }}
                    >
                      {g}
                    </ImageContainerInner>
                  )
              )}
            </AnimatePresence>
          </MotionConfig>
        </ImageContainer>
        <Slides ref={sliderRef}>
          <AnimatePresence>
            {slides.map((s, i) => (
              <Slide key={i} $active={slider === i}>
                <ModalContent style={{ gap: 8, paddingBottom: 0 }}>
                  {s}
                </ModalContent>
              </Slide>
            ))}
          </AnimatePresence>
        </Slides>
      </Slider>
      <OrDivider>
        <Dots>
          {slides.map((s, i) => (
            <Dot
              key={i}
              disabled={!ready}
              $active={slider === i}
              onClick={() => {
                didInteract();
                gotoSlide(i);
              }}
            />
          ))}
        </Dots>
      </OrDivider>
      <Button href={copy.ctaUrl} arrow>
        {localizeText(copy.ctaText)}
      </Button>
    </PageContent>
  );
};

export default About;
