import React, { useEffect, useRef, useState } from 'react';

const LazyImage: React.FC<{
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}> = ({ src, alt, width, height }) => {
  const imageRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    if (
      !(
        imageRef.current &&
        imageRef.current.complete &&
        imageRef.current.naturalHeight !== 0
      )
    ) {
      setLoaded(false);
    }
  }, [src]);

  return (
    <div
      style={{
        width,
        height,
        background: 'rgba(0,0,0,0.02)',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)',
      }}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setLoaded(true)}
        style={{ transition: 'opacity 0.2s ease', opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
};

export default LazyImage;
