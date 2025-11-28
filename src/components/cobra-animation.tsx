'use client';

import React from 'react';

export const CobraAnimation = () => {
  return (
    <>
      <style>
        {`
          @keyframes sway {
            0% {
              transform: rotate(-5deg) translateX(-5px);
            }
            50% {
              transform: rotate(5deg) translateX(5px);
            }
            100% {
              transform: rotate(-5deg) translateX(-5px);
            }
          }
          .cobra-svg {
            animation: sway 5s ease-in-out infinite;
            filter: drop-shadow(0 0 15px hsl(var(--primary)));
          }
        `}
      </style>
      <svg
        className="cobra-svg"
        width="150"
        height="150"
        viewBox="0 0 24 24"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11.69 11.15c-1.36.33-2.45.89-3.18 1.59" />
        <path d="M11.53 14.85c-.93.93-1.4 2.2-1.4 3.65" />
        <path d="m9.32 5.09.04-.03c1.4-1.29 3.14-2.06 5.14-2.06 3.49 0 6.5 2.5 6.5 6.5s-2.5 7.5-6.5 7.5" />
        <path d="M12.31 11.15c1.36.33 2.45.89 3.18 1.59" />
        <path d="M12.47 14.85c.93.93 1.4 2.2 1.4 3.65" />
        <path d="m14.68 5.09-.04-.03c-1.4-1.29-3.14-2.06-5.14-2.06-3.49 0-6.5 2.5-6.5 6.5s2.5 7.5 6.5 7.5" />
        <path d="M5.5 13.5c0 1.93 1.57 3.5 3.5 3.5h0c1.93 0 3.5-1.57 3.5-3.5v-4C12.5 7.57 10.93 6 9 6h0C7.07 6 5.5 7.57 5.5 9.5v4Z" />
        <path d="M12.5 13.5c0 1.93 1.57 3.5 3.5 3.5h0c1.93 0 3.5-1.57 3.5-3.5v-4c0-1.93-1.57-3.5-3.5-3.5h0c-1.93 0-3.5 1.57-3.5 3.5v4Z" />
        <path d="M8 11.5c-.83 0-1.5-.67-1.5-1.5S7.17 8.5 8 8.5h0" />
        <path d="M16 11.5c.83 0 1.5-.67 1.5-1.5S16.83 8.5 16 8.5h0" />
      </svg>
    </>
  );
};
