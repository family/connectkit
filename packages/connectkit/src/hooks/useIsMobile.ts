import { useState, useEffect } from 'react';
import { isMobile } from '../utils';

export default function useIsMobile() {
  const [mobile, setMobile] = useState(isMobile());

  useEffect(() => {
    const handleResize = () => {
      setMobile(isMobile());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return mobile;
}
