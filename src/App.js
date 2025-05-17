import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

const initialBlocks = [
  // Motion
  { id: "1", className: "bg-blue-500", content: ["Move ", 10, " steps"], min: -100, max: 100 },
  { id: "2", className: "bg-blue-500", content: ["Turn ", "undo", 15, " degrees"], min: 0, max: 360 },
  { id: "3", className: "bg-blue-500", content: ["Turn ", "redo", 15, " degrees"], min: 0, max: 360 },
  { id: "4", className: "bg-blue-500", content: ["Go to x:", 100, "y:", 100], min: -1000, max: 1000 },
  { id: "5", className: "bg-blue-500", content: ["Repeat ", 5, " times"], min: 1, max: 20 },
  // Looks
  { id: "6", className: "bg-purple-500", content: ["Say ", "hello!", " for ", 2, " seconds"], min: 1, max: 10 },
  { id: "7", className: "bg-purple-500", content: ["Think ", "hmm...", " for ", 2, " seconds"], min: 1, max: 10 },
];

export default function App() {
  const [sprites, setSprites] = useState({});
  const [spriteBlocks, setSpriteBlocks] = useState({});
  const [activeSprite, setActiveSprite] = useState(null);
  const [blocks, setBlocks] = useState(initialBlocks);

  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar
            sprites={sprites}
            activeSprite={activeSprite}
            setActiveSprite={setActiveSprite}
            blocks={blocks}
            setBlocks={setBlocks}
          />
          <MidArea
            sprites={sprites}
            setSprites={setSprites}
            spriteBlocks={spriteBlocks}
            setSpriteBlocks={setSpriteBlocks}
            activeSprite={activeSprite}
            setActiveSprite={setActiveSprite}
          />
        </div>
        <div className="w-1/3 mr-3 h-screen overflow-hidden flex flex-col bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea
            sprites={sprites}
            setSprites={setSprites}
            setActiveSprite={setActiveSprite}
            activeSprite={activeSprite}
          />
        </div>
      </div>
    </div>
  );
}
