import React from "react";

export default function DogSprite({ x = 0, y = 0, angle = 0 }) {
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
        height="100"
        viewBox="0 0 95 100"
        fill="none"
        stroke="#001026"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Body */}
        <ellipse cx="47.5" cy="70" rx="35" ry="20" fill="#A0522D" stroke="#5A2D0C" strokeWidth="2"/>
        {/* Head */}
        <circle cx="47.5" cy="40" r="25" fill="#D2691E" />
        {/* Eyes */}
        <circle cx="35" cy="35" r="6" fill="#FFF" />
        <circle cx="60" cy="35" r="6" fill="#FFF" />
        <circle cx="35" cy="35" r="3" fill="#000" />
        <circle cx="60" cy="35" r="3" fill="#000" />
        {/* Nose */}
        <path d="M42 48 L53 48 L47.5 55 Z" fill="#4B2E0D" />
        {/* Ears */}
        <path d="M20 15 Q30 5 38 22" fill="#8B4513" />
        <path d="M75 15 Q65 5 57 22" fill="#8B4513" />
        {/* Tail */}
        <path d="M15 80 Q5 70 15 60" stroke="#5A2D0C" strokeWidth="3" fill="none" />
      </svg>
    </div>
  );
}
