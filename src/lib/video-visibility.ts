/** Preserve playback position while avoiding work for offscreen or hidden video. */
export function observeVideoVisibility(video: HTMLVideoElement) {
  let inView = true;
  const update = () => {
    if (document.hidden || !inView) video.pause();
    else if (video.paused) void video.play().catch(() => {});
  };
  const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    update();
  });
  observer?.observe(video);
  document.addEventListener("visibilitychange", update);
  update();
  return () => {
    observer?.disconnect();
    document.removeEventListener("visibilitychange", update);
    video.pause();
  };
}
