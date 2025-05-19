import React, { useState, useRef, useEffect } from "react";
import Icon from "./Icon";
import { spriteSizes, clampPosition } from "../utils/clamp";
 
function removeBlockByUid(blocks, uid) {
  return blocks
    .filter(b => b.uid !== uid)
    .map(b =>
      b.content && b.content[0] === "Repeat " && b.children
        ? { ...b, children: removeBlockByUid(b.children, uid) }
        : b
    );
}

function isDescendant(block, uid) {
  if (!block.children) return false;
  for (const child of block.children) {
    if (child.uid === uid) return true;
    if (isDescendant(child, uid)) return true;
  }
  return false;
}

function moveBlockInList(list, fromIdx, toIdx) {
  const arr = [...list];
  const [moved] = arr.splice(fromIdx, 1);
  arr.splice(toIdx, 0, moved);
  return arr;
}

function delay(ms, stopRef) {
  return new Promise(resolve => {
    const start = Date.now();
    function check() {
      if (stopRef.current) return resolve();
      if (Date.now() - start >= ms) return resolve();
      setTimeout(check, 30);
    }
    check();
  });
}

function renderBlockContentWithInputs(
  block,
  onChange,
  onChildChange,
  setSpriteBlocks,
  activeSprite,
  draggedBlockUid,
  setDraggedBlockUid,
  dragOverChildIdx,
  setDragOverChildIdx
) {
  return (
    <div>
      {block.content[0] === "Turn " ? (
        <span>
          Turn{" "}
          <span className="inline-block align-middle mx-1">
            {block.content[1] === "undo" ? (
              <Icon name="undo" size={15} className="inline text-white" />
            ) : (
              <Icon name="redo" size={15} className="inline text-white" />
            )}
          </span>
          <input
            type="number"
            min={block.min ?? 0}
            max={block.max ?? 360}
            value={block.content[2]}
            onChange={e => onChange(2, parseInt(e.target.value, 10) || 0)}
            className="w-12 text-black rounded px-1 mx-1"
          />
          degrees
        </span>
      ) : (
        block.content.map((part, i) => {
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
          if (
            (block.content[0] === "Say " && i === 1) ||
            (block.content[0] === "Think " && i === 1)
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
        })
      )}
      {block.content[0] === "Repeat " && (
        <div
          className="ml-6 mt-1 border-l-2 border-yellow-400 pl-2 bg-yellow-100/20 rounded"
          style={{ minHeight: 36, minWidth: 120, paddingBottom: 8 }}
          onDragOver={e => {
            e.preventDefault();
            setDragOverChildIdx("container");
          }}
          onDrop={e => {
            e.preventDefault();
            e.stopPropagation();
            const blockData = e.dataTransfer.getData("block");
            if (blockData) {
              const droppedBlock = JSON.parse(blockData);
              if (droppedBlock.uid === block.uid || isDescendant(droppedBlock, block.uid)) {
                setDragOverChildIdx(null);
                return;
              }
              setSpriteBlocks(prev => {
                let blocks = prev[activeSprite] || [];
                if (droppedBlock.uid) {
                  blocks = removeBlockByUid(blocks, droppedBlock.uid);
                }
                return {
                  ...prev,
                  [activeSprite]: blocks.map(b =>
                    b.uid === block.uid
                      ? {
                          ...b,
                          children: [
                            ...(Array.isArray(b.children) ? b.children : []),
                            droppedBlock.uid
                              ? droppedBlock
                              : {
                                  ...droppedBlock,
                                  uid: Date.now() + Math.random(),
                                  children: droppedBlock.content[0] === "Repeat " ? [] : undefined
                                }
                          ]
                        }
                      : b
                  )
                };
              });
            }
            setDragOverChildIdx(null);
          }}
        >
          {(block.children || []).length === 0 && (
            <div className="text-gray-400 italic py-2">Drop blocks here</div>
          )}
          {(block.children || []).map((child, idx) => (
            <div
              key={child.uid}
              draggable
              onDragStart={e => {
                setDraggedBlockUid(child.uid);
                e.dataTransfer.setData("block", JSON.stringify(child));
              }}
              onDragOver={e => {
                e.preventDefault();
                setDragOverChildIdx(idx);
              }}
              onDragLeave={() => setDragOverChildIdx(null)}
              onDrop={e => {
                e.stopPropagation();
                if (draggedBlockUid && draggedBlockUid !== child.uid) {
                  setSpriteBlocks(prev => ({
                    ...prev,
                    [activeSprite]: prev[activeSprite].map(b =>
                      b.uid === block.uid
                        ? {
                            ...b,
                            children: moveBlockInList(
                              b.children,
                              b.children.findIndex(c => c.uid === draggedBlockUid),
                              idx
                            )
                          }
                        : b
                    )
                  }));
                }
                setDraggedBlockUid(null);
                setDragOverChildIdx(null);
              }}
              className={`flex flex-wrap items-center bg-blue-700/80 px-2 py-1 my-2 text-sm rounded-xl shadow-sm ${
                dragOverChildIdx === idx ? "ring-2 ring-yellow-400" : ""
              }`}
              style={{ marginLeft: 0 }}
            >
              {renderBlockContentWithInputs(
                child,
                (i, val) => onChildChange(block.uid, idx, i, val),
                onChildChange,
                setSpriteBlocks,
                activeSprite,
                draggedBlockUid,
                setDraggedBlockUid,
                dragOverChildIdx,
                setDragOverChildIdx
              )}
              <button
                onClick={() => {
                  setSpriteBlocks(prev => ({
                    ...prev,
                    [activeSprite]: prev[activeSprite].map(b =>
                      b.uid === block.uid
                        ? {
                            ...b,
                            children: b.children.filter((_, cidx) => cidx !== idx)
                          }
                        : b
                    )
                  }));
                }}
                className="ml-2 bg-red-500 rounded px-1 py-0.5 text-xs"
              >
                Remove
              </button>
            </div>
          ))}
          <div
            onDragOver={e => {
              e.preventDefault();
              setDragOverChildIdx((block.children || []).length);
            }}
            onDrop={e => {
              e.stopPropagation();
              if (draggedBlockUid) {
                setSpriteBlocks(prev => ({
                  ...prev,
                  [activeSprite]: prev[activeSprite].map(b =>
                    b.uid === block.uid
                      ? {
                          ...b,
                          children: moveBlockInList(
                            b.children,
                            b.children.findIndex(c => c.uid === draggedBlockUid),
                            (block.children || []).length
                          )
                        }
                      : b
                  )
                }));
              }
              setDraggedBlockUid(null);
              setDragOverChildIdx(null);
            }}
            style={{ height: 12 }}
          >
            {dragOverChildIdx === (block.children || []).length && (
              <div className="w-full h-2 bg-yellow-200 rounded" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MidArea({
  sprites,
  setSprites,
  spriteBlocks,
  setSpriteBlocks,
  activeSprite,
  setActiveSprite,
  blocks,
  setBlocks,
  heroSwapEnabled,
}) {
  const [isRunning, setIsRunning] = useState(false);
  const stopRef = useRef(false);
  const [draggedBlockUid, setDraggedBlockUid] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragOverChildIdx, setDragOverChildIdx] = useState(null);
  const executionStateRef = useRef({});
  const swappedRef = useRef({});
  const runTokenRef = useRef({});
  const runningSpritesRef = useRef(0);

  useEffect(() => {
    setDraggedBlockUid(null);
    setDragOverIndex(null);
    setDragOverChildIdx(null);
  }, [activeSprite]);

  const updateChildBlock = (parentUid, childIdx, index, newValue) => {
    setSpriteBlocks((prev) => ({
      ...prev,
      [activeSprite]: prev[activeSprite].map((block) =>
        block.uid === parentUid
          ? {
              ...block,
              children: block.children.map((child, idx) =>
                idx === childIdx
                  ? {
                      ...child,
                      content: child.content.map((c, i) =>
                        i === index ? newValue : c
                      ),
                    }
                  : child
              ),
            }
          : block
      ),
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
      [activeSprite]: removeBlockByUid(prev[activeSprite], uid),
    }));
  };

  const animateSprite = async (spriteKey, token) => {
    const moveStep = 1; 
    const moveDelay = 20;
    const turnStep = 5;
    const turnDelay = 30;

    let { x, y, angle } = sprites[spriteKey];

    let blocks = [];
    let i = 0;
    
    if (executionStateRef.current[spriteKey]) {
      blocks = executionStateRef.current[spriteKey].blocks;
      i = executionStateRef.current[spriteKey].blockIndex;
    } else {
      blocks = spriteBlocks[spriteKey] || [];
      executionStateRef.current[spriteKey] = { blockIndex: 0, blocks };
    }

    while (i < blocks.length) {
      if (stopRef.current) return;
      if (runTokenRef.current[spriteKey] !== token) return;

      executionStateRef.current[spriteKey] = { blockIndex: i, blocks };

      const block = blocks[i];

      if (heroSwapEnabled) {
        for (const otherKey of Object.keys(sprites)) {
          if (otherKey !== spriteKey) {
            const a = { x, y };
            const b = sprites[otherKey];
            const pairKey = [spriteKey, otherKey].sort().join("-");
            if (
              isColliding(a, b, spriteKey, otherKey) &&
              !swappedRef.current[pairKey]
            ) {
              swappedRef.current[pairKey] = true;
              setTimeout(() => {
                swappedRef.current[pairKey] = false;
              }, 1000);

              console.log(`Collision between ${spriteKey} and ${otherKey}!`);
              
              const stateSnapshotA = createExecutionStateSnapshot(
                blocks,
                i,
                [spriteKey]
              );
              
              const otherBlocks = spriteBlocks[otherKey] || [];
              const otherIndex = executionStateRef.current[otherKey]?.blockIndex || 0;

              const stateSnapshotB = createExecutionStateSnapshot(
                otherBlocks,
                otherIndex,
                [otherKey]
              );

              setSpriteBlocks(prev => {
                const updatedBlocks = { ...prev };
                const blocksA = JSON.parse(JSON.stringify(prev[spriteKey] || []));
                const blocksB = JSON.parse(JSON.stringify(prev[otherKey] || []));
                
                updatedBlocks[spriteKey] = blocksB;
                updatedBlocks[otherKey] = blocksA;
                
                return updatedBlocks;
              });

              setSprites(prev => {
                const updated = { ...prev };
                const temp = updated[spriteKey];
                updated[spriteKey] = { ...updated[otherKey] };
                updated[otherKey] = { ...temp };
                return updated;
              });
              
              executionStateRef.current[spriteKey] = stateSnapshotB;
              executionStateRef.current[otherKey] = stateSnapshotA;
              
              runTokenRef.current[spriteKey] = (runTokenRef.current[spriteKey] || 0) + 1;
              runTokenRef.current[otherKey] = (runTokenRef.current[otherKey] || 0) + 1;

              const collisionEvent = new CustomEvent('spriteCollision', {
                detail: { spriteA: spriteKey, spriteB: otherKey }
              });
              window.dispatchEvent(collisionEvent);

              animateSprite(spriteKey, runTokenRef.current[spriteKey]);
              animateSprite(otherKey, runTokenRef.current[otherKey]);
              return;
            }
          }
        }
      }

      if (block.content[0] === "Repeat ") {
        const times = block.content[1];
        for (let rep = 0; rep < times; rep++) {
          for (let j = 0; j < (block.children || []).length; j++) {
            const child = block.children[j];
            await runBlock(child);
            if (stopRef.current) return;
          }
        }
        i++;
        continue;
      }

      if (block.content[0] === "Move ") {
        let total = block.content[1];
        let steps = Math.abs(total);
        let dir = total > 0 ? 1 : -1;
        for (let s = 0; s < steps; s++) {
          if (stopRef.current) return;
          if (runTokenRef.current[spriteKey] !== token) return;
          const rad = (angle * Math.PI) / 180;
          x = x + Math.cos(rad) * dir;
          y = y + Math.sin(rad) * dir;
          const clamped = clampPosition(spriteKey, x, y);
          x = clamped.x;
          y = clamped.y;
          setSprites((prev) => ({
            ...prev,
            [spriteKey]: { x, y, angle },
          }));

          if (heroSwapEnabled) {
            for (const otherKey of Object.keys(sprites)) {
              if (otherKey !== spriteKey) {
                const a = { x, y };
                const b = sprites[otherKey];
                const pairKey = [spriteKey, otherKey].sort().join("-");
                if (
                  isColliding(a, b, spriteKey, otherKey) &&
                  !swappedRef.current[pairKey]
                ) {
                  swappedRef.current[pairKey] = true;
                  setTimeout(() => {
                    swappedRef.current[pairKey] = false;
                  }, 1000);

                  console.log(`Collision between ${spriteKey} and ${otherKey}!`);

                  const stateSnapshotA = createExecutionStateSnapshot(
                    blocks,
                    i,
                    [spriteKey]
                  );

                  const otherBlocks = spriteBlocks[otherKey] || [];
                  const otherIndex = executionStateRef.current[otherKey]?.blockIndex || 0;

                  const stateSnapshotB = createExecutionStateSnapshot(
                    otherBlocks,
                    otherIndex,
                    [otherKey]
                  );

                  setSpriteBlocks(prev => {
                    const updatedBlocks = { ...prev };
                    const blocksA = JSON.parse(JSON.stringify(prev[spriteKey] || []));
                    const blocksB = JSON.parse(JSON.stringify(prev[otherKey] || []));
                    
                    updatedBlocks[spriteKey] = blocksB;
                    updatedBlocks[otherKey] = blocksA;
                    
                    return updatedBlocks;
                  });

                  setSprites(prev => {
                    const updated = { ...prev };
                    const temp = updated[spriteKey];
                    updated[spriteKey] = { ...updated[otherKey] };
                    updated[otherKey] = { ...temp };
                    return updated;
                  });
                  
                  executionStateRef.current[spriteKey] = stateSnapshotB;
                  executionStateRef.current[otherKey] = stateSnapshotA;
                  
                  runTokenRef.current[spriteKey] = (runTokenRef.current[spriteKey] || 0) + 1;
                  runTokenRef.current[otherKey] = (runTokenRef.current[otherKey] || 0) + 1;

                  const collisionEvent = new CustomEvent('spriteCollision', {
                    detail: { spriteA: spriteKey, spriteB: otherKey }
                  });
                  window.dispatchEvent(collisionEvent);

                  animateSprite(spriteKey, runTokenRef.current[spriteKey]);
                  animateSprite(otherKey, runTokenRef.current[otherKey]);
                  return;
                }
              }
            }
          }
          await delay(moveDelay, stopRef);
          if (stopRef.current) return;
        }
      } else if (block.content[0] === "Turn ") {
        const direction = block.content[1];
        const degrees = block.content[2];
        let remaining = degrees;
        while (remaining > 0) {
          if (stopRef.current) return;
          if (runTokenRef.current[spriteKey] !== token) return;
          const step = Math.min(turnStep, remaining);
          angle += direction === "undo" ? -step : step;
          remaining -= step;
          setSprites((prev) => ({
            ...prev,
            [spriteKey]: { x, y, angle },
          }));
          await delay(turnDelay, stopRef);
          if (stopRef.current) return;
        }
      } else if (block.content[0] === "Say ") {
        setSprites((prev) => ({
          ...prev,
          [spriteKey]: { ...prev[spriteKey], say: block.content[1] },
        }));
        await delay((block.content[3] || 2) * 1000, stopRef);
        if (stopRef.current) return;
        setSprites((prev) => ({
          ...prev,
          [spriteKey]: { ...prev[spriteKey], say: null },
        }));
      } else if (block.content[0] === "Think ") {
        setSprites((prev) => ({
          ...prev,
          [spriteKey]: { ...prev[spriteKey], think: block.content[1] },
        }));
        await delay((block.content[3] || 2) * 1000, stopRef);
        if (stopRef.current) return;
        setSprites((prev) => ({
          ...prev,
          [spriteKey]: { ...prev[spriteKey], think: null },
        }));
      } else if (block.content[0] === "Go to x:") {
        x = block.content[1];
        y = block.content[3];
        const clamped = clampPosition(spriteKey, x, y);
        x = clamped.x;
        y = clamped.y;
        setSprites((prev) => ({
          ...prev,
          [spriteKey]: { x, y, angle },
        }));
        await delay(100, stopRef);
        if (stopRef.current) return;
      }

      i++;
    }

    setSprites((prev) => ({
      ...prev,
      [spriteKey]: { x, y, angle },
    }));

    runningSpritesRef.current -= 1;
    if (runningSpritesRef.current <= 0) {
      setIsRunning(false);
    }

    async function runBlock(block, nestLevel = 0, repeatIndex = 0) {

      if (nestLevel > 0) {
        if (!executionStateRef.current[spriteKey].nested) {
          executionStateRef.current[spriteKey].nested = {};
        }
        
        const nestedPath = `${nestLevel}-${repeatIndex}`;
        
        if (!executionStateRef.current[spriteKey].nested[nestedPath]) {
          executionStateRef.current[spriteKey].nested[nestedPath] = {
            repeatCounter: 0,
            childIndex: 0
          };
        }
        
        const nestedState = executionStateRef.current[spriteKey].nested[nestedPath];
      
        if (block.content[0] === "Repeat ") {
          const times = block.content[1];
          
          for (let rep = nestedState.repeatCounter; rep < times; rep++) {
            nestedState.repeatCounter = rep;
            
            for (let j = nestedState.childIndex; j < (block.children || []).length; j++) {
              nestedState.childIndex = j;
              await runBlock(block.children[j], nestLevel + 1, j);
              if (stopRef.current) return;
              if (runTokenRef.current[spriteKey] !== token) return;
            }
            
            nestedState.childIndex = 0;
          }
          
          nestedState.repeatCounter = 0;
          return;
        }
      } else if (block.content[0] === "Repeat ") {
        const times = block.content[1];
        for (let rep = 0; rep < times; rep++) {
          for (let j = 0; j < (block.children || []).length; j++) {
            await runBlock(block.children[j], nestLevel + 1, j);
            if (stopRef.current) return;
            if (runTokenRef.current[spriteKey] !== token) return;
          }
        }
        return;
      }
      
      if (block.content[0] === "Move ") {
        let total = block.content[1];
        let steps = Math.abs(total);
        let dir = total > 0 ? 1 : -1;
        for (let s = 0; s < steps; s++) {
          if (stopRef.current) return;
          if (runTokenRef.current[spriteKey] !== token) return;

          const rad = (angle * Math.PI) / 180;
          x = x + Math.cos(rad) * dir;
          y = y + Math.sin(rad) * dir;
          const clamped = clampPosition(spriteKey, x, y);
          x = clamped.x;
          y = clamped.y;
          setSprites((prev) => ({
            ...prev,
            [spriteKey]: { x, y, angle },
          }));

          if (heroSwapEnabled) {
            for (const otherKey of Object.keys(sprites)) {
              if (otherKey !== spriteKey) {
                const a = { x, y };
                const b = sprites[otherKey];
                const pairKey = [spriteKey, otherKey].sort().join("-");
                if (
                  isColliding(a, b, spriteKey, otherKey) &&
                  !swappedRef.current[pairKey]
                ) {
                  swappedRef.current[pairKey] = true;
                  setTimeout(() => {
                    swappedRef.current[pairKey] = false;
                  }, 1000);

                  console.log(`Collision between ${spriteKey} and ${otherKey}!`);

                  const stateSnapshotA = createExecutionStateSnapshot(
                    blocks,
                    i,
                    [spriteKey]
                  );

                  const otherBlocks = spriteBlocks[otherKey] || [];
                  const otherIndex = executionStateRef.current[otherKey]?.blockIndex || 0;

                  const stateSnapshotB = createExecutionStateSnapshot(
                    otherBlocks,
                    otherIndex,
                    [otherKey]
                  );

                  setSpriteBlocks(prev => {
                    const updatedBlocks = { ...prev };
                    const blocksA = JSON.parse(JSON.stringify(prev[spriteKey] || []));
                    const blocksB = JSON.parse(JSON.stringify(prev[otherKey] || []));
                    
                    updatedBlocks[spriteKey] = blocksB;
                    updatedBlocks[otherKey] = blocksA;
                    
                    return updatedBlocks;
                  });

                  setSprites(prev => {
                    const updated = { ...prev };
                    const temp = updated[spriteKey];
                    updated[spriteKey] = { ...updated[otherKey] };
                    updated[otherKey] = { ...temp };
                    return updated;
                  });
                  
                  executionStateRef.current[spriteKey] = stateSnapshotB;
                  executionStateRef.current[otherKey] = stateSnapshotA;
                  
                  runTokenRef.current[spriteKey] = (runTokenRef.current[spriteKey] || 0) + 1;
                  runTokenRef.current[otherKey] = (runTokenRef.current[otherKey] || 0) + 1;

                  const collisionEvent = new CustomEvent('spriteCollision', {
                    detail: { spriteA: spriteKey, spriteB: otherKey }
                  });
                  window.dispatchEvent(collisionEvent);

                  animateSprite(spriteKey, runTokenRef.current[spriteKey]);
                  animateSprite(otherKey, runTokenRef.current[otherKey]);
                  return;
                }
              }
            }
          }
          await delay(moveDelay, stopRef);
          if (stopRef.current) return;
        }
      } else if (block.content[0] === "Turn ") {
        const direction = block.content[1];
        const degrees = block.content[2];
        let remaining = degrees;
        while (remaining > 0) {
          if (stopRef.current) return;
          if (runTokenRef.current[spriteKey] !== token) return;
          const step = Math.min(turnStep, remaining);
          angle += direction === "undo" ? -step : step;
          remaining -= step;
          setSprites((prev) => ({
            ...prev,
            [spriteKey]: { x, y, angle },
          }));
          await delay(turnDelay, stopRef);
          if (stopRef.current) return;
        }
      } else if (block.content[0] === "Say ") {
        setSprites((prev) => ({
          ...prev,
          [spriteKey]: { ...prev[spriteKey], say: block.content[1] },
        }));
        await delay((block.content[3] || 2) * 1000, stopRef);
        if (stopRef.current) return;
        setSprites((prev) => ({
          ...prev,
          [spriteKey]: { ...prev[spriteKey], say: null },
        }));
      } else if (block.content[0] === "Think ") {
        setSprites((prev) => ({
          ...prev,
          [spriteKey]: { ...prev[spriteKey], think: block.content[1] },
        }));
        await delay((block.content[3] || 2) * 1000, stopRef);
        if (stopRef.current) return;
        setSprites((prev) => ({
          ...prev,
          [spriteKey]: { ...prev[spriteKey], think: null },
        }));
      } else if (block.content[0] === "Go to x:") {
        x = block.content[1];
        y = block.content[3];
        const clamped = clampPosition(spriteKey, x, y);
        x = clamped.x;
        y = clamped.y;
        setSprites((prev) => ({
          ...prev,
          [spriteKey]: { x, y, angle },
        }));
        await delay(100, stopRef);
        if (stopRef.current) return;
      }
    }
  };

  const runBlocks = () => {
    stopRef.current = false;
    setIsRunning(true);

    if (!isRunning) {
      executionStateRef.current = {};
    }

    const keys = Object.keys(spriteBlocks);
    runningSpritesRef.current = keys.length;

    keys.forEach(spriteKey => {
      if (!executionStateRef.current[spriteKey]) {
        executionStateRef.current[spriteKey] = {
          blockIndex: 0,
          blocks: spriteBlocks[spriteKey] || []
        };
      }

      runTokenRef.current[spriteKey] = (runTokenRef.current[spriteKey] || 0) + 1;
      animateSprite(spriteKey, runTokenRef.current[spriteKey]);
    });
  };

  const stopBlocks = () => {
    stopRef.current = true;
    setIsRunning(false);

    executionStateRef.current = {};
  };

  const spriteKeys = Object.keys(sprites);
  if (spriteKeys.length === 0) {
    return (
      <div className="flex-1 h-full flex items-center justify-center text-gray-500 italic text-lg">
        Please add a sprite to get started.
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-auto p-4 border border-dashed border-gray-400 rounded"
      onDrop={spriteKeys.length === 0 ? undefined : (e) => {
        e.preventDefault();
        const blockData = e.dataTransfer.getData("block");
        if (blockData) {
          const block = JSON.parse(blockData);
          setSpriteBlocks((prev) => {
            let blocks = prev[activeSprite] || [];
            if (block.uid) {
              blocks = removeBlockByUid(blocks, block.uid);
            }
            return {
              ...prev,
              [activeSprite]: [
                ...blocks,
                block.uid
                  ? block
                  : {
                      ...block,
                      uid: Date.now() + Math.random(),
                      children: block.content[0] === "Repeat " ? [] : undefined
                    }
              ]
            };
          });
        }
      }}
      onDragOver={spriteKeys.length === 0 ? undefined : (e) => e.preventDefault()}
    >
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

      {activeSprite && (spriteBlocks[activeSprite] || []).length === 0 && (
        <p className="text-gray-500 italic">Drag blocks for {activeSprite}</p>
      )}

      {(spriteBlocks[activeSprite] || []).map((block, idx) => (
        <div
          key={block.uid}
          draggable
          onDragStart={e => {
            setDraggedBlockUid(block.uid);
            e.dataTransfer.setData("block", JSON.stringify(block));
          }}
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
          className={`flex flex-wrap items-center ${block.className} text-white px-2 py-1 my-2 text-sm rounded-xl shadow-sm ${dragOverIndex === idx ? "ring-2 ring-yellow-400" : ""}`}
        >
          {renderBlockContentWithInputs(
            block,
            (index, val) => updateBlock(block.uid, index, val),
            updateChildBlock,
            setSpriteBlocks,
            activeSprite,
            draggedBlockUid,
            setDraggedBlockUid,
            dragOverChildIdx,
            setDragOverChildIdx
          )}
          <button
            onClick={() => removeBlock(block.uid)}
            className="ml-auto bg-red-600 rounded px-2 py-1 text-white text-xs"
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

function isColliding(spriteA, spriteB, keyA, keyB) {
  const sizeA = spriteSizes[keyA] || { width: 50, height: 50 };
  const sizeB = spriteSizes[keyB] || { width: 50, height: 50 };

  const dx = spriteA.x - spriteB.x;
  const dy = spriteA.y - spriteB.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const radiusA = (sizeA.width + sizeA.height) / 4;
  const radiusB = (sizeB.width + sizeB.height) / 4;

  return distance < (radiusA + radiusB);
}

function createExecutionStateSnapshot(blocks, currentIndex = 0, path = []) {
  const snapshot = {
    blockIndex: currentIndex,
    blocks: JSON.parse(JSON.stringify(blocks)),
    nestedState: {}
  };
  
  if (currentIndex < blocks.length && blocks[currentIndex]?.content?.[0] === "Repeat ") {
    const repeatBlock = blocks[currentIndex];
    if (repeatBlock.children && repeatBlock.children.length > 0) {
      snapshot.nestedState = {
        repeatCounter: 0, 
        childIndex: 0,   
        childStates: repeatBlock.children.map((child, idx) => {
          if (child.content?.[0] === "Repeat ") {
            return createExecutionStateSnapshot([child], 0, [...path, currentIndex, idx]);
          }
          return null;
        }).filter(Boolean)
      };
    }
  }
  
  return snapshot;
}

