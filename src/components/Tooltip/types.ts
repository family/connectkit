export type TooltipSizeProps = 'small' | 'large';

export type TooltipProps = {
  message?: string | React.ReactNode;
  children?: React.ReactNode;
  open?: boolean;
  xOffset?: number;
  yOffset?: number;
  delay?: number;
};
