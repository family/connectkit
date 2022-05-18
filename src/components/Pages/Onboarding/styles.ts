import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled(motion.div)`
  max-width: 100%;
  width: 295px;
`;
export const Graphic = styled(motion.div)`
  position: relative;
  margin: 0px auto 16px;
  height: 190px;
  pointer-events: none;
  user-select: none;
`;
export const LogoGroup = styled(motion.div)`
  position: absolute;
  inset: 0;
  z-index: 2;
`;
export const GraphicBackground = styled(motion.div)`
  z-index: 1;
  position: absolute;
  inset: 0;
  top: -2px;
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--body-background);
    background: radial-gradient(
      closest-side,
      var(--body-background-transparent) 18.75%,
      var(--body-background) 100%
    );
    background-size: 100%;
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const logoIn = keyframes`
  0%{
    opacity:0;
    transform:scale(0) translateY(40%);
  }
  100%{
    opacity:1;
    transform:none;
  }
`;
export const LogoPosition = styled(motion.div)`
  position: absolute;
  animation: cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite both;
  animation-delay: inherit;
`;
export const LogoGraphic = styled(motion.div)`
  position: relative;
  overflow: hidden;
  height: 58px;
  width: 58px;
  border-radius: 13.84px;
  background: var(--body-background-secondary);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 20px 0 rgba(0, 0, 0, 0.03);

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;
const float = keyframes`
  0%,100%{ transform:none; }
  50%{ transform: translateY(-10%) }
`;
export const FloatWrapper = styled(motion.div)`
  position: relative;
  animation: cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite both;
  animation-name: ${float};
  animation-duration: 2600ms;
`;
const rotate = keyframes`
  0%,100%{ transform:rotate(-3deg); }
  50%{ transform:rotate(3deg); }
`;
export const RotateWrapper = styled(motion.div)`
  position: relative;
  animation: cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite both;
  animation-name: ${rotate};
  animation-duration: 2200ms;
`;
export const Logo = styled(motion.div)`
  position:absolute;
  inset:0;

  animation: ${logoIn} 750ms cubic-bezier(0.19, 1, 0.22, 1) both;
  &:nth-child(1){ z-index:2; animation-delay:0ms;  }
  &:nth-child(2){ z-index:1; animation-delay:60ms; }
  &:nth-child(3){ z-index:1; animation-delay:30ms; }
  &:nth-child(4){ z-index:1; animation-delay:90ms; }
  &:nth-child(5){ z-index:1; animation-delay:120ms;}

  &:nth-child(1){ ${RotateWrapper}{ animation-delay:0ms; } }
  &:nth-child(2){ ${RotateWrapper}{ animation-delay:-600ms; } }
  &:nth-child(3){ ${RotateWrapper}{ animation-delay:-1200ms; } }
  &:nth-child(4){ ${RotateWrapper}{ animation-delay:-1800ms; } }
  &:nth-child(5){ ${RotateWrapper}{ animation-delay:-2400ms; } }

  &:nth-child(1){ ${FloatWrapper}{ animation-delay:-200ms; } }
  &:nth-child(2){ ${FloatWrapper}{ animation-delay:-600ms; } }
  &:nth-child(3){ ${FloatWrapper}{ animation-delay:-800ms; } }
  &:nth-child(4){ ${FloatWrapper}{ animation-delay:-300ms; } }
  &:nth-child(5){ ${FloatWrapper}{ animation-delay:-3200ms; } }
  

  &:nth-child(1) ${LogoPosition}{
    border-radius: 17.2px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    ${LogoGraphic}{
      width: 72px;
      height: 72px;
      //transform: rotate(4.28deg);
    }
  }
  &:nth-child(2) ${LogoPosition}{
    top: 21.5%;
    left: 21%;
    transform: translate(-50%, -50%) ;
    ${LogoGraphic}{
      //transform: rotate(-4.6deg);
    }
  }
  &:nth-child(3) ${LogoPosition}{
    top: 14%;
    right: 2%;
    transform: translate(-50%, -50%);
    ${LogoGraphic}{
      //transform: rotate(3.9deg);
    }
  }
  &:nth-child(4) ${LogoPosition}{
    top: 76%;
    left: 22.5%;
    transform: translate(-50%, -50%);
    ${LogoGraphic}{
      //transform: rotate(4.82deg);
    }
  }
  &:nth-child(5) ${LogoPosition}{
    top: 79%;
    right: 3%;
    transform: translate(-50%, -50%);
    ${LogoGraphic}{
      //transform: rotate(-7.51deg);
    }
  }
}`;
