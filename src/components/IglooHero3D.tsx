/**
 * src/components/IglooHero3D.tsx
 *
 * A lightweight, interactive 3D hero component inspired by igloo.inc.
 * It renders a breathing, rotating geodesic crystal using plain Canvas 2D
 * (no heavy three.js dependency) and displays orbiting telemetry badges.
 *
 * Usage (Next.js):
 *   import IglooHero3D from '@/components/IglooHero3D';
 *   <IglooHero3D />
 */

'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';/* ---------- 3D Math helpers ---------- */
type Vec3 = [number, number, number];

const rotateX = (v: Vec3, a: number): Vec3 => {
  const [x, y, z] = v;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return [x, y * cos - z * sin, y * sin + z * cos];
};

const rotateY = (v: Vec3, a: number): Vec3 => {
  const [x, y, z] = v;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return [x * cos + z * sin, y, -x * sin + z * cos];
};

const rotateZ = (v: Vec3, a: number): Vec3 => {
  const [x, y, z] = v;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return [x * cos - y * sin, x * sin + y * cos, z];
};

/* ---------- Icosahedron (geodesic sphere) data ---------- */
// Vertices of a unit icosahedron
const PHI = (1 + Math.sqrt(5)) / 2;
const VERTICES: Vec3[] = [
  [-1,  PHI, 0],
  [ 1,  PHI, 0],
  [-1, -PHI, 0],
  [ 1, -PHI, 0],

  [0, -1,  PHI],
  [0,  1,  PHI],
  [0, -1, -PHI],
  [0,  1, -PHI],

  [ PHI, 0, -1],
  [ PHI, 0,  1],
  [-PHI, 0, -1],
  [-PHI, 0,  1],
];

// Edges (pairs of vertex indices)
const EDGES: [number, number][] = [
  [0, 1], [0, 5], [0, 7], [0,10], [0,11],
  [1, 5], [1, 7], [1, 8], [1, 9],
  [2, 3], [2, 4], [2, 6], [2,10], [2,11],
  [3, 4], [3, 6], [3, 8], [3, 9],
  [4, 5], [4, 9], [4,11],
  [5, 9], [5,11],
  [6, 7], [6, 8], [6,10],
  [7, 8], [7,10],
  [8, 9],
  [10,11],
];

/* ---------- Component ---------- */
const IglooHero3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotation state (radians)
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const rotVel = useRef({ x: 0, y: 0 }); // angular velocity
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Hover tilt target
  const hoverTarget = useRef({ x: 0, y: 0 });

  // Resize handling
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setSize({ w: clientWidth, h: clientHeight });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  /* ---------- Mouse interaction ---------- */
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) {
      // hover tilt (small)
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      hoverTarget.current = { x: dy * 0.2, y: -dx * 0.2 };
      return;
    }
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    const speed = 0.005;
    rotVel.current.x += dy * speed;
    rotVel.current.y += dx * speed;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseUp = () => {
    isDragging.current = false;
  };
  const onMouseLeave = () => {
    isDragging.current = false;
    hoverTarget.current = { x: 0, y: 0 };
  };
  const onMouseEnter = (e: React.MouseEvent) => {
    // reset hover target
    hoverTarget.current = { x: 0, y: 0 };
  };

  /* ---------- Animation loop ---------- */
  const animate = useCallback(() => {
    // Apply inertia + friction
    const friction = 0.92;
    rotVel.current.x *= friction;
    rotVel.current.y *= friction;

    // Apply hover target as a spring
    const spring = 0.08;
    rotVel.current.x += (hoverTarget.current.x - rotVel.current.x) * spring;
    rotVel.current.y += (hoverTarget.current.y - rotVel.current.y) * spring;

    // Update rotation angles
    setRotX((prev) => prev + rotVel.current.x);
    setRotY((prev) => prev + rotVel.current.y);

    // Draw
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w, h } = size;
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);

    // Settings
    const fov = w; // simple perspective factor
    const scale = Math.min(w, h) * 0.22; // size of object
    const time = performance.now() / 1000;

    // Breathing factor
    const breath = 1 + 0.04 * Math.sin(time * 2);

    // Transform vertices
    const transformed: { x: number; y: number; z: number }[] = VERTICES.map((v) => {
      let p = v as Vec3;
      // breathing (scale from center)
      p = [p[0] * breath, p[1] * breath, p[2] * breath];
      // rotate
      p = rotateX(p, rotX);
      p = rotateY(p, rotY);
      // perspective projection
      const z = p[2] + 3; // move object away from camera
      const factor = fov / (fov + z);
      const x = p[0] * factor * scale + w / 2;
      const y = -p[1] * factor * scale + h / 2;
      return { x, y, z };
    });

    // Draw edges with gradient glow
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 12;
    ctx.shadowColor = 'rgba(0,255,255,0.6)';

    // Create a linear gradient that follows the line direction
    const drawEdge = (i0: number, i1: number) => {
      const a = transformed[i0];
      const b = transformed[i1];
      const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      grad.addColorStop(0, 'rgba(0,255,255,0.9)'); // cyan
      grad.addColorStop(0.5, 'rgba(0,180,255,0.7)'); // blue
      grad.addColorStop(1, 'rgba(255,255,255,0.9)'); // white
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    };

    // Sort edges by average depth for simple painter's algorithm
    const sortedEdges = [...EDGES].sort((e1, e2) => {
      const z1 = (transformed[e1[0]].z + transformed[e1[1]].z) / 2;
      const z2 = (transformed[e2[0]].z + transformed[e2[1]].z) / 2;
      return z2 - z1; // farthest first
    });

    sortedEdges.forEach(([i0, i1]) => drawEdge(i0, i1));

    requestAnimationFrame(animate);
  }, [rotX, rotY, size]);

  useEffect(() => {
    requestAnimationFrame(animate);
    // cleanup not needed because animation stops when component unmounts
  }, [animate]);

  /* ---------- HUD Badges ---------- */
  const badges = [
    'LUCKNOW 2026 · HYBRID',
    'NOV 14–15 · 48H SPRINT',
    '109 INNOVATORS REGISTERED',
    '14 NASA CHALLENGE TRACKS',
  ];

  return (
    <div
      ref={containerRef}
      className="igloo-hero-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '60vh',
        minHeight: '400px',
        overflow: 'hidden',
        background: 'transparent',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: isDragging.current ? 'grabbing' : 'grab',
        }}
      />
      {/* Orbiting badges */}
      {badges.map((text, idx) => (
        <div
          key={idx}
          className="igloo-hero-badge border border-cyan-400/40"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `rotate(${(idx * 90)}deg) translate(0, -180px) rotate(${-idx * 90}deg)`,
            animation: `orbit ${20 + idx * 5}s linear infinite`,
            animationDelay: `${idx * -2}s`,
            whiteSpace: 'nowrap',
            padding: '4px 8px',
            background: 'rgba(0,0,0,0.6)',
            color: '#e0f8ff',
            fontSize: '0.85rem',
            borderRadius: '4px',
            backdropFilter: 'blur(4px)',
          }}
        >
          {text}
        </div>
      ))}

      {/* CSS keyframes for orbit (inlined for self‑contain) */}
      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translate(0, -180px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translate(0, -180px) rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default IglooHero3D;