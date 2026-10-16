'use client';

import * as React from 'react';

interface InfinityPortalProps {
  className?: string;
  style?: React.CSSProperties;
  particleCount?: number;
}

const VERTEX_SHADER = `#version 300 es
precision highp float;

in vec2 a_position;
in vec2 a_texCoord;
in float a_offset;
in float a_phase;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

out vec2 v_texCoord;
out float v_offset;
out float v_phase;

void main() {
  v_texCoord = a_texCoord;
  v_offset = a_offset;
  v_phase = a_phase;
  
  // Calculate position on infinity curve (lemniscate)
  float t = a_offset * 6.28318530718 + u_time * 0.5 + a_phase;
  float sin_t = sin(t);
  float cos_t = cos(t);
  float sin_squared = sin_t * sin_t;
  
  // Lemniscate of Bernoulli / infinity symbol parametric equations
  float denominator = 1.0 + sin_squared;
  float x = cos_t / denominator;
  float y = sin_t * cos_t / denominator;
  
  // Scale and position
  vec2 position = vec2(x, y) * 0.3;
  
  // Apply mouse parallax effect
  vec2 mouseNorm = (u_mouse - vec2(0.5)) * 0.2;
  position += mouseNorm;
  
  // Convert to clip space
  vec2 clipSpace = position * 2.0;
  clipSpace.y *= u_resolution.y / u_resolution.x;
  
  gl_Position = vec4(clipSpace, 0.0, 1.0);
  gl_PointSize = 2.0;
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 v_texCoord;
in float v_offset;
in float v_phase;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

out vec4 outColor;

// Constants for colors
#define TAU 6.28318530718

// Noise function for organic movement
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  vec2 n = i + f * vec2(16.0, 16.0);
  vec3 o = fract(n * vec2(5.0, 5.0) + vec2(1.0, 1.0));
  o = -0.5 + 2.0 * fract(o * o * (o * vec2(3.0, 3.0) + vec2(2.0, 2.0)));
  return dot(f, o * vec2(-100.0, 100.0));
}

// FBM (fractional brownian motion) for detailed noise
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// Dither pattern (Bayer 4x4)
const uint bayer4[16] = uint[](
  0u,  8u,  2u, 10u,
 12u,  4u, 14u,  6u,
  3u, 11u,  1u,  9u,
 15u,  7u, 13u,  5u
);

float bayerDither(vec2 uv) {
  vec2 bayerUV = fract(uv * vec2(4.0));
  int x = int(bayerUV.x * 4.0);
  int y = int(bayerUV.y * 4.0);
  int index = y * 4 + x;
  return float(bayer4[index]) / 15.0;
}

// Main color function for the infinity curve glow
vec3 curveColor(float offset, float time, vec2 mouse) {
  // Base colors: cyan, deep blue, violet
  vec3 cyan = vec3(0.0, 0.94, 1.0);
  vec3 deepBlue = vec3(0.0, 0.33, 1.0);
  vec3 violet = vec3(0.66, 0.33, 1.0);
  
  // Time-based color shifting
  float t = offset * 2.0 + time * 0.3;
  float r = sin(t * 0.5) * 0.5 + 0.5;
  float g = sin(t * 0.5 + 2.0) * 0.5 + 0.5;
  float b = sin(t * 0.5 + 4.0) * 0.5 + 0.5;
  
  vec3 baseColor = mix(cyan, mix(deepBlue, violet, r), g);
  
  // Add glow intensity based on offset (creates trailing effect)
  float glow = 1.0 - abs(offset - 0.5) * 2.0;
  glow = pow(glow, 2.0);
  
  // Add subtle noise for organic feel
  float noiseVal = fbm(vec2(offset * 10.0, time * 0.5)) * 0.2;
  
  return baseColor * (glow + noiseVal);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  
  // Calculate current position on curve for this fragment
  float t = v_offset * TAU + u_time * 0.5 + v_phase;
  float sin_t = sin(t);
  float cos_t = cos(t);
  float sin_squared = sin_t * sin_t;
  float denominator = 1.0 + sin_squared;
  float x = cos_t / denominator;
  float y = sin_t * cos_t / denominator;
  
  // Distance from current fragment to curve point
  vec2 curvePos = vec2(x, y) * 0.3;
  vec2 mouseNorm = (u_mouse - vec2(0.5)) * 0.2;
  curvePos += mouseNorm;
  vec2 clipSpace = curvePos * 2.0;
  clipSpace.y *= u_resolution.y / u_resolution.x;
  vec2 posNDC = clipSpace; // Already in [-1, 1] range
  
  vec2 fragNDC = uv * 2.0 - 1.0;
  fragNDC.y *= u_resolution.y / u_resolution.x;
  
  float dist = length(fragNDC - posNDC);
  
  // Create the curve with glow
  float alpha = smoothstep(0.01, 0.005, dist);
  alpha *= 0.8 + 0.2 * sin(u_time * 3.0 + v_offset * 10.0); // Pulsing
  
  // Apply dithering for retro/futuristic look
  float dither = bayerDither(gl_FragCoord.xy);
  float threshold = 0.5 + sin(u_time * 0.5) * 0.1;
  float ditherAlpha = step(threshold - dither * 0.2, alpha);
  
  // Get base color
  vec3 color = curveColor(v_offset, u_time, u_mouse);
  
  // Add particle head brightness
  float headBrightness = smoothstep(0.008, 0.002, dist);
  vec3 headColor = color * 2.0; // Brighter head
  
  // Combine trail and head
  vec3 finalColor = mix(color, headColor, headBrightness);
  
  // Apply alpha
  finalColor *= alpha * ditherAlpha;
  
  // Add subtle vignette
  float vignette = 1.0 - length(uv - 0.5) * 0.8;
  finalColor *= vignette;
  
  outColor = vec4(finalColor, alpha * ditherAlpha);
}
`;

