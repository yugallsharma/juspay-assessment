import React, { useState, useRef } from "react";

const initialBlocks = [
  { id: "1", className: "bg-blue-500", content: ["Move ", 10, " steps"], min: -100, max: 100 },
  { id: "2", className: "bg-blue-500", content: ["Turn ", "undo", 15, " degrees"], min: 0, max: 360 },
  { id: "3", className: "bg-blue-500", content: ["Turn ", "redo", 15, " degrees"], min: 0, max: 360 },
  { id: "4", className: "bg-blue-500", content: ["Go to x:", 100, "y:", 100], min: -1000, max: 1000 },
  { id: "5", className: "bg-blue-500", content: ["Repeat ", 5, " times"], min: 1, max: 20 },
  { id: "6", className: "bg-purple-500", content: ["Say ", "hello!", " for ", 2, " seconds"], min: 1, max: 10 },
  { id: "7", className: "bg-purple-500", content: ["Think ", "hmm...", " for ", 2, " seconds"], min: 1, max: 10 }
];

export default function Sidebar(props) {
  const { sprites, activeSprite, setActiveSprite, blocks, setBlocks } = props;
  const [isRunning, setIsRunning] = useState(false);
  const stopRef = useRef(false);

  function updateBlock(blockId, index, value) {
    setBlocks(function (prev) {
      return prev.map(function (block) {
        if (block.id === blockId) {
          return {
            ...block,
            content: block.content.map(function (c, i) {
              if (i === index) return value;
              return c;
            })
          };
        }
        return block;
      });
    });
  }

  function renderBlock(block) {
    return (
      <div
        key={block.id}
        className={`flex flex-wrap ${block.className} text-white px-3 py-2 my-2 text-sm items-center cursor-grab rounded-xl shadow-sm transition-all duration-150 hover:scale-[1.03]`}
        draggable
        onDragStart={function (e) {
          e.dataTransfer.setData("block", JSON.stringify(block));
        }}
      >
        {block.content.map(function (part, i) {
          if ((block.content[0] === "Say " && i === 1) || (block.content[0] === "Think " && i === 1)) {
            return (
              <input
                key={i}
                type="text"
                value={part}
                onChange={function (e) { updateBlock(block.id, i, e.target.value); }}
                className="w-20 text-black rounded px-1 mx-1"
              />
            );
          }
          if (typeof part === "number") {
            var min = block.min ?? 0;
            var max = block.max ?? 100;
            return (
              <input
                key={i}
                type="number"
                min={min}
                max={max}
                value={part}
                onChange={function (e) {
                  var val = parseInt(e.target.value, 10);
                  if (isNaN(val)) val = min;
                  if (val < min) val = min;
                  if (val > max) val = max;
                  updateBlock(block.id, i, val);
                }}
                className="w-12 text-black rounded px-1 mx-1"
              />
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    );
  }

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="font-bold mt-4">Motion</div>
      {blocks.slice(0, 5).map(renderBlock)}
      <div className="font-bold mt-4">Looks</div>
      {blocks.slice(5).map(renderBlock)}
    </div>
  );
}
