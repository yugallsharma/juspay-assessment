import React, { useRef, useEffect } from "react";
import CatSprite from "./CatSprite";
import DogSprite from "./DogSprite";
import FrogSprite from "./FrogSprite";
import TortoiseSprite from "./TortoiseSprite";

const spriteMap = {
  cat: CatSprite,
  dog: DogSprite,
  frog: FrogSprite,
  tortoise: TortoiseSprite,
};

const spriteSizes = {
  cat: { width: 60, height: 65 },
  dog: { width: 70, height: 70 },
  frog: { width: 60, height: 60 },
  tortoise: { width: 65, height: 65 },
};

const containerSize = 400;
const gridSize = 40; // 10x10 grid

const defaultPositions = [
  { x: 40, y: 40 },
  { x: 300, y: 40 },
  { x: 40, y: 300 },
  { x: 300, y: 300 },
];

function clampPosition(key, x, y) {
  const size = spriteSizes[key] || { width: 50, height: 50 };
  const minX = 0;
  const minY = 0;
  const maxX = containerSize - size.width;
  const maxY = containerSize - size.height;
  return {
    x: Math.max(minX, Math.min(x, maxX)),
    y: Math.max(minY, Math.min(y, maxY)),
  };
}

export default function PreviewArea({ sprites, setSprites, activeSprite, setActiveSprite, spriteBlocks, setSpriteBlocks }) {
  const dragData = useRef({
    dragging: false,
    spriteKey: null,
    dragStartX: 0,
    dragStartY: 0,
    spriteStartX: 0,
    spriteStartY: 0,
  });

  const onSpriteSelect = (e) => {
    const key = e.target.value;
    if (key && !sprites[key]) {
      // Find the first unused default position
      const used = Object.values(sprites).map(s => `${s.x},${s.y}`);
      const pos =
        defaultPositions.find(p => !used.includes(`${p.x},${p.y}`)) ||
        { x: 200, y: 200 }; // fallback to center if all used
      setSprites((prev) => ({
        ...prev,
        [key]: { x: pos.x, y: pos.y, angle: 0 },
      }));
      setActiveSprite && setActiveSprite(key);
    }
    e.target.value = "";
  };

  const onMouseDown = (e, key) => {
    e.preventDefault();
    dragData.current = {
      dragging: true,
      spriteKey: key,
      dragStartX: e.clientX,
      dragStartY: e.clientY,
      spriteStartX: sprites[key].x,
      spriteStartY: sprites[key].y,
    };
    document.body.style.userSelect = "none";
    setActiveSprite && setActiveSprite(key);
  };

  const onMouseMove = (e) => {
    if (!dragData.current.dragging) return;
    const key = dragData.current.spriteKey;
    const dx = e.clientX - dragData.current.dragStartX;
    const dy = e.clientY - dragData.current.dragStartY;
    let newX = dragData.current.spriteStartX + dx;
    let newY = dragData.current.spriteStartY + dy;
    // Clamp to box
    const clamped = clampPosition(key, newX, newY);
    setSprites((prev) => ({
      ...prev,
      [key]: { ...prev[key], x: clamped.x, y: clamped.y },
    }));
  };

  const onMouseUp = () => {
    dragData.current.dragging = false;
    dragData.current.spriteKey = null;
    document.body.style.userSelect = "auto";
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      document.body.style.userSelect = "auto";
    };
  }, []);

  // Remove sprite handler
  const removeActiveSprite = () => {
    if (!activeSprite) return;
    setSprites(prev => {
      const copy = { ...prev };
      delete copy[activeSprite];
      return copy;
    });
    setSpriteBlocks && setSpriteBlocks(prev => {
      const copy = { ...prev };
      delete copy[activeSprite];
      return copy;
    });
    setActiveSprite(null);
  };

  // Draw grid lines
  const gridLines = [];
  for (let i = 1; i < containerSize / gridSize; i++) {
    gridLines.push(
      <div
        key={`v${i}`}
        style={{
          position: "absolute",
          left: i * gridSize,
          top: 0,
          width: 1,
          height: containerSize,
          background: "#e5e7eb",
          zIndex: 0,
        }}
      />,
      <div
        key={`h${i}`}
        style={{
          position: "absolute",
          top: i * gridSize,
          left: 0,
          height: 1,
          width: containerSize,
          background: "#e5e7eb",
          zIndex: 0,
        }}
      />
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 bg-white">
      <div className="flex items-center mb-4">
        <select
          onChange={onSpriteSelect}
          defaultValue=""
          className="p-2 rounded border border-gray-400"
        >
          <option value="" disabled>
            Select a sprite to add
          </option>
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
          <option value="frog">Frog</option>
          <option value="tortoise">Tortoise</option>
        </select>
        {activeSprite && (
          <button
            onClick={removeActiveSprite}
            className="ml-3 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Remove
          </button>
        )}
      </div>
      <div
        className="relative border border-gray-400 rounded bg-gray-50"
        style={{
          width: containerSize,
          height: containerSize,
          boxShadow: "0 0 0 2px #e5e7eb",
          overflow: "hidden",
        }}
      >
        {/* Grid */}
        {gridLines}
        {/* Sprites */}
        {Object.entries(sprites).map(([key, pos]) => {
          const SpriteComponent = spriteMap[key];
          return (
            <div
              key={key}
              onMouseDown={(e) => onMouseDown(e, key)}
              onClick={() => setActiveSprite && setActiveSprite(key)}
              style={{
                cursor:
                  dragData.current.dragging && dragData.current.spriteKey === key
                    ? "grabbing"
                    : "grab",
                position: "absolute",
                top: 0,
                left: 0,
                transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.angle}deg)`,
                transformOrigin: "center",
                userSelect: "none",
                zIndex: 1,
                border: key === activeSprite ? "2px solid #3b82f6" : "none",
                boxShadow: key === activeSprite ? "0 0 8px #3b82f6" : "none",
                borderRadius: 8,
              }}
            >
              <SpriteComponent />
              {pos.say && (
                <div className="absolute left-0 -top-8 bg-white border rounded px-2 py-1 text-black text-xs shadow">
                  {pos.say}
                </div>
              )}
              {pos.think && (
                <div className="absolute left-1/2 -translate-x-1/2 -top-14 flex flex-col items-center pointer-events-none select-none z-10">
                  {/* Main thought bubble */}
                  <div className="relative bg-white border-2 border-gray-300 rounded-full px-4 py-2 text-gray-700 text-xs italic shadow-lg min-w-[60px] flex items-center justify-center">
                    <span>{pos.think}</span>
                    <span className="ml-1">...</span>
                  </div>
                  {/* Dots for thought trail */}
                  <div className="flex flex-col items-center mt-[-2px]">
                    <span className="w-3 h-3 bg-white border-2 border-gray-300 rounded-full block mb-1"></span>
                    <span className="w-2 h-2 bg-white border-2 border-gray-300 rounded-full block mb-1"></span>
                    <span className="w-1 h-1 bg-white border-2 border-gray-300 rounded-full block"></span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