function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${info}`);
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string): WebGLProgram {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link error: ${info}`);
  }
  return program;
}

export function InfinityPortal({
  className = '',
  style,
  particleCount = 150,
}: InfinityPortalProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [fallbackMode, setFallbackMode] = React.useState(false);
  const uniformsRef = React.useRef<{
    uResolution: WebGLUniformLocation;
    uTime: WebGLUniformLocation;
    uMouse: WebGLUniformLocation;
  } | null>(null);
  const isHoveredRef = React.useRef(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      setFallbackMode(true);
      return;
    }

    let program: WebGLProgram;
    let vao: WebGLVertexArrayObject;
    let positionBuffer: WebGLBuffer;
    let texCoordBuffer: WebGLBuffer;
    let offsetBuffer: WebGLBuffer;
    let phaseBuffer: WebGLBuffer;
    let animationFrameId: number;
    let lastTime = performance.now();
    let elapsed = 0;

    const mouse = { x: 0.5, y: 0.5 };
    const targetMouse = { x: 0.5, y: 0.5 };
    const damping = 0.08;

    try {
      program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    } catch {
      setFallbackMode(true);
      return;
    }

    // Create particle data
    const count = Math.min(particleCount, 300);
    const positions = new Float32Array(count * 2);
    const texCoords = new Float32Array(count * 2);
    const offsets = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Position in quad space (will be transformed in shader)
      positions[i * 2] = (i % 2 === 0) ? -1 : 1;
      positions[i * 2 + 1] = (Math.floor(i / 2) % 2 === 0) ? -1 : 1;
      
      // Tex coords
      texCoords[i * 2] = i % 2 === 0 ? 0 : 1;
      texCoords[i * 2 + 1] = Math.floor(i / 2) % 2 === 0 ? 0 : 1;
      
      // Offset along curve (0-1)
      offsets[i] = i / (count - 1);
      
      // Phase offset for varied motion
      phases[i] = Math.random() * Math.PI * 2;
    }

    // Setup VAO and buffers
    vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);

    positionBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    texCoordBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    const texLoc = gl.getAttribLocation(program, 'a_texCoord');
    gl.enableVertexAttribArray(texLoc);
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

    offsetBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.STATIC_DRAW);
    const offsetLoc = gl.getAttribLocation(program, 'a_offset');
    gl.enableVertexAttribArray(offsetLoc);
    gl.vertexAttribPointer(offsetLoc, 1, gl.FLOAT, false, 0, 0);

    phaseBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, phaseBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, phases, gl.STATIC_DRAW);
    const phaseLoc = gl.getAttribLocation(program, 'a_phase');
    gl.enableVertexAttribArray(phaseLoc);
    gl.vertexAttribPointer(phaseLoc, 1, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);

    // Get uniform locations
    const uResolution = gl.getUniformLocation(program, 'u_resolution')!;
    const uTime = gl.getUniformLocation(program, 'u_time')!;
    const uMouse = gl.getUniformLocation(program, 'u_mouse')!;
    uniformsRef.current = { uResolution, uTime, uMouse };

    const resizeHandler = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
    };

    const mouseEnterHandler = () => {
      isHoveredRef.current = true;
    };

    const mouseLeaveHandler = () => {
      isHoveredRef.current = false;
    };

    window.addEventListener('resize', resizeHandler);
    window.addEventListener('mousemove', mouseMoveHandler);
    canvas.addEventListener('mouseenter', mouseEnterHandler);
    canvas.addEventListener('mouseleave', mouseLeaveHandler);
    resizeHandler();

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);

      const delta = time - lastTime;
      lastTime = time;
      elapsed += delta * 0.001;

      // Update mouse with damping
      mouse.x += (targetMouse.x - mouse.x) * damping;
      mouse.y += (targetMouse.y - mouse.y) * damping;

      // Hover effect: speed up and intensify
      const speedFactor = isHoveredRef.current ? 2.0 : 1.0;

      gl.clearColor(0.01, 0.01, 0.02, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.bindVertexArray(vao);

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed * speedFactor);
      gl.uniform2f(uMouse, mouse.x, mouse.y);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.bindVertexArray(null);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('mousemove', mouseMoveHandler);
      canvas.removeEventListener('mouseenter', mouseEnterHandler);
      canvas.removeEventListener('mouseleave', mouseLeaveHandler);
      cancelAnimationFrame(animationFrameId);

      gl.deleteProgram(program);
      gl.deleteVertexArray(vao);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(texCoordBuffer);
      gl.deleteBuffer(offsetBuffer);
      gl.deleteBuffer(phaseBuffer);
    };
  }, [particleCount]);

  if (fallbackMode) {
    return (
      <div
        className={className}
        style={{
          ...style,
          position: 'relative',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, #001122 0%, #000011 70%, #000000 100%)',
          overflow: 'hidden',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
            <div className="text-2xl font-mono tracking-wider">
              LAT 26.8467° N<br/>
              LON 80.9462° E
            </div>
            <div className="mt-4 text-xs text-[#a855f7]/50">
              NASA Space Apps Lucknow 2026
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        ...style,
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'block',
        background: 'radial-gradient(circle at center, #000812 0%, #000000 100%)',
      }}
      aria-hidden="true"
    />
  );
}

export default InfinityPortal;