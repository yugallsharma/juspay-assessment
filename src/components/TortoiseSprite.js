import React from "react";

export default function TortoiseSprite({ x = 0, y = 0, angle = 0 }) {
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
        width="100"
        height="80"
        viewBox="0 0 100 80"
        fill="none"
        stroke="#2f4f4f"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Shell */}
        <ellipse cx="50" cy="45" rx="45" ry="30" fill="#8FBC8F" />
        {/* Shell pattern */}
        <path d="M20 40 L40 30 L60 30 L80 40" stroke="#556B2F" strokeWidth="2" fill="none" />
        <path d="M25 55 L50 40 L75 55" stroke="#556B2F" strokeWidth="2" fill="none" />
        {/* Head */}
        <circle cx="50" cy="15" r="15" fill="#6B8E23" />
        {/* Eyes */}
        <circle cx="43" cy="12" r="5" fill="#000" />
        <circle cx="57" cy="12" r="5" fill="#000" />
        {/* Legs */}
        <circle cx="20" cy="70" r="10" fill="#556B2F" />
        <circle cx="80" cy="70" r="10" fill="#556B2F" />
      </svg>
    </div>
  );
}
