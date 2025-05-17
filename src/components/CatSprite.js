import React from "react";


export default function CatSprite({ x = 0, y = 0, angle = 0 }) {
  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(${x}px, ${y}px) rotate(${angle}deg)`,
        transformOrigin: "center",
        transition: "transform 0.3s ease",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="65"
        viewBox="0 0 60 65"
        fill="none"
      >
        {/* Tail */}
        <path
          d="M10 50 Q2 55 12 60"
          stroke="#F4A460"
          strokeWidth="3"
          fill="none"
        />
        {/* Body */}
        <ellipse cx="30" cy="45" rx="18" ry="15" fill="#F4A460" />
        {/* Head */}
        <ellipse cx="30" cy="25" rx="13" ry="12" fill="#FFD39B" />
        {/* Left Ear */}
        <polygon points="17,18 23,8 25,20" fill="#FFD39B" />
        {/* Right Ear */}
        <polygon points="43,18 37,8 35,20" fill="#FFD39B" />
        {/* Eyes */}
        <ellipse cx="25" cy="25" rx="2" ry="3" fill="#222" />
        <ellipse cx="35" cy="25" rx="2" ry="3" fill="#222" />
        {/* Nose */}
        <ellipse cx="30" cy="30" rx="1.2" ry="1" fill="#E57373" />
        {/* Mouth */}
        <path
          d="M29 32 Q30 34 31 32"
          stroke="#222"
          strokeWidth="1"
          fill="none"
        />
        {/* Whiskers */}
        <path d="M20 30 Q15 31 20 32" stroke="#222" strokeWidth="1" />
        <path d="M40 30 Q45 31 40 32" stroke="#222" strokeWidth="1" />
        {/* Legs */}
        <ellipse cx="22" cy="58" rx="3" ry="5" fill="#FFD39B" />
        <ellipse cx="38" cy="58" rx="3" ry="5" fill="#FFD39B" />
      </svg>
    </div>
  );
}
