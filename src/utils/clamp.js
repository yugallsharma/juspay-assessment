export const spriteSizes = {
  cat: { width: 60, height: 65 },
  dog: { width: 70, height: 70 },
  frog: { width: 60, height: 60 },
  tortoise: { width: 65, height: 65 },
};

export const containerSize = 400;

export function clampPosition(key, x, y, padding = 0) {
  const size = spriteSizes[key] || { width: 50, height: 50 };
  const minX = padding;
  const minY = padding;
  const maxX = containerSize - size.width - padding;
  const maxY = containerSize - size.height - padding;
  return {
    x: Math.max(minX, Math.min(x, maxX)),
    y: Math.max(minY, Math.min(y, maxY)),
  };
}