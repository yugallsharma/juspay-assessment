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

const initialPositions = {
  cat: { x: 20, y: 20, angle: 0 },
  dog: { x: 150, y: 20, angle: 0 },
  frog: { x: 20, y: 150, angle: 0 },
  tortoise: { x: 150, y: 150, angle: 0 },
};

// Approximate sprite sizes (width and height in px)
const spriteSizes = {
  cat: { width: 60, height: 65 },
  dog: { width: 70, height: 70 },
  frog: { width: 60, height: 60 },
  tortoise: { width: 65, height: 65 },
};

export default function PreviewArea({ sprites, setSprites }) {
  const dragData = useRef({
    dragging: false,
    spriteKey: null,
    dragStartX: 0,
    dragStartY: 0,
    spriteStartX: 0,
    spriteStartY: 0,
  });

  const containerSize = 400;

  const clampPosition = (key, x, y) => {
    const size = spriteSizes[key] || { width: 50, height: 50 };
    const padding = 5;
    const minX = padding;
    const minY = padding;
    const maxX = containerSize - size.width - 25;
    const maxY = containerSize - size.height - padding- 25;

    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  };

  const onSpriteSelect = (e) => {
    const key = e.target.value;
    if (key && !sprites[key]) {
      setSprites((prev) => ({
        ...prev,
        [key]: initialPositions[key],
      }));
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
  };

  const onMouseMove = (e) => {
    if (!dragData.current.dragging) return;
    const dx = e.clientX - dragData.current.dragStartX;
    const dy = e.clientY - dragData.current.dragStartY;
    const key = dragData.current.spriteKey;

    const { x, y } = clampPosition(
      key,
      dragData.current.spriteStartX + dx,
      dragData.current.spriteStartY + dy
    );

    setSprites((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        x,
        y,
      },
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

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 bg-white">
      <select
        onChange={onSpriteSelect}
        defaultValue=""
        className="mb-4 p-2 rounded border border-gray-400 self-start"
      >
        <option value="" disabled>
          Select a sprite to add
        </option>
        <option value="cat">Cat</option>
        <option value="dog">Dog</option>
        <option value="frog">Frog</option>
        <option value="tortoise">Tortoise</option>
      </select>

      <div
        className="relative border border-gray-400 rounded bg-gray-50"
        style={{ width: containerSize, height: containerSize }}
      >
        {Object.entries(sprites).map(([key, pos]) => {
          const SpriteComponent = spriteMap[key];
          return (
            <div
              key={key}
              onMouseDown={(e) => onMouseDown(e, key)}
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
              }}
            >
              <SpriteComponent />
            </div>
          );
        })}
      </div>
    </div>
  );
}
