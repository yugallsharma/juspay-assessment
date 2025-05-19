import React from "react";

export default function TortoiseSprite(props) {
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
        width="100"
        height="70"
        viewBox="0 0 100 70"
        fill="none"
      >
        {/* Shell */}
        <ellipse
          cx="50"
          cy="40"
          rx="35"
          ry="22"
          fill="#8FBC8F"
          stroke="#556B2F"
          strokeWidth="2"
        />
        {/* Shell pattern */}
        <ellipse
          cx="50"
          cy="40"
          rx="25"
          ry="14"
          fill="none"
          stroke="#6B8E23"
          strokeWidth="2"
        />
        <ellipse
          cx="50"
          cy="40"
          rx="15"
          ry="7"
          fill="none"
          stroke="#6B8E23"
          strokeWidth="2"
        />
        {/* Head */}
        <ellipse cx="50" cy="18" rx="10" ry="8" fill="#6B8E23" />
        {/* Eyes */}
        <ellipse cx="46" cy="17" rx="1.5" ry="2" fill="#222" />
        <ellipse cx="54" cy="17" rx="1.5" ry="2" fill="#222" />
        {/* Mouth */}
        <path
          d="M48 22 Q50 24 52 22"
          stroke="#222"
          strokeWidth="1"
          fill="none"
        />
        {/* Legs */}
        <ellipse cx="22" cy="60" rx="6" ry="4" fill="#556B2F" />
        <ellipse cx="78" cy="60" rx="6" ry="4" fill="#556B2F" />
        <ellipse cx="30" cy="55" rx="4" ry="2.5" fill="#556B2F" />
        <ellipse cx="70" cy="55" rx="4" ry="2.5" fill="#556B2F" />
        {/* Tail */}
        <ellipse cx="50" cy="64" rx="2" ry="1" fill="#556B2F" />
      </svg>
    </div>
  );
}
