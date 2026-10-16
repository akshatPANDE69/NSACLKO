'use client';

import { useEffect, useRef } from 'react';

const DitherOverlay = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 128, H = 128;
    canvas.width = W;
    canvas.height = H;

    const bayer: number[][] = [
      [ 0,32, 8,40, 2,34,10,42],
      [48,16,56,24,50,18,58,26],
      [12,44, 4,36,14,46, 6,38],
      [60,28,52,20,62,30,54,22],
      [ 3,35,11,43, 1,33, 9,41],
      [51,19,59,27,49,17,57,25],
      [15,47, 7,39,13,45, 5,37],
      [63,31,55,23,61,29,53,21],
    ];

    let frameCount = 0;
    let animId: number;

    const render = () => {
      frameCount++;
      if (frameCount % 4 === 0) {
        const imageData = ctx.createImageData(W, H);
        const d = imageData.data;
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const i = (y * W + x) * 4;
            const noise = Math.random() * 255;
            const threshold = (bayer[y % 8][x % 8] / 64) * 255;
            const v = noise > threshold ? 255 : 0;
            d[i] = d[i+1] = d[i+2] = v;
            d[i+3] = 255;
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }
      animId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        opacity: 0.04,
        imageRendering: 'pixelated',
      }}
    />
  );
};

export default DitherOverlay;
