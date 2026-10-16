"use client";

import {
  useEffect,
  useRef,
  useCallback,
  MutableRefObject,
  CSSProperties,
} from "react";

type Vec2 = [number, number];

const canvasStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: -1,
};

const vertexShaderSrc = `#version 300 es
precision highp float;
layout (location = 0) in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSrc = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;          // normalized [0,1]
uniform vec2 u_mouseVel;       // normalized velocity

// ---------- Palette ----------
const vec3 navy   = vec3(0.00, 0.015, 0.16);   // #000428
const vec3 blue   = vec3(0.00, 0.31, 0.57);    // #004e92
const vec3 cyan   = vec3(0.00, 0.94, 1.00);    // #00f0ff
const vec3 white  = vec3(1.0, 1.0, 1.0);
const vec3 gold   = vec3(1.0, 0.82, 0.25);

// ---------- Utilities ----------
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 78.233);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  // Four corners
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  // Cubic interpolation
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// 8x8 Bayer matrix (0..63) normalized to [0,1]
float bayer8(vec2 p) {
  int x = int(mod(p.x, 8.0));
  int y = int(mod(p.y, 8.0));
  int index = (y << 3) + x;
  // Pre‑computed Bayer values
  const int b[64] = int[64](
     0, 32,  8, 40,  2, 34, 10, 42,
    48, 16, 56, 24, 50, 18, 58, 26,
    12, 44,  4, 36, 14, 46,  6, 38,
    60, 28, 52, 20, 62, 30, 54, 22,
     3, 35, 11, 43,  1, 33,  9, 41,
    51, 19, 59, 27, 49, 17, 57, 25,
    15, 47,  7, 39, 13, 45,  5, 37,
    63, 31, 55, 23, 61, 29, 53, 21
  );
  return float(b[index]) / 64.0;
}

// ---------- Ribbon layer ----------
float ribbon(vec2 uv, float offset, float speed, float amp, float freq) {
  float t = u_time * speed + offset;
  float wave = sin((uv.x + t) * freq) * amp;
  float fbmDistort = fbm(uv * freq * 1.5 + t) * 0.1;
  return smoothstep(0.0, 0.02, uv.y - (0.5 + wave + fbmDistort));
}

// ---------- Main ----------
void main() {
  vec2 uv = v_uv;
  vec2 pixelPos = uv * u_resolution;

  // Background gradient (navy -> blue)
  vec3 bg = mix(navy, blue, uv.y);

  // ---- Ribbons ----
  float left   = ribbon(uv, 0.0, 0.6, 0.12, 6.0);
  float center = ribbon(uv, 2.0, 0.8, 0.15, 8.0);
  float right  = ribbon(uv, 4.0, 0.5, 0.10, 5.0);
  float fine   = ribbon(uv, 1.5, 1.2, 0.05, 12.0);

  // Combine ribbons with palette colors
  vec3 col = bg;
  col = mix(col, cyan, left);
  col = mix(col, gold, center);
  col = mix(col, white, right);
  col = mix(col, cyan * 0.6, fine);

  // ---- Mouse interaction ----
  vec2 mouseUV = u_mouse;
  vec2 mouseDelta = u_mouseVel;
  float dist = length(uv - mouseUV);
  // Shockwave ripple
  float ripple = sin(20.0 * dist - u_time * 4.0);
  ripple *= smoothstep(0.0, 0.3, dist) * 0.3;
  col += ripple * vec3(0.8, 0.9, 1.0);

  // Glow around cursor (cyan + gold mix)
  float glow = exp(-dist * 30.0);
  col = mix(col, mix(cyan, gold, 0.5), glow * 0.6);

  // ---- Dithering (8x8 Bayer) ----
  float d = bayer8(pixelPos / 2.5);
  col += (d - 0.5) * 0.24;               // threshold offset
  col = floor(col * 8.0) / 8.0;          // quantize to 8 levels

  fragColor = vec4(col, 1.0);
}
`;

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const ok = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!ok) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${log}`);
  }
  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vsSource: string,
  fsSource: string
): WebGLProgram {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const prog = gl.createProgram();
  if (!prog) throw new Error("Unable to create program");
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  const ok = gl.getProgramParameter(prog, gl.LINK_STATUS);
  if (!ok) {
    const log = gl.getProgramInfoLog(prog);
    gl.deleteProgram(prog);
    throw new Error(`Program link error: ${log}`);
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return prog;
}

/**
 * Full‑screen WebGL canvas rendering a dithered aurora with mouse interaction.
 */
export interface DitherAuroraCanvasProps {
  className?: string;
  style?: CSSProperties;
}

export const DitherAuroraCanvas: React.FC<DitherAuroraCanvasProps> = ({ className = '', style }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef<Vec2>([0.5, 0.5]); // normalized
  const mouseVelRef = useRef<Vec2>([0, 0]);
  const lastMouseTimeRef = useRef<number>(0);
  const lastMousePosRef = useRef<Vec2>([0.5, 0.5]);

  // Resize handling
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
  }, []);

  // Mouse move tracking
  const onMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const now = performance.now();
    const dt = (now - lastMouseTimeRef.current) / 1000;
    const [lx, ly] = lastMousePosRef.current;
    const vx = dt > 0 ? (x - lx) / dt : 0;
    const vy = dt > 0 ? (y - ly) / dt : 0;
    // Dampen velocity to avoid spikes
    const damp = 0.9;
    mouseVelRef.current = [
      mouseVelRef.current[0] * damp + vx * (1 - damp),
      mouseVelRef.current[1] * damp + vy * (1 - damp),
    ];
    mousePosRef.current = [x, y];
    lastMousePosRef.current = [x, y];
    lastMouseTimeRef.current = now;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      console.error("WebGL2 not supported");
      return;
    }

    // Compile shaders & program
    const program = createProgram(gl, vertexShaderSrc, fragmentShaderSrc);
    gl.useProgram(program);

    // Full‑screen quad (two triangles)
    const vertices = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ]);
    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, "u_resolution")!;
    const uTime = gl.getUniformLocation(program, "u_time")!;
    const uMouse = gl.getUniformLocation(program, "u_mouse")!;
    const uMouseVel = gl.getUniformLocation(program, "u_mouseVel")!;

    let startTime = performance.now();

    const render = () => {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;

      resizeCanvas(); // keep DPI up‑to‑date each frame

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform2f(
        uResolution,
        gl.drawingBufferWidth,
        gl.drawingBufferHeight
      );
      gl.uniform1f(uTime, elapsed);
      const [mx, my] = mousePosRef.current;
      gl.uniform2f(uMouse, mx, my);
      const [vx, vy] = mouseVelRef.current;
      // Normalize velocity by screen size to keep it in [0,1] range
      gl.uniform2f(uMouseVel, vx / gl.drawingBufferWidth, vy / gl.drawingBufferHeight);

      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.bindVertexArray(null);

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    // Event listeners
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", onMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      gl.deleteProgram(program);
      gl.deleteBuffer(vbo);
      gl.deleteVertexArray(vao);
    };
  }, [resizeCanvas, onMouseMove]);

  return <canvas ref={canvasRef} className={className} style={{ ...canvasStyle, ...style }} />;
};

export default DitherAuroraCanvas;