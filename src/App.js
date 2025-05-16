import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

export default function App() {
  const [sprites, setSprites] = useState({});
  const [spriteBlocks, setSpriteBlocks] = useState({});
  const [activeSprite, setActiveSprite] = useState(null);

  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar />
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
          />
        </div>
      </div>
    </div>
  );
}
