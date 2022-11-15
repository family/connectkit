import React from 'react';
import useFitText from '../../../hooks/useFitText';

const FitText = React.forwardRef(
  (
    { children }: { children: React.ReactNode },
    ref: React.Ref<HTMLElement>
  ) => {
    const { fontSize, ref: textRef } = useFitText({
      maxFontSize: 100,
      minFontSize: 70,
    });
    return (
      <div
        ref={textRef}
        style={{
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
