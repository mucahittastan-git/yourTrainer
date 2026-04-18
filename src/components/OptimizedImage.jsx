import React, { useState, useEffect } from 'react';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  lazy = true,
  placeholder = null,
  onLoad = () => {},
  onError = () => {},
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState();
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let observer;

    if (lazy && imageRef && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setInView(true);
              observer.unobserve(imageRef);
            }
          });
        },
        {
          rootMargin: '50px'
        }
      );

      observer.observe(imageRef);
    } else if (!lazy) {
      setInView(true);
    }

    return () => {
      if (observer && observer.unobserve && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, lazy]);

  useEffect(() => {
    if (inView && src) {
      const imageLoader = new Image();

      imageLoader.onload = () => {
        setImageSrc(src);
        setLoaded(true);
        onLoad();
      };

      imageLoader.onerror = () => {
        setError(true);
        onError();
      };

      imageLoader.src = src;
    }
  }, [inView, src, onLoad, onError]);

  const renderImage = () => {
    if (error) {
      return (
        <div
          className={`flex items-center justify-center bg-gray-200 text-gray-400 ${className}`}
          style={{ width, height }}
          {...props}
        >
          <span className="text-sm">Resim yüklenemedi</span>
        </div>
      );
    }

    if (!inView || (!loaded && lazy)) {
      return (
        <div
          ref={setImageRef}
          className={`bg-gray-200 animate-pulse ${className}`}
          style={{ width, height }}
          {...props}
        >
          {placeholder && (
            <img
              src={placeholder}
              alt={alt}
              className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-0' : 'opacity-100'}`}
            />
          )}
        </div>
      );
    }

    return (
      <img
        ref={setImageRef}
        src={imageSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        width={width}
        height={height}
        loading={lazy ? 'lazy' : 'eager'}
        {...props}
      />
    );
  };

  return renderImage();
};

export default OptimizedImage;
