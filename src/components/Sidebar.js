import React, { useState } from "react";
import Icon from "./Icon";

const initialBlocks = [
  { id: "1", className: "bg-yellow-500", content: ["When ", "flag", " clicked"] },
  { id: "2", className: "bg-yellow-500", content: ["When this sprite clicked"] },
  { id: "3", className: "bg-blue-500", content: ["Move ", 10, " steps"], min: -100, max: 100 },
  { id: "4", className: "bg-blue-500", content: ["Turn ", "undo", 15, " degrees"], min: 0, max: 360 },
  { id: "5", className: "bg-blue-500", content: ["Turn ", "redo", 15, " degrees"], min: 0, max: 360 },
];

export default function Sidebar() {
  const [blocks, setBlocks] = useState(initialBlocks);

  const handleDragStart = (e, block) => {
    e.dataTransfer.setData("block", JSON.stringify(block));
  };

  const updateBlock = (blockId, index, value) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? { ...block, content: block.content.map((c, i) => (i === index ? value : c)) }
          : block
      )
    );
  };

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="font-bold">Events</div>
      {blocks.slice(0, 2).map((block) => (
        <Block key={block.id} block={block} onDragStart={handleDragStart} onUpdate={updateBlock} />
      ))}

      <div className="font-bold mt-4">Motion</div>
      {blocks.slice(2).map((block) => (
        <Block key={block.id} block={block} onDragStart={handleDragStart} onUpdate={updateBlock} />
      ))}
    </div>
  );
}

function Block({ block, onDragStart, onUpdate }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, block)}
      className={`flex flex-wrap ${block.className} text-white px-2 py-1 my-2 text-sm cursor-pointer`}
    >
      {block.content.map((part, i) =>
        part === "flag" || part === "undo" || part === "redo" ? (
          <Icon key={i} name={part} size={15} className="text-white mx-2" />
        ) : typeof part === "number" ? (
          <input
            key={i}
            type="number"
            min={block.min ?? 0}
            max={block.max ?? 100}
            value={part}
            onChange={(e) => {
              let val = parseInt(e.target.value);
              if (isNaN(val)) val = block.min ?? 0;
              if (val < (block.min ?? 0)) val = block.min ?? 0;
              if (val > (block.max ?? 100)) val = block.max ?? 100;
              onUpdate(block.id, i, val);
            }}
            className="w-16 text-black rounded px-1 mx-1"
          />
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </div>
  );
}
