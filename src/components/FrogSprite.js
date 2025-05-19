import React from "react";

export default function FrogSprite(props) {
  const { x = 0, y = 0, angle = 0 } = props;
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
        height="70"
        viewBox="0 0 90 70"
        fill="none"
      >
        {/* Back legs */}
        <ellipse cx="18" cy="62" rx="8" ry="4" fill="#388e3c" />
        <ellipse cx="72" cy="62" rx="8" ry="4" fill="#388e3c" />
        {/* Body */}
        <ellipse cx="45" cy="45" rx="28" ry="18" fill="#4CAF50" />
        {/* Front legs */}
        <ellipse cx="28" cy="60" rx="5" ry="2.5" fill="#43a047" />
        <ellipse cx="62" cy="60" rx="5" ry="2.5" fill="#43a047" />
        {/* Head */}
        <ellipse cx="45" cy="28" rx="18" ry="14" fill="#66BB6A" />
        {/* Eyes */}
        <ellipse
          cx="34"
          cy="18"
          rx="6"
          ry="6"
          fill="#fff"
          stroke="#388e3c"
          strokeWidth="1.2"
        />
        <ellipse
          cx="56"
          cy="18"
          rx="6"
          ry="6"
          fill="#fff"
          stroke="#388e3c"
          strokeWidth="1.2"
        />
        {/* Pupils */}
        <ellipse cx="34" cy="19" rx="2" ry="3" fill="#222" />
        <ellipse cx="56" cy="19" rx="2" ry="3" fill="#222" />
        {/* Smile */}
        <path
          d="M38 32 Q45 38 52 32"
          stroke="#222"
          strokeWidth="2"
          fill="none"
        />
        {/* Nostrils */}
        <ellipse cx="41" cy="26" rx="1" ry="0.7" fill="#222" />
        <ellipse cx="49" cy="26" rx="1" ry="0.7" fill="#222" />
      </svg>
    </div>
  );
}
