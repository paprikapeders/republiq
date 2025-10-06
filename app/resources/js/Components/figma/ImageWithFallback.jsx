import React, { useState } from 'react';

export function ImageWithFallback({ src, alt, className, fallbackSrc, ...props }) {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            if (fallbackSrc) {
                setImgSrc(fallbackSrc);
            } else {
                // Create a placeholder div if no fallback is provided
                setImgSrc(null);
            }
        }
    };

    if (!imgSrc) {
        return (
            <div 
                className={`${className} bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center`}
                {...props}
            >
                <div className="text-gray-400 text-center">
                    <div className="text-2xl mb-2">📷</div>
                    <div className="text-xs">{alt || 'Image'}</div>
                </div>
            </div>
        );
    }

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
            {...props}
        />
    );
}