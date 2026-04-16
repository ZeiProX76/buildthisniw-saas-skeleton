import React from 'react';

const ComponentPlaceholderIcon = ({
    size = undefined,
    color = '#000000',
    strokeWidth = 2,
    background = 'transparent',
    opacity = 1,
    rotation = 0,
    shadow = 0,
    flipHorizontal = false,
    flipVertical = false,
    padding = 0
}) => {
    const transforms = [];
    if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
    if (flipHorizontal) transforms.push('scaleX(-1)');
    if (flipVertical) transforms.push('scaleY(-1)');

    const viewBoxSize = 24 + (padding * 2);
    const viewBoxOffset = -padding;
    const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={viewBox}
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                opacity,
                transform: transforms.join(' ') || undefined,
                filter: shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
                backgroundColor: background !== 'transparent' ? background : undefined
            }}
        >
            <path fill="currentColor" d="M7.225 12.74a.5.5 0 1 1 .55.835a.5.5 0 0 1-.55-.835m-1.493-1.351a.5.5 0 1 1 .707.708a.5.5 0 0 1-.707-.708m2.829 0a.5.5 0 1 1 .707.707a.5.5 0 0 1-.707-.707M4.318 9.975a.5.5 0 1 1 .707.707a.5.5 0 0 1-.707-.707m5.657 0a.5.5 0 1 1 .707.707a.5.5 0 0 1-.707-.707M2.904 8.56a.5.5 0 1 1 .707.707a.5.5 0 0 1-.707-.707m8.485 0a.5.5 0 1 1 .707.707a.5.5 0 0 1-.707-.707m-9.9-1.414a.506.506 0 0 1 .772.078a.5.5 0 1 1-.771-.078m11.314 0a.5.5 0 1 1 .707.707a.5.5 0 0 1-.707-.707m-9.9-1.415a.5.5 0 1 1 .708.708a.5.5 0 0 1-.707-.708m8.486 0a.5.5 0 1 1 .707.708a.5.5 0 0 1-.707-.708M4.318 4.318a.5.5 0 1 1 .707.708a.5.5 0 0 1-.707-.708m5.657 0a.5.5 0 1 1 .707.707a.5.5 0 0 1-.707-.707M5.732 2.904a.5.5 0 1 1 .707.707a.5.5 0 0 1-.707-.707m2.829 0a.5.5 0 1 1 .707.707a.5.5 0 0 1-.707-.707M7.147 1.489a.5.5 0 1 1 .707.708a.5.5 0 0 1-.707-.708" />
        </svg>
    );
};

export default ComponentPlaceholderIcon;