import React from "react";

export default function FrogSprite({ x = 0, y = 0, angle = 0 }) {
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
        width="95"
        height="75"
        viewBox="0 0 95 75"
        fill="none"
        stroke="#004d00"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Body */}
        <ellipse cx="47.5" cy="50" rx="40" ry="25" fill="#4CAF50" />
        {/* Head with eyes */}
        <circle cx="32" cy="30" r="18" fill="#66BB6A" />
        <circle cx="62" cy="30" r="18" fill="#66BB6A" />
        {/* Eye pupils */}
        <circle cx="27" cy="27" r="6" fill="#000" />
        <circle cx="67" cy="27" r="6" fill="#000" />
        {/* Mouth */}
        <path d="M30 45 Q47.5 60 65 45" stroke="#2e7d32" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Legs */}
        <path d="M15 65 Q10 70 15 75" stroke="#2e7d32" strokeWidth="4" fill="none" />
        <path d="M80 65 Q85 70 80 75" stroke="#2e7d32" strokeWidth="4" fill="none" />
      </svg>
    </div>
  );
}
