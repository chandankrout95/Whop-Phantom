'use client';
import React, { useEffect, useState } from 'react';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/?;:"}{[]|\\!@#$%^&*()_+-=';

const RainStream: React.FC<{ left: number }> = ({ left }) => {
  const [chars, setChars] = useState<string[]>([]);
  const topPosition = -Math.random() * 500;
  const animationDuration = 5 + Math.random() * 5;
  const animationDelay = Math.random() * 5;

  useEffect(() => {
    const streamLength = Math.floor(10 + Math.random() * 20);
    const newChars = Array.from({ length: streamLength }).map(() => characters[Math.floor(Math.random() * characters.length)]);
    setChars(newChars);
  }, []);

  return (
    <div
      className="pointer-events-none absolute text-primary"
      style={{
        left: `${left}px`,
        top: `${topPosition}px`,
        writingMode: 'vertical-rl',
        textOrientation: 'upright',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        animation: `fall ${animationDuration}s linear ${animationDelay}s infinite`,
      }}
    >
      {chars.map((char, index) => (
        <span
          key={index}
          style={{
            opacity: 1 - index / chars.length,
            animation: `glow 1.5s ease-in-out ${Math.random() * 2}s infinite alternate`,
            textShadow: index === chars.length - 1 ? '0 0 10px hsl(var(--primary))' : 'none',
            color: index === chars.length -1 ? 'hsl(var(--foreground))' : 'hsl(var(--primary))'
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};


export const HackerBackground = () => {
    const [streams, setStreams] = useState<number[]>([]);
  
    useEffect(() => {
      const createStreams = () => {
        const streamCount = Math.floor(window.innerWidth / 20);
        const newStreams = Array.from({ length: streamCount }).map((_, i) => i * 20);
        setStreams(newStreams);
      };
  
      createStreams();
      window.addEventListener('resize', createStreams);
      return () => window.removeEventListener('resize', createStreams);
    }, []);
  
    return (
      <>
        <style>
          {`
            @keyframes fall {
              to {
                transform: translateY(100vh);
              }
            }
            @keyframes glow {
              from {
                opacity: 0.1;
              }
              to {
                opacity: 1;
              }
            }
          `}
        </style>
        <div className="fixed inset-0 z-0 h-full w-full bg-black">
          {streams.map((left) => (
            <RainStream key={left} left={left} />
          ))}
        </div>
      </>
    );
  };
