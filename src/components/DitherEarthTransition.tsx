'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';
import { ArrowUpRight, Globe2, Orbit, Users, Gamepad2 } from 'lucide-react';
import ProgressiveBlur from './ui/ProgressiveBlur';

export default function DitherEarthTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let earthMesh: THREE.Mesh;
    let stars: THREE.Points;
    let video: HTMLVideoElement | null = null;
    let videoTexture: THREE.VideoTexture | null = null;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 1.0);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        42,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      camera.position.set(0, 0, 6.8);

      // Deep space starry field
      const starsCount = 650;
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(starsCount * 3);
      for (let i = 0; i < starsCount * 3; i += 3) {
        starPos[i] = (Math.random() - 0.5) * 40;
        starPos[i + 1] = (Math.random() - 0.5) * 40;
        starPos[i + 2] = -4 - Math.random() * 22;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.06,
        transparent: true,
        opacity: 0.65,
      });
      stars = new THREE.Points(starGeo, starMat);
      scene.add(stars);

      // Live Earth Video Texture
      video = document.createElement('video');
      video.src = '/your-earth-video.mp4';
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = 'anonymous';
      video.play().catch(() => {});

      videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;

      // 8x8 Bayer Matrix High-Density Micro-Dither + Sci-Fi Glitch Shader
      const vertexShader = `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * viewMatrix * vec4(vPosition, 1.0);
        }
      `;

      const fragmentShader = `
        uniform sampler2D uTexture;
        uniform float uTime;
        uniform vec2 uResolution;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        float bayer8(vec2 p) {
          int x = int(mod(p.x, 8.0));
          int y = int(mod(p.y, 8.0));
          int m[64];
          m[0]=0;   m[1]=32;  m[2]=8;   m[3]=40;  m[4]=2;   m[5]=34;  m[6]=10;  m[7]=42;
          m[8]=48;  m[9]=16;  m[10]=56; m[11]=24; m[12]=50; m[13]=18; m[14]=58; m[15]=26;
          m[16]=12; m[17]=44; m[18]=4;  m[19]=36; m[20]=14; m[21]=46; m[22]=6;  m[23]=38;
          m[24]=60; m[25]=28; m[26]=52; m[27]=20; m[28]=62; m[29]=30; m[30]=54; m[31]=22;
          m[32]=3;  m[33]=35; m[34]=11; m[35]=43; m[36]=1;  m[37]=33; m[38]=9;  m[39]=41;
          m[40]=51; m[41]=19; m[42]=59; m[43]=27; m[44]=49; m[45]=17; m[46]=57; m[47]=25;
          m[48]=15; m[49]=47; m[50]=7;  m[51]=39; m[52]=13; m[53]=45; m[54]=5;  m[55]=37;
          m[56]=63; m[57]=31; m[58]=55; m[59]=23; m[60]=61; m[61]=29; m[62]=53; m[63]=21;

          int idx = y * 8 + x;
          for (int i = 0; i < 64; i++) {
            if (i == idx) return float(m[i]) / 64.0;
          }
          return 0.5;
        }

        void main() {
          vec2 uv = vUv;

          // DIGITAL GLITCH: periodic horizontal tearing jitter
          float glitchSpeed = floor(uTime * 9.0);
          float sliceRnd = fract(sin(dot(vec2(floor(gl_FragCoord.y * 0.1), glitchSpeed), vec2(12.9898, 78.233))) * 43758.5453);
          float isGlitch = step(0.92, sliceRnd) * step(0.45, fract(uTime * 0.9));
          if (isGlitch > 0.4) {
            uv.x += (sliceRnd - 0.5) * 0.12;
          }

          // CRT scanline wave
          float scanline = sin(gl_FragCoord.y * 1.8 + uTime * 3.5) * 0.08;

          // High-frequency latitude & longitude micro-grid ticks
          float latLines = step(0.95, sin(uv.y * 3.14159 * 32.0));
          float lonLines = step(0.95, sin(uv.x * 3.14159 * 64.0));
          float grid = max(latLines, lonLines) * 0.3;

          // Sample video texture
          vec4 tex = texture2D(uTexture, uv);
          float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));

          // Directional Sun lighting & terminator
          vec3 sunDir = normalize(vec3(0.9, 0.6, 0.8));
          float nDotL = max(dot(vNormal, sunDir), 0.0);
          float diffuse = pow(nDotL, 0.85);

          // Atmosphere rim fresnel
          vec3 viewDir = normalize(-vPosition);
          float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);

          float totalLum = (lum * diffuse + grid) * 1.35 + fresnel * 0.38 + scanline;

          // ULTRA-FINE MICRO-DITHER (scale 0.52 creates dense, tiny stipple dots)
          vec2 microDitherCoord = gl_FragCoord.xy * 0.52;
          float threshold = bayer8(microDitherCoord);
          float dither = step(threshold, totalLum);

          gl_FragColor = vec4(vec3(dither), 1.0);
        }
      `;

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTexture: { value: videoTexture },
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        },
      });

      // Smaller, compact, refined Earth (radius 1.15, NO rings)
      const geometry = new THREE.SphereGeometry(1.15, 80, 80);
      earthMesh = new THREE.Mesh(geometry, material);
      earthMesh.rotation.z = 23.4 * (Math.PI / 180); // Axial tilt
      scene.add(earthMesh);

    } catch (err) {
      console.warn('Three.js setup error:', err);
      return;
    }

    const handleResize = () => {
      if (!renderer || !camera) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    let targetProgress = 0;
    let currentProgress = 0;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      if (total <= 0) return;

      const scrolled = -rect.top;
      const p = THREE.MathUtils.clamp(scrolled / total, 0, 1);
      targetProgress = p;
      setScrollProgress(p);
    };

    let clock = new THREE.Clock();
    let continuousRotation = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Continuous axial rotation (always spinning)
      continuousRotation += delta * 0.35;

      // Smooth damped lerp for fluid igloo/lusion scroll feel
      currentProgress += (targetProgress - currentProgress) * 0.08;
      const t = currentProgress;

      if (earthMesh) {
        // Continuous orbital arc across the transition phase:
        // Starts on left (-3.2), arcs up across center to right (+3.0)
        const posX = -3.2 + t * 6.4;
        const arc = 4.0 * t * (1.0 - t);
        const posY = -1.3 + arc * 2.6;
        const posZ = -0.6 + arc * 1.2;

        earthMesh.position.set(posX, posY, posZ);

        // Continuous spin + scroll rotational momentum
        earthMesh.rotation.y = continuousRotation + t * Math.PI * 3.0;

        if ((earthMesh.material as THREE.ShaderMaterial).uniforms) {
          (earthMesh.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsed;
        }
      }

      if (videoTexture) {
        videoTexture.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    handleResize();
    handleScroll();
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
      renderer.dispose();
    };
  }, []);

  // Multi-page mission waypoints along the orbital trajectory
  const waypoints = [
    {
      id: '01',
      tag: 'MISSION BRIEF',
      title: 'About Space Apps',
      desc: 'Global hackathon solving challenges on Earth and in deep space.',
      link: '/about',
      icon: Globe2,
      start: 0.12,
      end: 0.34,
    },
    {
      id: '02',
      tag: 'OFFICIAL BRIEFS',
      title: 'NASA Challenges',
      desc: '20+ problem statements spanning astrophysics, climate & AI.',
      link: '/challenges',
      icon: Orbit,
      start: 0.35,
      end: 0.58,
    },
    {
      id: '03',
      tag: 'MISSION CREW',
      title: 'Organizing Team',
      desc: 'Meet the community leads, mentors and judges in Lucknow.',
      link: '/team',
      icon: Users,
      start: 0.59,
      end: 0.80,
    },
    {
      id: '04',
      tag: 'SIMULATION & TIME',
      title: 'Retro Astro Game',
      desc: 'Fly your astronaut through deep space & view event timeline.',
      link: '/game',
      icon: Gamepad2,
      start: 0.81,
      end: 0.94,
    },
  ];

  // Progressive blur fadeout into Page 2 (About section)
  const exitBlurOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.88) / 0.12));

  return (
    <div
      ref={containerRef}
      className="dither-earth-filler-phase relative w-full"
      style={{
        height: '320vh', // Dedicated transition stage connecting all pages
        background: '#000000',
        zIndex: 5,
      }}
    >
      <style>{`
        @keyframes glitchFlicker {
          0% { opacity: 0.9; transform: translate(0); }
          15% { opacity: 0.4; transform: translate(-2px, 1px); }
          30% { opacity: 1; transform: translate(1px, -1px); }
          85% { opacity: 0.8; transform: translate(0); }
          90% { opacity: 0.3; transform: translate(-1px, -2px); }
          100% { opacity: 0.9; transform: translate(0); }
        }
        .hud-glitch {
          animation: glitchFlicker 3s infinite;
        }
      `}</style>

      {/* Top Progressive Blur (Defocuses Hero as you descend into orbital flight) */}
      <ProgressiveBlur
        direction="top"
        height="260px"
        maxBlur={32}
        steps={8}
        className="z-20 pointer-events-none"
      />

      {/* Pinned Fullscreen Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-black">
        {/* Three.js Canvas: Smaller, rotating, fine-dithered Earth (NO ring) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        />

        {/* Real-Time Telemetry HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none p-6 md:p-12 flex flex-col justify-between font-mono text-white/80 select-none z-10 hud-glitch">
          <div className="flex justify-between items-center text-xs tracking-widest uppercase border-b border-white/20 pb-3">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              ORBITAL TRANSIT NEXUS // LEO-28.5°
            </span>
            <span className="text-[10px] text-white/60">
              ALT: {(416.0 + Math.sin(scrollProgress * Math.PI) * 12.0).toFixed(1)} KM
            </span>
          </div>

          <div className="flex justify-between items-end text-xs tracking-widest uppercase border-t border-white/20 pt-3">
            <span className="text-[10px] text-white/50">SCROLL TO TRANSIT MISSION SECTORS</span>
            <span className="text-white font-bold">{Math.round(scrollProgress * 100)}%</span>
          </div>
        </div>

        {/* Interactive Mission Waypoints Connecting ALL Pages (About, Challenges, Team, Game) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 p-4">
          {waypoints.map((wp) => {
            const isVisible = scrollProgress >= wp.start && scrollProgress < wp.end;
            const Icon = wp.icon;
            return (
              <div
                key={wp.id}
                className="absolute max-w-sm w-full p-6 bg-black/85 border border-white/25 rounded-xl backdrop-blur-xl transition-all duration-300"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
                  pointerEvents: isVisible ? 'auto' : 'none',
                  boxShadow: '0 0 35px rgba(255, 255, 255, 0.08)',
                }}
              >
                <div className="flex items-center justify-between text-xs text-white/60 font-mono mb-2 uppercase tracking-widest">
                  <span className="text-white font-bold">{wp.id} // {wp.tag}</span>
                  <Icon size={16} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide">{wp.title}</h3>
                <p className="text-xs text-white/70 leading-relaxed mb-4">{wp.desc}</p>
                <Link
                  href={wp.link}
                  className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-black bg-white px-4 py-2 rounded-lg hover:bg-white/80 transition-colors"
                >
                  Enter Sector <ArrowUpRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Exit Progressive Blur: Smoothly hands off to Page 2 (About Section) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200 z-30"
          style={{
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            opacity: exitBlurOpacity,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.95) 100%)',
          }}
        />
      </div>
    </div>
  );
}
