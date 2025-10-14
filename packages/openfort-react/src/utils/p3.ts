import { css } from 'styled-components';

export const hexToP3 = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result == null) return hex;
  const values = {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
  return `color(display-p3 ${values.r / 255} ${values.g / 255} ${
    values.b / 255
  })`;
};

export const p3Hex = (hex: string, property: string) => {
  const isSafari = true;
  const p3 = hexToP3(hex);
  if (!p3 || !isSafari) {
    return css`
      ${property}: ${hex};
    `;
  } else {
    return css`
      ${property}: ${hex};
      ${property}: ${p3};
    `;
  }
};
