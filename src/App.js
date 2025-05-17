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
  const [heroSwapEnabled, setHeroSwapEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 font-sans">
      <header className="w-full py-6 mb-4 shadow bg-white flex items-center justify-center">
        <h1 className="text-3xl font-bold text-blue-600 tracking-tight">
          Juspay Scratch Playground
        </h1>
      </header>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex flex-row gap-6">
          <div className="flex-1 flex flex-row gap-4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 flex-none">
              <Sidebar
                sprites={sprites}
                activeSprite={activeSprite}
                setActiveSprite={setActiveSprite}
                blocks={blocks}
                setBlocks={setBlocks}
              />
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 flex-1 flex flex-col">
              <MidArea
                sprites={sprites}
                setSprites={setSprites}
                spriteBlocks={spriteBlocks}
                setSpriteBlocks={setSpriteBlocks}
                activeSprite={activeSprite}
                setActiveSprite={setActiveSprite}
                blocks={blocks}
                setBlocks={setBlocks}
                heroSwapEnabled={heroSwapEnabled}
              />
            </div>
          </div>
          <div className="w-[440px]">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
              <PreviewArea
                sprites={sprites}
                setSprites={setSprites}
                setActiveSprite={setActiveSprite}
                activeSprite={activeSprite}
                spriteBlocks={spriteBlocks}
                setSpriteBlocks={setSpriteBlocks}
                heroSwapEnabled={heroSwapEnabled}
                setHeroSwapEnabled={setHeroSwapEnabled}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}