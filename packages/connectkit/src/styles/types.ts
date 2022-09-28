type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type Color = RGB | RGBA | HEX;

type BorderRadius = number | string;
type Font = {
  family?: string;
};

interface Button {
  font?: Font;
  color?: Color;
  background?: Color;
  border?: Color;
  borderRadius?: BorderRadius;
  hover?: this;
}

interface Text {
  color?: Color;
  font?: Font;
  hover?: this;
}

export type Theme = {
  font?: Font;
  primary?: {
    color?: Color;
    colorSelected?: Color;
  };
  error?: {
    color?: Color;
  };
  text?: {
    primary?: Text;
    secondary?: Text;
    error?: Color;
    valid?: Color;
  };
  navigation?: {
    color?: Color;
  };
  buttons?: {
    primary?: Button;
    secondary?: Button;
  };
  modal?: {
    divider: Color;
    background?: Color;
    boxShadow?: string;
    borderRadius?: BorderRadius;
  };
  overlay?: {
    background?: Color;
    backdropFilter?: string;
  };
  tooltips?: {
    color?: Color;
    background?: Color;
    hover?: {
      color?: Color;
      background?: Color;
    };
  };
  qrCode?: {
    background?: Color;
    accentColor?: Color;
  };
};

export type ThemeMode = {
  preferred: 'light' | 'dark';
  light: Theme;
  dark: Theme;
};
export type CustomTheme = {
  connectKit: {
    options?: {
      iconStyle?: 'light' | 'regular' | 'heavy';
    };
    theme?: Theme | ThemeMode;
  };
};
