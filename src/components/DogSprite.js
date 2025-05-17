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
        width="90"
        height="90"
        viewBox="0 0 90 90"
        fill="none"
      >
        {/* Body */}
        <ellipse cx="45" cy="60" rx="28" ry="18" fill="#B8865B" />
        {/* Head */}
        <ellipse cx="45" cy="38" rx="20" ry="18" fill="#D2A679" />
        {/* Ears */}
        <ellipse cx="25" cy="28" rx="8" ry="16" fill="#8B5C2A" />
        <ellipse cx="65" cy="28" rx="8" ry="16" fill="#8B5C2A" />
        {/* Eyes */}
        <ellipse cx="38" cy="38" rx="3" ry="4" fill="#fff" />
        <ellipse cx="52" cy="38" rx="3" ry="4" fill="#fff" />
        <ellipse cx="38" cy="39" rx="1.2" ry="2" fill="#222" />
        <ellipse cx="52" cy="39" rx="1.2" ry="2" fill="#222" />
        {/* Snout */}
        <ellipse cx="45" cy="48" rx="7" ry="5" fill="#fff" />
        {/* Nose */}
        <ellipse cx="45" cy="50" rx="2" ry="1.5" fill="#222" />
        {/* Mouth */}
        <path d="M43 53 Q45 55 47 53" stroke="#222" strokeWidth="1.2" fill="none" />
        {/* Tail */}
        <path d="M20 70 Q10 65 18 60" stroke="#8B5C2A" strokeWidth="3" fill="none" />
        {/* Legs */}
        <ellipse cx="33" cy="78" rx="4" ry="7" fill="#D2A679" />
        <ellipse cx="57" cy="78" rx="4" ry="7" fill="#D2A679" />
      </svg>
    </div>
  );
}
