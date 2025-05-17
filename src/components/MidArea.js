import React, { useState, useRef } from "react";
import Icon from "./Icon";
import Sidebar from "./Sidebar"; // <-- Import Sidebar here
import { spriteSizes, containerSize, clampPosition } from "../utils/clamp";

function renderBlockContentWithInputs(block, onChange) {
  return block.content.map((part, i) => {
    if (part === "flag" || part === "undo" || part === "redo") {
      return <Icon key={i} name={part} size={15} className="text-white mx-2" />;
    }
    if (typeof part === "number") {
      const min = block.min ?? 0;
      const max = block.max ?? 100;
      return (
        <input
          key={i}
          type="number"
          min={min}
          max={max}
          value={part}
          onChange={(e) => {
            let val = parseInt(e.target.value, 10);
            if (isNaN(val)) val = min;
            if (val < min) val = min;
            if (val > max) val = max;
            onChange(i, val);
          }}
          className="w-16 text-black rounded px-1 mx-1"
        />
      );
    }
    // Add this for string input (for say/think message)
    if (
      block.content[0] === "Say " && i === 1 ||
      block.content[0] === "Think " && i === 1
    ) {
      return (
        <input
          key={i}
          type="text"
          value={part}
          onChange={(e) => onChange(i, e.target.value)}
          className="w-24 text-black rounded px-1 mx-1"
        />
      );
    }
    return <span key={i}>{part}</span>;
  });
}

const initialPositions = {
  cat: { x: 10, y: 10, angle: 0 },
  dog: { x: 100, y: 10, angle: 0 },
  frog: { x: 10, y: 100, angle: 0 },
  tortoise: { x: 100, y: 100, angle: 0 },
};

