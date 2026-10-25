'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// ─── Shaders ─────────────────────────────────────────────────────────────────

const vert = /* glsl */`
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPos;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vWorldPos = (modelMatrix * vec4(position,1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}`;

const frag = /* glsl */`
uniform float uTime;
uniform float uGlitch;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPos;

float bayer(vec2 p) {
  int x=int(mod(p.x,8.0)); int y=int(mod(p.y,8.0));
  float v=0.0;
  if(y==0){if(x==0)v=0.;else if(x==1)v=32.;else if(x==2)v=8.;else if(x==3)v=40.;else if(x==4)v=2.;else if(x==5)v=34.;else if(x==6)v=10.;else v=42.;}
  else if(y==1){if(x==0)v=48.;else if(x==1)v=16.;else if(x==2)v=56.;else if(x==3)v=24.;else if(x==4)v=50.;else if(x==5)v=18.;else if(x==6)v=58.;else v=26.;}
  else if(y==2){if(x==0)v=12.;else if(x==1)v=44.;else if(x==2)v=4.;else if(x==3)v=36.;else if(x==4)v=14.;else if(x==5)v=46.;else if(x==6)v=6.;else v=38.;}
  else if(y==3){if(x==0)v=60.;else if(x==1)v=28.;else if(x==2)v=52.;else if(x==3)v=20.;else if(x==4)v=62.;else if(x==5)v=30.;else if(x==6)v=54.;else v=22.;}
  else if(y==4){if(x==0)v=3.;else if(x==1)v=35.;else if(x==2)v=11.;else if(x==3)v=43.;else if(x==4)v=1.;else if(x==5)v=33.;else if(x==6)v=9.;else v=41.;}
  else if(y==5){if(x==0)v=51.;else if(x==1)v=19.;else if(x==2)v=59.;else if(x==3)v=27.;else if(x==4)v=49.;else if(x==5)v=17.;else if(x==6)v=57.;else v=25.;}
  else if(y==6){if(x==0)v=15.;else if(x==1)v=47.;else if(x==2)v=7.;else if(x==3)v=39.;else if(x==4)v=13.;else if(x==5)v=45.;else if(x==6)v=5.;else v=37.;}
  else{if(x==0)v=63.;else if(x==1)v=31.;else if(x==2)v=55.;else if(x==3)v=23.;else if(x==4)v=61.;else if(x==5)v=29.;else if(x==6)v=53.;else v=21.;}
  return v/64.0;
}

float h(vec3 p){p=fract(p*0.3183099+0.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float n3(vec3 p){
  vec3 i=floor(p);vec3 f=fract(p);f=f*f*(3.0-2.0*f);
  return mix(
    mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
    mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float fbm(vec3 p){float v=0.;float a=0.5;vec3 pp=p;for(int i=0;i<5;i++){v+=a*n3(pp);pp=pp*2.0+vec3(1.7,9.2,5.1);a*=0.5;}return v;}

void main(){
  vec2 uv=vUv;
  if(uGlitch>0.5){
    float band=floor(uv.y*24.0);
    float rnd=fract(sin(band*127.1+uTime*12.0)*43758.5);
    if(rnd>0.72) uv.x+=sin(uTime*6.0+uv.y*24.0)*0.025;
  }
  vec3 lDir=normalize(vec3(-1.2,1.0,1.5));
  float nDotL=max(dot(vNormal,lDir),0.0);
  float lit=clamp(fbm(vWorldPos*2.0+vec3(uTime*0.04,0,0))*(nDotL+0.3)+0.1,0.0,1.0);
  float thr=bayer(gl_FragCoord.xy);
  float dith=step(thr,lit);
  float dark=step(0.04,nDotL);
  gl_FragColor=vec4(vec3(dith*dark),1.0);
}`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function EarthTransition({ className = '' }: { className?: string }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const hudRef      = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);

  // Three.js refs (persist across renders)
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    earth: THREE.Mesh;
    mat: THREE.ShaderMaterial;
    animId: number;
    clock: THREE.Clock;
    spinY: number;
    glitchTimer: number;
    glitchVal: number;
    lastGlitch: number;
  } | null>(null);

  // Scroll progress ref
  const progressRef = useRef(0);
  const activeRef   = useRef(false);
  const exitingRef  = useRef(false);

  // ── Three.js init ──────────────────────────────────────────────────────────
  const initThree = () => {
    const canvas = canvasRef.current;
    if (!canvas || threeRef.current) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 7);

    // Stars
    const sp = new Float32Array(300 * 3);
    for (let i = 0; i < 900; i += 3) {
      const r  = 25 + Math.random() * 60;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      sp[i]   = r * Math.sin(ph) * Math.cos(th);
      sp[i+1] = r * Math.sin(ph) * Math.sin(th);
      sp[i+2] = r * Math.cos(ph);
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.08 })));

    // Earth
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uGlitch: { value: 0 } },
      vertexShader: vert,
      fragmentShader: frag,
    });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(0.88, 80, 80), mat);
    earth.rotation.z = 23.4 * Math.PI / 180;
    scene.add(earth);

    const clock = new THREE.Clock();

    const animate = () => {
      const r = threeRef.current;
      if (!r) return;
      r.animId = requestAnimationFrame(animate);

      const dt = r.clock.getDelta();
      const t  = r.clock.getElapsedTime();
      r.spinY += dt * 0.3;

      // Random glitch
      if (t - r.lastGlitch > 1.0 + Math.random() * 2.0) {
        r.glitchVal  = 1;
        r.lastGlitch = t;
        r.glitchTimer = t;
      }
      if (r.glitchVal === 1 && t - r.glitchTimer > 0.08) {
        r.glitchVal = 0;
      }

      const p = progressRef.current;

      // Quadratic bezier arc: p0=(-3.5,-1.5,0), p1=(0,2.2,0), p2=(3.5,-1.5,0)
      const px = (1-p)*(1-p)*(-3.5) + 2*(1-p)*p*(0) + p*p*(3.5);
      const py = (1-p)*(1-p)*(-1.5) + 2*(1-p)*p*(2.2) + p*p*(-1.5);
      const pz = 0;

      r.earth.position.set(px, py, pz);
      r.earth.rotation.y = r.spinY + p * Math.PI * 2;

      r.mat.uniforms.uTime.value   = t;
      r.mat.uniforms.uGlitch.value = r.glitchVal;

      // HUD update
      if (hudRef.current) {
        const pct = (p * 100).toFixed(2).padStart(5, '0');
        hudRef.current.textContent = `T+${pct}`;
      }

      r.renderer.render(r.scene, r.camera);
    };

    threeRef.current = { renderer, scene, camera, earth, mat, animId: 0, clock, spinY: 0, glitchTimer: 0, glitchVal: 0, lastGlitch: 0 };
    animate();
  };

  const destroyThree = () => {
    const r = threeRef.current;
    if (!r) return;
    cancelAnimationFrame(r.animId);
    r.renderer.dispose();
    threeRef.current = null;
  };

  const handleResize = () => {
    const r = threeRef.current;
    if (!r) return;
    r.renderer.setSize(window.innerWidth, window.innerHeight);
    r.camera.aspect = window.innerWidth / window.innerHeight;
    r.camera.updateProjectionMatrix();
  };

  // ── Activation / Deactivation ─────────────────────────────────────────────
  const activate = () => {
    if (activeRef.current) return;
    activeRef.current = true;
    exitingRef.current = false;
    progressRef.current = 0;

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    setVisible(true);
    // Fade in after next paint
    requestAnimationFrame(() => setOpacity(1));
    initThree();
  };

  const deactivate = () => {
    // Fade out
    setOpacity(0);
    exitingRef.current = true;

    setTimeout(() => {
      activeRef.current = false;
      exitingRef.current = false;
      progressRef.current = 0;
      setVisible(false);
      destroyThree();

      // Restore scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';

      // Scroll past sentinel so it doesn't re-trigger immediately
      const el = sentinelRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        window.scrollBy({ top: rect.top + 10, behavior: 'instant' });
      }
    }, 500);
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    // IntersectionObserver — fires when sentinel scrolls into view
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !activeRef.current && !exitingRef.current) {
          activate();
        }
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);

    // Wheel handler — drives progress when overlay is active
    const onWheel = (e: WheelEvent) => {
      if (!activeRef.current || exitingRef.current) return;
      e.preventDefault();
      e.stopPropagation();

      progressRef.current = Math.min(1, progressRef.current + e.deltaY / 2800);
      if (progressRef.current >= 1) {
        deactivate();
      }
    };

    // Touch support
    let lastTouchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (!activeRef.current) return;
      lastTouchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!activeRef.current || exitingRef.current) return;
      e.preventDefault();
      const dy = lastTouchY - e.touches[0].clientY;
      lastTouchY = e.touches[0].clientY;
      progressRef.current = Math.min(1, progressRef.current + dy / 1200);
      if (progressRef.current >= 1) deactivate();
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', handleResize);
      destroyThree();
      // Restore scroll in case of unmount during active
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Invisible sentinel — just a position marker in the document flow */}
      <div
        ref={sentinelRef}
        className={className}
        aria-hidden="true"
        style={{ height: '1px', overflow: 'hidden', visibility: 'hidden', pointerEvents: 'none' }}
      />

      {/* Fullscreen fixed overlay — completely outside normal flow, ignores all parent CSS */}
      {visible && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#000',
            opacity,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'all',
            fontFamily: "'Courier New', Courier, monospace",
          }}
        >
          {/* Three.js canvas */}
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
          />

          {/* CRT scanlines */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
            }}
          />

          {/* HUD */}
          <div
            style={{
              position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              padding: '28px 36px',
            }}
          >
            {/* Top bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                ORBITAL TRANSIT
              </span>
              <span ref={hudRef} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '0.18em' }}>
                T+00.00
              </span>
            </div>

            {/* Bottom bar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase' }}>
                SCROLL TO CONTINUE ↓
              </span>
              <span style={{
                display: 'block', height: '1px', background: 'rgba(255,255,255,0.45)',
                animation: 'scanPulse 2s ease-in-out infinite',
              }} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scanPulse {
          0%, 100% { width: 32px; opacity: 0.4; }
          50%       { width: 72px; opacity: 0.9; }
        }
      `}</style>
    </>
  );
}
