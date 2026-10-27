import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const script = await readFile(new URL('../public/gaming/app.js', import.meta.url), 'utf8');
const events = new Map();
const windowEvents = new Map();
let observerCallback;
let modalActive = false;
function video() {
  return { muted: true, paused: true, currentTime: 0, loop: false, src: '', events: new Map(),
    play() { this.paused = false; return Promise.resolve(); },
    pause() { this.paused = true; },
    addEventListener(name, callback) { this.events.set(name, callback); },
    getAttribute(name) { return this[name]; },
    removeAttribute(name) { this[name] = ''; },
    load() {}, classList: { remove() {} },
  };
}
const hero = video();
const modalVideo = video();
const audio = { innerHTML: '', classList: { add() {}, remove() {} }, attributes: {},
  setAttribute(name, value) { this.attributes[name] = value; },
  addEventListener(name, callback) { this[name] = callback; },
};
const elements = { heroVideo: hero, audioToggleBtn: audio, modalVideo,
  gameModal: { setAttribute() {}, classList: { contains: () => modalActive, remove() { modalActive = false; } } },
};
const document = { hidden: false, body: { style: {} }, getElementById: id => elements[id], addEventListener: (name, fn) => events.set(name, fn) };
const page = vm.createContext({ document,
  window: { addEventListener: (name, fn) => windowEvents.set(name, fn), removeEventListener() {} },
  IntersectionObserver: class { constructor(callback) { observerCallback = callback; } observe() {} },
});
vm.runInContext(script, page);
page.initHeroVideo();
assert.equal(hero.muted, true, 'First playback must stay muted so autoplay starts without a rejected audible attempt');
assert.equal(audio.attributes['aria-label'], 'Unmute Sound');
page.closeGameModal();
assert.equal(hero.muted, true, 'Escape without an open popup must not unmute the hero');
hero.currentTime = 7;
hero.events.get('loadedmetadata')?.();
windowEvents.get('load')?.();
assert.equal(hero.currentTime, 7, 'Loading images and fonts must not rewind a video that has already started');
observerCallback([{ isIntersecting: false }]);
assert.equal(hero.paused, true, 'An offscreen hero must stop decoding frames');
observerCallback([{ isIntersecting: true }]);
assert.equal(hero.paused, false);
modalActive = true;
modalVideo.src = 'game.mp4';
page.syncGameMediaPlayback();
assert.equal(hero.paused, true, 'Only the visible modal video should play while registering');
assert.equal(modalVideo.paused, false);
document.hidden = true;
events.get('visibilitychange')();
assert.equal(modalVideo.paused, true, 'Hidden tabs must not keep playing modal audio or video');
document.hidden = false;
modalActive = false;
events.get('visibilitychange')();
assert.equal(hero.paused, false);
assert.equal(modalVideo.paused, true);
assert.equal(hero.currentTime, 7, 'Resuming the hero must preserve playback position');
audio.click({ stopPropagation() {} });
assert.equal(hero.muted, false, 'The sound control must still work');
assert.equal(audio.attributes['aria-label'], 'Mute Sound');

const html = await readFile(new URL('../public/gaming/index.html', import.meta.url), 'utf8');
assert.doesNotMatch(html, /id="preloader"|preloader-overlay/);
assert.match(html, /poster="assets\/hero-poster.webp"/);
assert.equal((html.match(/loading="lazy"/g) || []).length, 6);

// Exercise the homepage observer against actual visibility events, including cleanup.
const { observeVideoVisibility } = await import('../src/lib/video-visibility.ts');
const visibilityListeners = new Set();
let homeObserver;
globalThis.document = { hidden: false,
  addEventListener: (name, fn) => visibilityListeners.add(fn),
  removeEventListener: (name, fn) => visibilityListeners.delete(fn),
};
globalThis.IntersectionObserver = class {
  constructor(callback) { this.callback = callback; homeObserver = this; }
  observe() {}
  disconnect() { this.disconnected = true; }
};
const earth = video();
earth.currentTime = 12;
const dispose = observeVideoVisibility(earth);
assert.equal(earth.paused, false);
homeObserver.callback([{ isIntersecting: false }]);
assert.equal(earth.paused, true);
globalThis.document.hidden = true;
homeObserver.callback([{ isIntersecting: true }]);
assert.equal(earth.paused, true, 'Returning onscreen in a hidden tab must not resume the Earth video');
globalThis.document.hidden = false;
for (const fn of visibilityListeners) fn();
assert.equal(earth.paused, false);
assert.equal(earth.currentTime, 12);
dispose();
assert.equal(earth.paused, true);
assert.equal(homeObserver.disconnected, true);
assert.equal(visibilityListeners.size, 0, 'Leaving the homepage must release visibility listeners');
delete globalThis.document;
delete globalThis.IntersectionObserver;
console.log('PASS media startup: muted autoplay, no load rewinds, offscreen and hidden pauses, modal isolation, sound controls and immediate poster');
