import { keyframes } from 'styled-components';
import styled from './../../../styles/styled';
import { motion } from 'framer-motion';
import defaultTheme from '../../../constants/defaultTheme';

export const Graphic = styled(motion.div)`
  position: relative;
  margin: 16px auto 20px;
  height: 190px;
  max-width: 295px;
  pointer-events: none;
  user-select: none;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    height: 200px;
    max-width: 100%;
    margin-bottom: 32px;
  }
`;
export const LogoGroup = styled(motion.div)`
  position: absolute;
  inset: 0;
  z-index: 2;
`;
const graphicIn = keyframes`
  0%{
    opacity:0;
    transform:scale(0.9);
  }
  100%{
    opacity:1;
    transform:none;
  }
`;
export const GraphicBackground = styled(motion.div)`
  z-index: 1;
  position: absolute;
  inset: 0;
  top: -2px;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--ck-body-background);
    background: radial-gradient(
      closest-side,
      var(--ck-body-background-transparent, transparent) 18.75%,
      var(--ck-body-background) 100%
    );
    background-size: 100%;
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
  animation: ${graphicIn} 1000ms 100ms ease both;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    animation: none;
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
  inset: 0;
  animation: cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite both;
  animation-delay: inherit;
`;
export const LogoInner = styled(motion.div)`
  position: absolute;
`;
export const LogoGraphic = styled(motion.div)`
  position: relative;
  overflow: hidden;
  height: 58px;
  width: 58px;
  border-radius: 13.84px;
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
  animation-duration: 3600ms;
`;
const rotate = keyframes`
  0%,100%{ transform:rotate(-3deg); }
  50%{ transform:rotate(3deg); }
`;
export const RotateWrapper = styled(motion.div)`
  position: relative;
  animation: cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite both;
  animation-name: ${rotate};
  animation-duration: 3200ms;
`;
export const Logo = styled(motion.div)`
  position: absolute;
  inset: 0;

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

  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    animation: none !important;
    ${RotateWrapper},${FloatWrapper} {
      animation: none !important;
    }
  }

  ${LogoInner} {
    transform: translate(-50%, -50%);
  }

  &:nth-child(1) ${LogoPosition} {
    transform: translate(50%, 50%);
    ${LogoGraphic} {
      border-radius: 17.2px;
      width: 72px;
      height: 72px;
    }
  }
  &:nth-child(2) ${LogoPosition} {
    transform: translate(21%, 21.5%);
  }
  &:nth-child(3) ${LogoPosition} {
    transform: translate(78%, 14%);
  }
  &:nth-child(4) ${LogoPosition} {
    transform: translate(22.5%, 76%);
  }
  &:nth-child(5) ${LogoPosition} {
    transform: translate(76%, 80%);
  }
`;
