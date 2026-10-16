import { Camera, Mesh, Program, Renderer, Sphere, Texture } from "ogl";

const vertex = `
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 p = modelViewMatrix * vec4(position, 1.0);
    vPosition = p.xyz;
    gl_Position = projectionMatrix * p;
  }
`;

const fragment = `
  precision highp float;
  uniform sampler2D earthMap;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 view = normalize(-vPosition);
    vec3 sun = normalize(vec3(-0.7, 0.6, 1.1));
    vec3 surface = texture2D(earthMap, vUv).rgb;
    float daylight = smoothstep(-0.25, 0.9, dot(normal, sun));
    float rim = pow(1.0 - max(dot(normal, view), 0.0), 3.0);
    vec3 color = surface * (0.12 + daylight * 0.98);
    color += vec3(0.05, 0.28, 0.58) * rim * (0.3 + daylight);
    gl_FragColor = vec4(color, 1.0);
  }
`;

/** One textured sphere, loaded only by the homepage. No continuous work offscreen. */
export function createEarthScene(container: HTMLElement, onReady: () => void, onError: () => void) {
  const canvas = document.createElement("canvas");
  const renderer = new Renderer({ canvas, alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio, 1.5), powerPreference: "low-power" });
  const gl = renderer.gl;
  const camera = new Camera(gl, { fov: 35 });
  camera.position.z = 3.65;
  const geometry = new Sphere(gl, { radius: 1, widthSegments: 64, heightSegments: 40 });
  const texture = new Texture(gl, { generateMipmaps: true });
  const program = new Program(gl, { vertex, fragment, uniforms: { earthMap: { value: texture } } });
  const earth = new Mesh(gl, { geometry, program });
  earth.rotation.set(0.12, -1.6, -0.16);
  canvas.setAttribute("aria-hidden", "true");
  container.append(canvas);

  let disposed = false;
  let loaded = false;
  let frame = 0;
  let last = 0;
  let animate = false;
  const render = () => renderer.render({ scene: earth, camera });
  const tick = (time: number) => {
    frame = 0;
    if (!animate || !loaded || disposed) return;
    // 30fps is enough for a slow decorative globe and saves work on mobile.
    if (time - last >= 1000 / 30) {
      earth.rotation.y += Math.min((time - last) / 1000, 0.05) * 0.075;
      last = time;
      render();
    }
    frame = requestAnimationFrame(tick);
  };
  const setAnimating = (next: boolean) => {
    animate = next;
    cancelAnimationFrame(frame);
    frame = 0;
    if (animate && loaded && !disposed) { last = performance.now(); frame = requestAnimationFrame(tick); }
  };
  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height || disposed) return;
    renderer.setSize(width, height);
    camera.perspective({ aspect: width / height });
    if (loaded) render();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();
  const image = new window.Image();
  image.onload = () => {
    if (disposed) return;
    texture.image = image;
    loaded = true;
    render();
    onReady();
    setAnimating(animate);
  };
  image.onerror = onError;
  image.src = "/images/earth-texture.jpg";
  const contextLost = (e: Event) => { e.preventDefault(); setAnimating(false); onError(); };
  canvas.addEventListener("webglcontextlost", contextLost);

  return {
    setAnimating,
    destroy() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      image.onload = image.onerror = null;
      canvas.removeEventListener("webglcontextlost", contextLost);
      geometry.remove();
      program.remove();
      gl.deleteTexture(texture.texture);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    },
  };
}
