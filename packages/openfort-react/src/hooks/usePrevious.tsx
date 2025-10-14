import { useRef, useEffect } from 'react';

export default function usePrevious(value: any, initial?: any) {
  const ref = useRef({ target: value, previous: initial });

  if (ref.current.target !== value) {
    // The value changed.
    ref.current.previous = ref.current.target;
    ref.current.target = value;
  }

  return ref.current.previous;
}
