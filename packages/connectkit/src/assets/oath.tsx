import type { SVGProps } from 'react';

const Oath = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 1024 1024"
  >
    <title>Oath — Signal Blue</title>
    <defs>
      <clipPath id="connectkit-oath-ct">
        <rect width="1024" height="512"></rect>
      </clipPath>
      <clipPath id="connectkit-oath-cb">
        <rect y="512" width="1024" height="512"></rect>
      </clipPath>
      <mask
        id="connectkit-oath-m0"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="1024"
        height="1024"
      >
        <circle
          cx="372"
          cy="512"
          r="230"
          fill="none"
          stroke="#fff"
          strokeWidth="120"
        ></circle>
        <circle
          cx="652"
          cy="512"
          r="230"
          fill="none"
          stroke="#000"
          strokeWidth="164"
          clipPath="url(#connectkit-oath-cb)"
        ></circle>
      </mask>
      <mask
        id="connectkit-oath-m1"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="1024"
        height="1024"
      >
        <circle
          cx="652"
          cy="512"
          r="230"
          fill="none"
          stroke="#fff"
          strokeWidth="120"
        ></circle>
        <circle
          cx="372"
          cy="512"
          r="230"
          fill="none"
          stroke="#000"
          strokeWidth="164"
          clipPath="url(#connectkit-oath-ct)"
        ></circle>
      </mask>
      <linearGradient id="connectkit-oath-bg" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#247BFF" />
        <stop offset="1" stopColor="#183ED4" />
      </linearGradient>
    </defs>
    <rect width="1024" height="1024" rx="256" fill="url(#connectkit-oath-bg)" />
    <g transform="translate(138 260) scale(.86976744186) translate(-82 -222)">
      <g mask="url(#connectkit-oath-m0)">
        <rect width="1024" height="1024" fill="#FFFFFF" />
      </g>
      <g mask="url(#connectkit-oath-m1)">
        <rect width="1024" height="1024" fill="#FFFFFF" />
      </g>
    </g>
  </svg>
);

export default Oath;