export default function MidArea({
  sprites,
  setSprites,
  spriteBlocks,
  setSpriteBlocks,
  activeSprite,
  setActiveSprite,
  blocks,
  setBlocks,
}) {
  const [isRunning, setIsRunning] = useState(false);
  const stopRef = useRef(false);
  const [draggedBlockUid, setDraggedBlockUid] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragData = useRef({ dragging: false });

  const handleDrop = (e) => {
    e.preventDefault();
    const block = JSON.parse(e.dataTransfer.getData("block"));
    const newBlock = {
      ...block,
      content: [...block.content], // clone the content array!
      uid: Date.now() + Math.random(),
    };
    setSpriteBlocks((prev) => ({
      ...prev,
      [activeSprite]: [...(prev[activeSprite] || []), newBlock],
    }));
  };

  const updateBlock = (uid, index, newValue) => {
    setSpriteBlocks((prev) => ({
      ...prev,
      [activeSprite]: prev[activeSprite].map((block) =>
        block.uid === uid
          ? {
              ...block,
              content: block.content.map((c, i) => (i === index ? newValue : c)),
            }
          : block
      ),
    }));
  };

  const removeBlock = (uid) => {
    setSpriteBlocks((prev) => ({
      ...prev,
      [activeSprite]: prev[activeSprite].filter((b) => b.uid !== uid),
    }));
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const animateSprite = async (spriteKey) => {
    const moveStep = 5;
    const moveDelay = 20;
    const turnStep = 5;
    const turnDelay = 30;

    let { x, y, angle } = sprites[spriteKey];
    let say = null;
    let think = null;
    const blocks = spriteBlocks[spriteKey] || [];

    const runBlocksWithRepeat = async (spriteKey, blocks) => {
      let i = 0;
      while (i < blocks.length) {
        if (stopRef.current) return;
        const block = blocks[i];
        if (block.content[0] === "Repeat ") {
          const times = block.content[1];
          for (let t = 0; t < times; t++) {
            if (stopRef.current) return;
            await runBlocksWithRepeat(spriteKey, blocks.filter((b, idx) => idx !== i));
          }
          i++;
          continue;
        }
        if (block.content[0] === "Move ") {
          let remaining = block.content[1];
          while (Math.abs(remaining) > 0) {
            if (stopRef.current) return;
            const step = Math.abs(remaining) < moveStep ? remaining : remaining > 0 ? moveStep : -moveStep;
            const rad = (angle * Math.PI) / 180;
            x = x + Math.cos(rad) * step;
            y = y + Math.sin(rad) * step;
            // CLAMP HERE
            const clamped = clampPosition(spriteKey, x, y);
            x = clamped.x;
            y = clamped.y;
            setSprites((prev) => ({
              ...prev,
              [spriteKey]: { x, y, angle },
            }));
            remaining -= step;
            await delay(moveDelay);
          }
        } else if (block.content[0] === "Turn ") {
          const direction = block.content[1];
          const degrees = block.content[2];
          let remaining = degrees;
          while (remaining > 0) {
            const step = Math.min(turnStep, remaining);
            angle += direction === "undo" ? -step : step;
            remaining -= step;
            setSprites((prev) => ({
              ...prev,
              [spriteKey]: { x, y, angle },
            }));
            await delay(turnDelay);
          }
        } else if (block.content[0] === "Say ") {
          say = block.content[1];
          setSprites((prev) => ({
            ...prev,
            [spriteKey]: { ...prev[spriteKey], say },
          }));
          await delay((block.content[3] || 2) * 1000);
          setSprites((prev) => ({
            ...prev,
            [spriteKey]: { ...prev[spriteKey], say: null },
          }));
        } else if (block.content[0] === "Think ") {
          think = block.content[1];
          setSprites((prev) => ({
            ...prev,
            [spriteKey]: { ...prev[spriteKey], think },
          }));
          await delay((block.content[3] || 2) * 1000);
          setSprites((prev) => ({
            ...prev,
            [spriteKey]: { ...prev[spriteKey], think: null },
          }));
        } else if (block.content[0] === "Go to x:") {
          x = block.content[1];
          y = block.content[3];
          // CLAMP HERE
          const clamped = clampPosition(spriteKey, x, y);
          x = clamped.x;
          y = clamped.y;
          setSprites((prev) => ({
            ...prev,
            [spriteKey]: { x, y, angle },
          }));
          await delay(100); // Small delay for UI update
        }
        i++;
      }
    };

    await runBlocksWithRepeat(spriteKey, blocks);
    setSprites((prev) => ({
      ...prev,
      [spriteKey]: { x, y, angle },
    }));
  };

  const runBlocks = () => {
    stopRef.current = false;
    setIsRunning(true);
    const keys = Object.keys(spriteBlocks);
    Promise.all(keys.map(animateSprite)).then(() => setIsRunning(false));
  };

  const stopBlocks = () => {
    stopRef.current = true;
    setIsRunning(false);
  };

  const spriteKeys = Object.keys(sprites);
  if (spriteKeys.length === 0) {
    return (
      <div className="flex-1 h-full flex items-center justify-center text-gray-500 italic text-lg">
        Please add a sprite to get started.
      </div>
    );
  }

  const onMouseDown = (e, key) => {
    e.preventDefault();
    // Always get the latest position!
    const { x, y } = sprites[key];
    dragData.current = {
      dragging: true,
      spriteKey: key,
      dragStartX: e.clientX,
      dragStartY: e.clientY,
      spriteStartX: x,
      spriteStartY: y,
    };
    document.body.style.userSelect = "none";
    setActiveSprite && setActiveSprite(key);
  };

  return (
    <div className="flex-1 h-full overflow-auto p-4 border border-dashed border-gray-400 rounded"
      onDrop={spriteKeys.length === 0 ? undefined : handleDrop}
      onDragOver={spriteKeys.length === 0 ? undefined : (e) => e.preventDefault()}
    >
      {/* Tabs and Run/Stop Buttons */}
      <div className="flex space-x-2 mb-4">
        {Object.keys(sprites).map((key) => (
          <button
            key={key}
            onClick={() => setActiveSprite(key)}
            className={`px-3 py-1 rounded ${
              key === activeSprite ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {key}
          </button>
        ))}
        <button
          onClick={runBlocks}
          disabled={isRunning}
          className={`ml-auto px-4 py-1 rounded ${isRunning ? "bg-green-300" : "bg-green-500 hover:bg-green-600"} text-white`}
        >
          Run
        </button>
        <button
          onClick={stopBlocks}
          disabled={!isRunning}
          className={`ml-2 px-4 py-1 rounded ${isRunning ? "bg-red-500 hover:bg-red-600" : "bg-red-300"} text-white`}
        >
          Stop
        </button>
      </div>

      {/* Workspace blocks UI (unchanged) */}
      {activeSprite && (spriteBlocks[activeSprite] || []).length === 0 && (
        <p className="text-gray-500 italic">Drag blocks for {activeSprite}</p>
      )}

      {(spriteBlocks[activeSprite] || []).map((block, idx) => (
        <div
          key={block.uid}
          draggable
          onDragStart={() => setDraggedBlockUid(block.uid)}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverIndex(idx);
          }}
          onDragLeave={() => setDragOverIndex(null)}
          onDrop={() => {
            if (draggedBlockUid && draggedBlockUid !== block.uid) {
              setSpriteBlocks((prev) => {
                const blocks = [...prev[activeSprite]];
                const fromIdx = blocks.findIndex(b => b.uid === draggedBlockUid);
                const toIdx = idx;
                const [moved] = blocks.splice(fromIdx, 1);
                blocks.splice(toIdx, 0, moved);
                return { ...prev, [activeSprite]: blocks };
              });
            }
            setDraggedBlockUid(null);
            setDragOverIndex(null);
          }}
          className={`flex flex-wrap ${block.className} text-white px-2 py-1 my-2 text-sm items-center
            ${dragOverIndex === idx ? "ring-2 ring-yellow-400" : ""}
          `}
        >
          {renderBlockContentWithInputs(block, (index, val) =>
            updateBlock(block.uid, index, val)
          )}
          <button
            onClick={() => removeBlock(block.uid)}
            className="ml-4 bg-red-600 rounded px-2 py-1 text-white text-xs"
          >
            Remove
          </button>
        </div>
      ))}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOverIndex(spriteBlocks[activeSprite]?.length || 0);
        }}
        onDrop={() => {
          if (draggedBlockUid) {
            setSpriteBlocks((prev) => {
              const blocks = [...prev[activeSprite]];
              const fromIdx = blocks.findIndex(b => b.uid === draggedBlockUid);
              const [moved] = blocks.splice(fromIdx, 1);
              blocks.push(moved);
              return { ...prev, [activeSprite]: blocks };
            });
          }
          setDraggedBlockUid(null);
          setDragOverIndex(null);
        }}
        style={{ height: 24 }}
      >
        {dragOverIndex === (spriteBlocks[activeSprite]?.length || 0) && (
          <div className="w-full h-2 bg-yellow-200 rounded" />
        )}
      </div>
    </div>
  );
}

