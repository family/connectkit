import { useState, useEffect } from 'react';
import { isMobile } from '../utils';

export default function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    function handleResize() {
      setMobile(isMobile());
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return mobile;
}
