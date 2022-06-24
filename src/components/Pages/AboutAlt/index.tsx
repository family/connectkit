import React, { useEffect, useState } from 'react';
import { ImageContainer, Slider, Slides, Slide, Dots, Dot } from './styles';

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
import { contentVariants } from '../../ConnectModal/ConnectWithInjector';

const About: React.FC = () => {
  const localizeText = (text: string) => {
    return localize(text, {
      //CONNECTORNAME: connector.name,
    });
  };
  const context = useContext();
  const copy = localizations[context.lang].aboutScreen;

  const [slider, setSlider] = useState(0);

  let interval: ReturnType<typeof setInterval>;

  const gotoSlide = (index: number) => {
    setSlider(index);
    clearInterval(interval);
  };

  useEffect(() => {
    interval = setInterval(() => {
      //setSlider((prevSlider) => (prevSlider + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
          <MotionConfig transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
            <AnimatePresence>
              {graphics.map(
                (g, i) =>
                  slider === i && (
                    <div
                      key={i}
                      style={{
                        zIndex: slider === i ? 2 : 1,
                        position: 'absolute',
                      }}
                    >
                      {g}
                    </div>
                  )
              )}
            </AnimatePresence>
          </MotionConfig>
        </ImageContainer>
        <Slides>
          <AnimatePresence>
            {slides.map(
              (s, i) =>
                slider === i && (
                  <Slide
                    key={i}
                    initial={'initial'}
                    animate={'animate'}
                    exit={'exit'}
                    variants={contentVariants}
                  >
                    <ModalContent style={{ gap: 8, paddingBottom: 0 }}>
                      {s}
                    </ModalContent>
                  </Slide>
                )
            )}
          </AnimatePresence>
        </Slides>
      </Slider>
      <Dots>
        {slides.map((s, i) => (
          <Dot key={i} $active={slider === i} onClick={() => gotoSlide(i)} />
        ))}
      </Dots>
      <Button href={copy.ctaUrl} arrow>
        {localizeText(copy.ctaText)}
      </Button>
    </PageContent>
  );
};

export default About;
