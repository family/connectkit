// Based on https://hiddedevries.nl/en/blog/2017-01-29-using-javascript-to-trap-focus-in-an-element

import React, { useRef, useEffect } from 'react';

const KEYCODE_TAB = 9;

function useFocusTrap() {
  const elRef = useRef<any>(null);

  function handleFocus(e: any) {
    if (!elRef.current) return;
    var focusableEls = elRef.current.querySelectorAll(`
        a[href]:not(:disabled),
        button:not(:disabled),
        textarea:not(:disabled),
        input[type="text"]:not(:disabled),
        input[type="radio"]:not(:disabled),
        input[type="checkbox"]:not(:disabled),
        select:not(:disabled)
      `),
      firstFocusableEl = focusableEls[0],
      lastFocusableEl = focusableEls[focusableEls.length - 1];

    var isTabPressed = e.key === 'Tab' || e.keyCode === KEYCODE_TAB;

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) {
      /* shift + tab */ if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        e.preventDefault();
      }
    } /* tab */ else {
      if (document.activeElement === lastFocusableEl) {
        firstFocusableEl.focus();
        e.preventDefault();
      }
    }
  }

  useEffect(() => {
    if (elRef.current) {
      elRef.current.addEventListener('keydown', handleFocus);
      elRef.current.focus({ preventScroll: true });
    }
    return () => {
      if (elRef.current) {
        elRef.current.removeEventListener('keydown', handleFocus);
      }
    };
  }, []);

  return elRef;
}

export default function FocusTrap(props: any) {
  const elRef = useFocusTrap();

  useEffect(() => {
    if (!elRef.current) return;
    elRef.current.focus({ preventScroll: true });
  }, []);

  return (
    <div ref={elRef} tabIndex={0}>
      {props.children}
    </div>
  );
}
