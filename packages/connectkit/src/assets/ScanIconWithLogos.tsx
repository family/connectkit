import React from 'react';
import { motion } from 'framer-motion';
import styled from './../styles/styled';
import Logos from './logos';

const IconContainer = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 47px;
  height: 52px;
  min-width: 47px;
  min-height: 52px;
  svg {
    display: block;
    max-width: 100%;
    height: auto;
  }
`;

const ScanIconWithLogos: React.FC<{ logo?: React.ReactNode }> = ({ logo }) => {
  const logoList = [
    <Logos.MetaMask background={true} />,
    <Logos.Coinbase background={true} />,
    <Logos.Crypto />,
    <Logos.ImToken />,
    <Logos.Argent />,
    <Logos.Trust />,
  ];
  return (
    <IconContainer>
      <svg
        aria-hidden="true"
        width="47"
        height="52"
        viewBox="0 0 47 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g mask="url(#gradient-mask)">
          <path
            d="M7 14.5C7 11.4624 9.46243 9 12.5 9H31.5C34.5376 9 37 11.4624 37 14.5V47H7V14.5Z"
            fill="var(--ck-graphic-scaniconwithlogos-04)"
          />
          {logo ? (
            <foreignObject x="13" y="21" width="18" height="18" rx="5">
              <div style={{ overflow: 'hidden', borderRadius: 5 }}>{logo}</div>
            </foreignObject>
          ) : (
            <>
              <foreignObject x="12" y="15" width="9" height="9" rx="2.5">
                <div style={{ overflow: 'hidden', borderRadius: 2.5 }}>
                  {logoList[0]}
                </div>
              </foreignObject>
              <foreignObject x="23" y="15" width="9" height="9" rx="2.5">
                <div style={{ overflow: 'hidden', borderRadius: 2.5 }}>
                  {logoList[1]}
                </div>
              </foreignObject>
              <foreignObject x="12" y="26" width="9" height="9" rx="2.5">
                <div style={{ overflow: 'hidden', borderRadius: 2.5 }}>
                  <div style={{ overflow: 'hidden', borderRadius: 2.5 }}>
                    {logoList[2]}
                  </div>
                </div>
              </foreignObject>
              <foreignObject x="23" y="26" width="9" height="9" rx="2.5">
                <div style={{ overflow: 'hidden', borderRadius: 2.5 }}>
                  {logoList[3]}
                </div>
              </foreignObject>
              <foreignObject x="12" y="37" width="9" height="9" rx="2.5">
                <div style={{ overflow: 'hidden', borderRadius: 2.5 }}>
                  {logoList[4]}
                </div>
              </foreignObject>
              <foreignObject x="23" y="37" width="9" height="9" rx="2.5">
                <div style={{ overflow: 'hidden', borderRadius: 2.5 }}>
                  {logoList[5]}
                </div>
              </foreignObject>
            </>
          )}
          <path
            d="M36 47V13.7143C36 11.1107 33.8893 9 31.2857 9H12.7143C10.1107 9 8 11.1107 8 13.7143V47"
            stroke="url(#paint0_linear_924_12568)"
            strokeWidth="2"
          />
          <path
            d="M15 10H29C29 11.1046 28.1046 12 27 12H17C15.8954 12 15 11.1046 15 10Z"
            fill="var(--ck-graphic-scaniconwithlogos-01)"
          />
          <rect
            x="1"
            y="47"
            width="43"
            height="5"
            fill="var(--ck-tooltip-background)"
          />
          <rect
            x="22"
            y="1"
            width="24"
            height="24"
            rx="12"
            fill="var(--ck-graphic-scaniconwithlogos-03)"
            stroke="var(--ck-tooltip-background)"
            strokeWidth="2"
          />
          <rect
            x="34.5"
            y="10"
            width="2.5"
            height="2.5"
            rx="0.75"
            fill="#373737"
          />
          <rect
            x="31"
            y="10"
            width="2.5"
            height="2.5"
            rx="0.75"
            fill="#373737"
          />
          <rect
            x="31"
            y="13.5"
            width="2.5"
            height="2.5"
            rx="0.75"
            fill="#373737"
          />
          <rect
            x="34.5"
            y="13.5"
            width="2.5"
            height="2.5"
            rx="0.75"
            fill="#373737"
          />
          <path
            d="M28.5 10.5V9C28.5 8.17157 29.1716 7.5 30 7.5H31.5"
            stroke="#373737"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M36.5 7.5L38 7.5C38.8284 7.5 39.5 8.17157 39.5 9L39.5 10.5"
            stroke="#373737"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M39.5 15.5L39.5 17C39.5 17.8284 38.8284 18.5 38 18.5L36.5 18.5"
            stroke="#373737"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M31.5 18.5L30 18.5C29.1716 18.5 28.5 17.8284 28.5 17L28.5 15.5"
            stroke="#373737"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_924_12568"
            x1="22"
            y1="8.2549"
            x2="22"
            y2="47"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--ck-graphic-scaniconwithlogos-01)" />
            <stop
              offset="1"
              stopColor="var(--ck-graphic-scaniconwithlogos-02)"
            />
          </linearGradient>

          <linearGradient
            id="linear-gradient-mask"
            x1="47"
            y1="42"
            x2="47"
            y2="47"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="black" stopOpacity="0" />
          </linearGradient>

          <mask id="gradient-mask">
            <rect
              x="0"
              y="0"
              width="47"
              height="52"
              fill="url(#linear-gradient-mask)"
            />
          </mask>
        </defs>
      </svg>
    </IconContainer>
  );
};
export default ScanIconWithLogos;
