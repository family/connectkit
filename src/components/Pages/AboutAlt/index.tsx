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
import { SlideOne, SlideThree, SlideTwo } from './graphics';
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

  const [slider, setSlider] = useState(0);
  const interacted = useRef(false);
  const autoplayDuration = 3500;

  let interval: ReturnType<typeof setTimeout>;
  useEffect(() => {
    interval = setTimeout(nextSlide, autoplayDuration);

    return () => clearInterval(interval);
  }, []);

  const gotoSlide = (index: number) => {
    didInteract();
    if (sliderRef.current) {
      const { overflow } = getComputedStyle(sliderRef.current);
      if (overflow === 'visible') setSlider(index);
    }
    scrollToSlide(index);
  };

  const nextSlide = () => {
    if (interacted.current) return;

    setSlider((prevSlider) => {
      const index = (prevSlider + 1) % slides.length;
      scrollToSlide(index);
      return index;
    });
    interval = setTimeout(nextSlide, autoplayDuration);
  };

  const scrollToSlide = (index: number) => {
    if (sliderRef.current) {
      const { offsetWidth: width } = sliderRef.current;
      sliderRef.current.scrollLeft = width * index;
    }
  };

  // This event should not fire on mobile
  const onScroll = (e) => {
    if (!sliderRef.current) return;

    const { offsetWidth: width, scrollLeft: x } = e.target;
    const currentSlide = Math.round(x / width);
    setSlider(currentSlide);
  };
  const onTouchMove = (e) => {
    didInteract();
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
    return () => {
      if (!sliderRef.current) return;
      sliderRef.current.removeEventListener('scroll', onScroll);
      sliderRef.current.removeEventListener('touchmove', onTouchMove);
    };
  }, [sliderRef]);

  const graphics: React.ReactNode[] = [
    <SlideOne />,
    <SlideTwo />,
    <SlideThree />,
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
          <MotionConfig transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <AnimatePresence initial={false}>
              {graphics.map(
                (g, i) =>
                  slider === i && (
                    <ImageContainerInner
                      key={i}
                      style={{ zIndex: 2, position: 'absolute' }}
                      exit={{
                        zIndex: 1,
                      }}
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
            <Dot key={i} $active={slider === i} onClick={() => gotoSlide(i)} />
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
