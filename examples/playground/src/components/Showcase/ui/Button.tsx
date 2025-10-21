import { MButton, MDiv } from '@/components/motion/motion';
import { cn } from '@/lib/cn';
import { flattenChildren } from '@/lib/flattenChildren';
import { AnimatePresence } from 'framer-motion';

const transition = {
  duration: 0.4,
  ease: [0.175, 0.885, 0.32, 0.98],
} as const;

type ButtonProps = {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onPointerDown?: (e: React.PointerEvent<HTMLButtonElement>) => void;
};

export const Button = ({
  className,
  children,
  disabled,
  type,
  onClick,
  ...props
}: ButtonProps) => {
  const key =
    typeof children === 'string'
      ? children
      : flattenChildren(children).join(''); // Need to generate a string for the key so we can automatically animate between content

  return (
    <MButton
      {...props}
      onClick={(event) => {
        if (!disabled && onClick) onClick(event);
      }}
      disabled={disabled}

      animate={{ scale: 1 }}
      whileTap={{ scale: 0.95 }}

      type={type}
      className={cn(
        className,
      )}
    >
      <AnimatePresence initial={false}>
        <MDiv
          key={key}
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: 1,
            y: -1,
          }}
          exit={{
            position: 'absolute',
            opacity: 0,
            y: 10,
            transition: {
              ...transition,
            },
          }}
          transition={{
            ...transition,
            delay: 0.2,
          }}
          className="flex items-center justify-center"
        >
          {children}
        </MDiv>
      </AnimatePresence>
    </MButton>
  )
}