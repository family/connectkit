import React, { useEffect, useRef, useState } from 'react';
import {
  ImageContainer,
  ImageContainerInner,
  MobileImageContainer,
  Slider,
  Slides,
  Slide,
  Dots,
  Dot,
} from './styles';

import {
  PageContent,
  ModalBody,
  ModalContent,
  ModalH1,
} from '../../Common/Modal/styles';

import Button from '../../Common/Button';
import { Easing, SlideOne, SlideThree, SlideTwo } from './graphics';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { OrDivider } from '../../Common/Modal';
import useLocales from '../../../hooks/useLocales';
import FitText from '../../Common/FitText';
import { useContext } from '../../ConnectKit';

const About: React.FC = () => {
  const locales = useLocales({
    //CONNECTORNAME: connector.name,
  });
  const context = useContext();

  const ctaUrl =
    context.options?.ethereumOnboardingUrl ?? locales.aboutScreen_ctaUrl;

  const [ready, setReady] = useState(true);
  const [slider, setSlider] = useState(0);
  const interacted = useRef(false);
  const scrollPos = useRef(0);

  const animationEase: Easing = [0.16, 1, 0.3, 1];
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
      setTimeout(() => setSlider(index), 100);
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
    <SlideOne
      layoutId={'graphicCircle'}
      duration={animationDuration}
      ease={animationEase}
    />,
    <SlideTwo
      layoutId={'graphicCircle'}
      duration={animationDuration}
      ease={animationEase}
    />,
    <SlideThree
      layoutId={'graphicCircle'}
      duration={animationDuration}
      ease={animationEase}
    />,
  ];

  const mobileGraphics: React.ReactNode[] = [
    <SlideOne duration={animationDuration} ease={animationEase} />,
    <SlideTwo duration={animationDuration} ease={animationEase} />,
    <SlideThree duration={animationDuration} ease={animationEase} />,
  ];

  // Adjust height of ModalBody to fit content based on language
  const slideHeight = (() => {
    switch (context.options?.language) {
      case 'en-US':
      case 'zh-CN':
        return 64;
      default:
        return 84;
    }
  })();

  const slides: React.ReactNode[] = [
    <>
      <ModalH1 style={{ height: 24 }} $small>
        <FitText>{locales.aboutScreen_a_h1}</FitText>
      </ModalH1>
      <ModalBody style={{ height: slideHeight }}>
        <FitText>{locales.aboutScreen_a_p}</FitText>
      </ModalBody>
    </>,
    <>
      <ModalH1 style={{ height: 24 }} $small>
        <FitText>{locales.aboutScreen_b_h1}</FitText>
      </ModalH1>
      <ModalBody style={{ height: slideHeight }}>
        <FitText>{locales.aboutScreen_b_p}</FitText>
      </ModalBody>
    </>,
    <>
      <ModalH1 style={{ height: 24 }} $small>
        <FitText>{locales.aboutScreen_c_h1}</FitText>
      </ModalH1>
      <ModalBody style={{ height: slideHeight }}>
        <FitText>{locales.aboutScreen_c_p}</FitText>
      </ModalBody>
    </>,
  ];

  return (
    <PageContent>
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
                <MobileImageContainer>
                  <MotionConfig
                    transition={{
                      duration: 0,
                    }}
                  >
                    <ImageContainerInner>
                      {mobileGraphics[i]}
                    </ImageContainerInner>
                  </MotionConfig>
                </MobileImageContainer>
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
              $active={slider === i}
              onClick={() => {
                didInteract();
                gotoSlide(i);
              }}
            />
          ))}
        </Dots>
      </OrDivider>
      <Button href={ctaUrl} arrow>
        {locales.aboutScreen_ctaText}
      </Button>
    </PageContent>
  );
};

export default About;
