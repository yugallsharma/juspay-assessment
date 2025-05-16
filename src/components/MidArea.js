import React, { useState } from "react";
import Icon from "./Icon";

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
    return <span key={i}>{part}</span>;
  });
}

export default function MidArea({
  sprites,
  setSprites,
  spriteBlocks,
  setSpriteBlocks,
  activeSprite,
  setActiveSprite,
}) {
  const handleDrop = (e) => {
    e.preventDefault();
    const block = JSON.parse(e.dataTransfer.getData("block"));
    const newBlock = {
      ...block,
      content: [...block.content],
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
    const blocks = spriteBlocks[spriteKey] || [];

    for (const block of blocks) {
      if (block.content[0] === "Move ") {
        const total = block.content[1];
        let remaining = total;
        while (Math.abs(remaining) > 0) {
          const step = Math.abs(remaining) < moveStep ? remaining : remaining > 0 ? moveStep : -moveStep;
          const rad = (angle * Math.PI) / 180;
          x += Math.cos(rad) * step;
          y += Math.sin(rad) * step;
          remaining -= step;
          setSprites((prev) => ({
            ...prev,
            [spriteKey]: { x, y, angle },
          }));
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
      }
    }
  };

  const runBlocks = () => {
    const keys = Object.keys(spriteBlocks);
    Promise.all(keys.map(animateSprite));
  };

  return (
    <div
      className="flex-1 h-full overflow-auto p-4 border border-dashed border-gray-400 rounded"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Tabs */}
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
          className="ml-auto bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
        >
          Run
        </button>
      </div>

      {activeSprite && (spriteBlocks[activeSprite] || []).length === 0 && (
        <p className="text-gray-500 italic">Drag blocks for {activeSprite}</p>
      )}

      {(spriteBlocks[activeSprite] || []).map((block) => (
        <div
          key={block.uid}
          className={`flex flex-wrap ${block.className} text-white px-2 py-1 my-2 text-sm items-center`}
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
    </div>
  );
}
