/**
 * NASA Space Apps Challenge Lucknow — Gaming Subevent
 * Client Controller & Interactivity
 */

let userManuallyMutedHero = false;
let heroMutedBeforeModal = false;
let updateHeroAudioUI = null;
let startHeroVideoPlayback = null;
const registrationStates = new WeakMap();
const gameModalPanels = new Map();
let modalOpener = null;

document.addEventListener('DOMContentLoaded', () => {
  initHeroVideo();
  initModalHandlers();
  initModalAudioToggle();
});


/* =============================================================
   1. MOBILE MENU TOGGLE
   ============================================================= */

function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('navMenu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  menu.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (menu.classList.contains('open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* =============================================================
   2. NAV SCROLL SPY
   ============================================================= */

function initNavScrollSpy() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = ['home', 'games', 'schedule', 'faq'];

  window.addEventListener('scroll', () => {
    let current = 'home';
    const scrollPos = window.scrollY + 120;

    sections.forEach(secId => {
      const el = document.getElementById(secId);
      if (el && el.offsetTop <= scrollPos) {
        current = secId;
      }
    });

    navItems.forEach(item => {
      const href = item.getAttribute('href').replace('#', '');
      if (href === current) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });
}

/* =============================================================
   3. GAME BRIEFING MODAL DATA & HANDLERS
   ============================================================= */

const gameIntel = {
  fifa: {
    title: 'FIFA / EA FC 25',
    subtitle: 'CONSOLE 1V1 • PLAYSTATION 5 PODS',
    video: 'game%20card/fifa.mp4',
    poster: 'assets/card_fifa.jpg',
    specs: [
      { label: 'MATCH DURATION', val: '6 Mins / Half' },
      { label: 'DEFENDING', val: 'Tactical Only' },
      { label: 'BRACKET', val: 'Single Elimination' }
    ],
    rules: [
      'Standard 95-rated or Overall Balanced clubs mode for pure competitive parity.',
      'Tactical defending is mandatory. Legacy defending is strictly disabled in options.',
      'Drawn matches proceed directly to extra time and penalty shootouts.',
      'Official PS5 DualSense controllers provided on-site. Personal controllers permitted after referee inspection.'
    ]
  },
  tekken: {
    title: 'TEKKEN 8',
    subtitle: 'CONSOLE 1V1 • IRON FIST ARENA',
    video: 'game%20card/tekken.mp4',
    poster: 'assets/card_tekken.jpg',
    specs: [
      { label: 'MATCH FORMAT', val: 'Best of 3 Rounds' },
      { label: 'BRACKET TYPE', val: 'Double Elimination' },
      { label: 'STAGE PICK', val: 'Random Game 1' }
    ],
    rules: [
      'Standard 60-second round timer with official tournament damage settings.',
      'Winner retains character; loser may counter-pick character or request random stage.',
      'Leverless hitboxes, fightsticks, and DualSense pads fully permitted (no hardware macros).',
      'Accidental pause during an active match yields current round to opponent.'
    ]
  },
  mk: {
    title: 'MORTAL KOMBAT 1',
    subtitle: 'CONSOLE 1V1 • NEXT-GEN KOMBAT',
    video: 'game%20card/mortal%20kombat.mp4',
    poster: 'assets/card_mk.jpg',
    specs: [
      { label: 'MATCH FORMAT', val: 'First to 2 (Finals FT3)' },
      { label: 'BRACKET TYPE', val: 'Single Elimination' },
      { label: 'KAMEOS', val: 'All Standard Allowed' }
    ],
    rules: [
      'Fatalities & Brutalities fully allowed to conclude matches.',
      'Winner must keep same main fighter and Kameo; loser may counter-pick.',
      'Default tournament control settings and stage variations.',
      'Hardware inspection required before entering the tournament pod.'
    ]
  },
  bgmi: {
    title: 'BGMI CLASH SQUAD',
    subtitle: 'MOBILE 4V4 • MULTIPLAYER BATTLEGROUND',
    video: 'game%20card/bgmi.mp4',
    poster: 'assets/card_bgmi.jpg',
    specs: [
      { label: 'ROUNDS TO WIN', val: 'First to 7 Rounds' },
      { label: 'MAP POOL', val: 'Warehouse / Hangar' },
      { label: 'HARDWARE', val: 'Smartphones Only' }
    ],
    rules: [
      'Custom room credentials dispatched directly to squad captains via official Discord.',
      'BYOD handheld smartphones only. Strictly no iPads, tablets, triggers, or PC emulators.',
      'Standard TDM competitive loadouts. Flare gun or terrain glitch exploitation results in immediate DQ.',
      'Winning squad leader must submit end-game screenshot to the tournament desk.'
    ]
  },
  cod: {
    title: 'CALL OF DUTY MULTIPLAYER',
    subtitle: 'MOBILE 5V5 • TACTICAL OPERATOR COMBAT',
    video: 'game%20card/cod.mp4',
    poster: 'assets/card_cod.jpg',
    specs: [
      { label: 'GAME MODES', val: 'Search & Destroy / HP' },
      { label: 'ROUNDS TO WIN', val: 'First to 7 (S&D)' },
      { label: 'MAP POOL', val: 'Summit, Standoff, Firing Range' }
    ],
    rules: [
      'Competitive ban list strictly enforced (restricted scorestreaks & operator skills per CDL ruleset).',
      'Touchscreen handhelds only; no Bluetooth external controllers allowed for the mobile bracket.',
      'Squads must report to the lobby 10 minutes prior to scheduled phase call.',
      'If a player disconnects before first blood, room restarts once.'
    ]
  },
  freefire: {
    title: 'FREE FIRE CLASH SQUAD',
    subtitle: 'MOBILE 4V4 • SURVIVAL ROUND ECONOMY',
    video: 'game%20card/free%20fire.mp4',
    poster: 'assets/card_freefire.jpg',
    rotate: true,
    specs: [
      { label: 'ROUNDS TO WIN', val: 'First to 7 Rounds' },
      { label: 'MAP POOL', val: 'Bermuda CS' },
      { label: 'GUN ATTRIBUTES', val: 'Disabled (Pure Skill)' }
    ],
    rules: [
      'Gun Properties and Skin Attributes disabled in custom room settings for 100% fair competitive play.',
      'Handheld mobile smartphones only. No emulators or modified third-party APKs.',
      'Standard coin economy and character abilities active.',
      'Zone glitching or camping out of bounds yields automatic round forfeit.'
    ]
  }
};

function gameRegistrationMarkup(gameKey) {
  if (!Object.hasOwn(gameIntel, gameKey)) return '';
  const data = gameIntel[gameKey];
  const squadSize = { bgmi: 4, cod: 5, freefire: 4 }[gameKey];
  const field = (name, label, type, attributes) => `
    <div class="input-field">
      <label for="${gameKey}-${name}">${label}</label>
      <input id="${gameKey}-${name}" name="${name}" type="${type}" ${attributes}>
    </div>`;
  return `
    <section class="modal-registration" aria-labelledby="${gameKey}-terminal-title">
      <div class="terminal-heading">
        <span class="terminal-kicker">REGISTRATION TERMINAL</span>
        <h4 id="${gameKey}-terminal-title">${data.title}</h4>
        <p>${squadSize ? `Register your ${squadSize}-player squad. Enter the squad leader's contact details below.` : 'Enter your player details for this 1v1 tournament.'} Fields marked * are required.</p>
      </div>
      <form class="registration-form" onsubmit="handleFormSubmit(event)">
        <input type="hidden" name="game" value="${gameKey}">
        <div class="input-grid">
          ${field('name', squadSize ? 'SQUAD LEADER NAME *' : 'PLAYER NAME *', 'text', 'required maxlength="100" autocomplete="name"')}
          ${field('alias', 'IN-GAME ALIAS / GAMERTAG *', 'text', 'required maxlength="80" autocomplete="off"')}
        </div>
        <div class="input-grid">
          ${field('email', 'EMAIL ADDRESS *', 'email', 'required maxlength="254" autocomplete="email"')}
          ${field('phone', 'PHONE / WHATSAPP *', 'tel', 'required maxlength="32" autocomplete="tel"')}
        </div>
        ${squadSize ? `
          ${field('team', 'TEAM NAME', 'text', 'maxlength="100" autocomplete="off"')}
          <div class="input-field">
            <label for="${gameKey}-roster">SQUAD ROSTER &amp; IN-GAME UIDS</label>
            <textarea id="${gameKey}-roster" name="roster" rows="3" maxlength="2000" placeholder="List your ${squadSize} players and their in-game UIDs"></textarea>
          </div>` : ''}
        <div class="form-feedback" data-form-feedback aria-live="polite" aria-atomic="true"></div>
        <button type="submit" class="btn-submit">
          <span>REGISTER FOR ${data.title}</span><span class="chevron-gold" aria-hidden="true">&gt;</span>
        </button>
        <p class="reg-data-note">Your details are stored privately for the Lucknow organising team to manage tournament entries and contact you. Registration does not guarantee a place. To correct or remove an entry, email <a href="mailto:nasaspaceappschallenge.lucknow@gmail.com">nasaspaceappschallenge.lucknow@gmail.com</a>.</p>
      </form>
    </section>`;
}

function openGameModal(gameKey) {
  const modal = document.getElementById('gameModal');
  const content = document.getElementById('gameModalContent');
  const modalVideo = document.getElementById('modalVideo');
  const modalPoster = document.getElementById('modalPoster');
  const modalScroll = document.getElementById('gameModalScroll');
  const data = Object.hasOwn(gameIntel, gameKey) ? gameIntel[gameKey] : null;

  if (!modal || !content || !data) return;
  if (!modal.classList.contains('active')) modalOpener = document.activeElement;

  // Hero section continues looping uninterrupted; mute audio temporarily so modal audio is clear
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    heroMutedBeforeModal = heroVideo.muted;
    heroVideo.muted = true;
    if (heroVideo.paused) heroVideo.play().catch(() => {});
  }

  // Video Background Controller
  if (modalVideo) {
    if (data.rotate) {
      modalVideo.classList.add('rotate-horizontal');
    } else {
      modalVideo.classList.remove('rotate-horizontal');
    }
    if (data.video) {
      modalVideo.style.display = 'block';
      modalVideo.src = data.blobUrl || data.video;
      modalVideo.loop = true;
      modalVideo.currentTime = 0;
      modalVideo.muted = false; // Opens up with audio
      modalVideo.volume = 0.85;
      modalVideo.play().catch(() => {});
      if (modalPoster) modalPoster.style.display = 'none';
    } else {
      modalVideo.pause();
      modalVideo.removeAttribute('src');
      modalVideo.style.display = 'none';
      if (modalPoster) {
        modalPoster.style.backgroundImage = `url('${data.poster}')`;
        modalPoster.style.display = 'block';
      }
    }
  }

  // Set modal audio toggle button to unmuted state by default
  const audioBtn = document.getElementById('modalAudioToggle');
  if (audioBtn) {
    audioBtn.classList.remove('muted');
    audioBtn.style.display = data.video ? 'flex' : 'none';
    audioBtn.setAttribute('title', 'Mute Game Sound');
    audioBtn.setAttribute('aria-label', 'Mute Game Sound');
    audioBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
  }

  let panel = gameModalPanels.get(gameKey);
  if (!panel) {
    panel = document.createElement('div');
    panel.className = 'modal-game-content';
    panel.innerHTML = `
    <h3 class="modal-title" id="${gameKey}-modal-title">${data.title}</h3>
    <div class="modal-subtitle">${data.subtitle}</div>
    
    <div class="modal-specs">
      ${data.specs.map(s => `
        <div class="spec-item">
          <span>${s.label}</span>
          <b>${s.val}</b>
        </div>
      `).join('')}
    </div>

    <details class="modal-rules">
      <summary>TOURNAMENT RULES</summary>
      <ul class="modal-rules-list">
        ${data.rules.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </details>
    ${gameRegistrationMarkup(gameKey)}
  `;
    gameModalPanels.set(gameKey, panel);
    content.append(panel);
  }
  // Keep each game's draft and pending receipt in its own DOM panel.
  for (const [key, gamePanel] of gameModalPanels) gamePanel.hidden = key !== gameKey;
  modal.setAttribute('aria-labelledby', `${gameKey}-modal-title`);

  if (modalScroll) {
    modalScroll.scrollTop = 0;
  }

  requestAnimationFrame(() => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('.btn-close-modal')?.focus({ preventScroll: true });
  });
  document.body.style.overflow = 'hidden';
}

function closeGameModal() {
  const modal = document.getElementById('gameModal');
  const modalVideo = document.getElementById('modalVideo');
  if (modal) {
    if (modal.classList.contains('active')) modalOpener?.focus({ preventScroll: true });
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  if (modalVideo) {
    modalVideo.classList.remove('rotate-horizontal');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
  }
  // Restore hero video audio & ensure hero continues uninterrupted on loop
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    heroVideo.muted = userManuallyMutedHero ? true : heroMutedBeforeModal;
    if (typeof updateHeroAudioUI === 'function') {
      updateHeroAudioUI(heroVideo.muted);
    }
    if (heroVideo.paused) heroVideo.play().catch(() => {});
  }
}

function initModalAudioToggle() {
  const btn = document.getElementById('modalAudioToggle');
  const video = document.getElementById('modalVideo');
  if (!btn || !video) return;

  const svgUnmuted = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`;

  const svgMuted = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </svg>`;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    if (video.muted) {
      btn.classList.add('muted');
      btn.setAttribute('title', 'Unmute Game Sound');
      btn.setAttribute('aria-label', 'Unmute Game Sound');
      btn.innerHTML = svgMuted;
    } else {
      btn.classList.remove('muted');
      btn.setAttribute('title', 'Mute Game Sound');
      btn.setAttribute('aria-label', 'Mute Game Sound');
      btn.innerHTML = svgUnmuted;
    }
  });
}

function initModalHandlers() {
  const modal = document.getElementById('gameModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeGameModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeGameModal();
    }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches?.('.game-card')) {
      e.preventDefault();
      openGameModal(e.target.dataset.game);
    }
    if (e.key === 'Tab' && modal?.classList.contains('active')) {
      const controls = Array.from(modal.querySelectorAll('button, a[href], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])')).filter(control => !control.disabled && control.getClientRects().length);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
  });
}

/* =============================================================
   4. FAQ ACCORDION TOGGLE
   ============================================================= */

function toggleFaq(button) {
  const card = button.closest('.faq-card');
  if (!card) return;

  const isOpen = card.classList.contains('open');
  document.querySelectorAll('.faq-card').forEach(c => c.classList.remove('open'));

  if (!isOpen) {
    card.classList.add('open');
  }
}

/* =============================================================
   5. REGISTRATION FORM SUBMISSION
   ============================================================= */

async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  if (!form) return;
  const state = registrationStates.get(form) || { busy: false, attempt: null };
  if (state.busy) return;
  registrationStates.set(form, state);
  const submitBtn = form.querySelector('[type="submit"]');
  const feedback = form.querySelector('[data-form-feedback]');
  if (!form || !submitBtn || !feedback || !form.reportValidity()) return;
  const value = name => form.elements.namedItem(name)?.value.trim() || '';
  const details = { name: value('name'), alias: value('alias'), email: value('email'), phone: value('phone'), game: value('game'), team: value('team'), roster: value('roster') };
  const signature = JSON.stringify({ ...details, email: details.email.toLowerCase() });
  const originalContent = submitBtn.innerHTML;
  state.busy = true;
  submitBtn.textContent = 'SAVING REGISTRATION...';
  submitBtn.disabled = true;
  feedback.className = 'form-feedback';
  feedback.textContent = '';
  try {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(signature));
    const fingerprint = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
    const storageKey = `esports:pending:${fingerprint}`;
    if (!state.attempt || state.attempt.signature !== signature) {
      let key;
      try { key = sessionStorage.getItem(storageKey); } catch { /* Storage can be unavailable in private browsers. */ }
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key || '')) key = crypto.randomUUID();
      state.attempt = { signature, key, storageKey };
    }
    // Store only a random request key indexed by a digest, never form details.
    try { sessionStorage.setItem(storageKey, state.attempt.key); } catch { /* Same-page retry still works. */ }
    const response = await fetch('/api/tournaments/registrations', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...details, key: state.attempt.key }),
      signal: AbortSignal.timeout(20000)
    });
    const result = await response.json();
    if (!response.ok || !/^LKO-[A-F0-9]{16}$/.test(result.reference)) {
      throw new Error(result.error || 'Your registration could not be saved. Please try again.');
    }
    feedback.className = 'form-feedback success';
    feedback.setAttribute('role', 'status');
    feedback.textContent = `Registration received. Your reference is ${result.reference}. Keep it for organiser queries. Your tournament place is subject to confirmation.`;
    form.reset();
    try { sessionStorage.removeItem(state.attempt.storageKey); } catch { /* No registration details are stored here. */ }
    state.attempt = null;
  } catch (error) {
    feedback.className = 'form-feedback error';
    feedback.setAttribute('role', 'alert');
    feedback.textContent = error.name === 'TimeoutError' || error.name === 'AbortError' || error instanceof TypeError
      ? 'We could not confirm your registration. Your details are still here. Please try again.'
      : error.message;
  } finally {
    state.busy = false;
    submitBtn.innerHTML = originalContent;
    submitBtn.disabled = false;
  }
}

// Global scope bindings for inline HTML handlers
window.openGameModal = openGameModal;
window.closeGameModal = closeGameModal;
window.toggleFaq = toggleFaq;
window.handleFormSubmit = handleFormSubmit;

/* =============================================================
   6. FULLSCREEN HERO VIDEO & AUDIO CONTROLLER
   ============================================================= */

function initHeroVideo() {
  const video = document.getElementById('heroVideo');
  const audioBtn = document.getElementById('audioToggleBtn');

  if (!video || !audioBtn) return;

  const svgUnmuted = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`;

  const svgMuted = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
      <line x1="22" y1="9" x2="16" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="16" y1="9" x2="22" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`;

  // Expose global updater so modal open/close can sync hero audio UI
  updateHeroAudioUI = function(isMuted) {
    if (isMuted) {
      audioBtn.innerHTML = svgMuted;
      audioBtn.classList.add('muted');
      audioBtn.setAttribute('title', 'Unmute Sound');
      audioBtn.setAttribute('aria-label', 'Unmute Sound');
    } else {
      audioBtn.innerHTML = svgUnmuted;
      audioBtn.classList.remove('muted');
      audioBtn.setAttribute('title', 'Mute Sound');
      audioBtn.setAttribute('aria-label', 'Mute Sound');
    }
  };

  // Ensure video starts from 0:00 (from starting) when page loads
  video.currentTime = 0;
  video.loop = true;

  video.addEventListener('loadedmetadata', () => {
    video.currentTime = 0;
  });

  // Guarantee hero section never stops and loops continuously
  video.addEventListener('ended', () => {
    video.currentTime = 0;
    video.play().catch(() => {});
  });

  // Audio level default: open with sound
  video.volume = 0.85;
  video.muted = false;

  // Unmute on the very first user interaction anywhere on the document
  const unmuteOnFirstGesture = () => {
    if (!userManuallyMutedHero) {
      video.muted = false;
      video.volume = 0.85;
      video.play().catch(() => {});
      updateHeroAudioUI(false);
    }
    ['click', 'pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
      window.removeEventListener(evt, unmuteOnFirstGesture, true);
    });
  };

  ['click', 'pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
    window.addEventListener(evt, unmuteOnFirstGesture, { once: true, capture: true });
  });

  // Playback triggered right when preloader completes
  startHeroVideoPlayback = function() {
    if (window.heroBlobUrl && video) {
      video.src = window.heroBlobUrl;
    }
    video.currentTime = 0;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        updateHeroAudioUI(false);
      }).catch(() => {
        video.muted = true;
        video.currentTime = 0;
        video.play().catch(() => {});
        updateHeroAudioUI(false);
      });
    }
  };

  // Start playback immediately
  startHeroVideoPlayback();

  // Audio button toggle: only switch off when user manually chooses
  audioBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userManuallyMutedHero = !video.muted;
    video.muted = !video.muted;
    if (!video.muted && video.paused) {
      video.play().catch(() => {});
    }
    updateHeroAudioUI(video.muted);
  });
}

// Ensure video restarts from 0:00 when entire window finishes loading
window.addEventListener('load', () => {
  const video = document.getElementById('heroVideo');
  if (video) {
    video.currentTime = 0;
    if (video.paused) {
      video.play().catch(() => {});
    }
  }
});

