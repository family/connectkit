import React from 'react';
import useFitText from '../../../hooks/useFitText';

const FitText = React.forwardRef(
  (
    { children }: { children: React.ReactNode },
    ref: React.Ref<HTMLElement>
  ) => {
    const [ready, setReady] = React.useState(false);
    const { fontSize, ref: textRef } = useFitText({
      logLevel: 'none',
      maxFontSize: 100,
      minFontSize: 70,
      onStart: () => setReady(true),
      onFinish: () => setReady(true),
    });
    return (
      <div
        ref={textRef}
        style={{
          visibility: ready ? 'visible' : 'hidden', // avoid flash of unstyled text
          fontSize: `${fontSize}%`,
          maxHeight: '100%',
          maxWidth: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          //lineHeight: `${21 * (fontSize / 100)}px`,
          //background: fontSize !== '100%' ? 'red' : undefined, // debug
        }}
      >
        {children}
      </div>
    );
  }
);
FitText.displayName = 'FitText';

export default FitText;
