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
import { SlideOne, SlideTwo } from './graphics';

const About: React.FC = () => {
  const localizeText = (text: string) => {
    return localize(text, {
      //CONNECTORNAME: connector.name,
    });
  };
  const context = useContext();
  const copy = localizations[context.lang].aboutScreen;

  const [slider, setSlider] = useState(0);

  const gotoSlide = (index: number) => {
    setSlider(index);
    console.log(interval);
    clearInterval(interval);
  };

  let interval;
  useEffect(() => {
    interval = setInterval(() => {
      //setSlider((prevSlider) => (prevSlider + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const slides: React.ReactNode[] = [
    <ModalContent style={{ gap: 8 }}>
      <ImageContainer>
        <SlideOne />
      </ImageContainer>
      <ModalH1 $small>{localizeText(copy.a_h1)}</ModalH1>
      <ModalBody>{localizeText(copy.a_p)}</ModalBody>
    </ModalContent>,
    <ModalContent style={{ gap: 8 }}>
      <ImageContainer>
        <SlideTwo />
      </ImageContainer>
      <ModalH1 $small>{localizeText(copy.b_h1)}</ModalH1>
      <ModalBody>{localizeText(copy.b_p)}</ModalBody>
    </ModalContent>,
  ];

  const positionCSS = {
    '--width': `${slides.length * 100}%`,
    '--x': `-${(slider / slides.length) * 100}%`,
  } as React.CSSProperties;

  return (
    <PageContent style={{ width: 336 }}>
      <ModalHeadingBlock />
      <Slider>
        <Slides style={positionCSS}>
          {slides.map((s, i) => (
            <Slide key={i}>{s}</Slide>
          ))}
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
