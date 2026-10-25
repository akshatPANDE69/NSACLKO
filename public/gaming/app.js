/**
 * NASA Space Apps Challenge Lucknow — Gaming Subevent
 * Client Controller & Interactivity
 */

let userManuallyMutedHero = false;
let heroMutedBeforeModal = false;
let updateHeroAudioUI = null;
let startHeroVideoPlayback = null;

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initHeroVideo();
  initMobileMenu();
  initNavScrollSpy();
  initModalHandlers();
  initModalAudioToggle();
});

/* =============================================================
   0. MISSION CONTROL PRELOADER & ASSET BUFFERING
   ============================================================= */

function initPreloader() {
  const preloader = document.getElementById('preloader');

  if (!preloader) return;

  const manifest = [
    { id: 'hero', type: 'video', url: 'hero%20section/hero%20video.mp4' },
    { id: 'fifa', type: 'video', url: 'game%20card%20/fifa.mp4' },
    { id: 'tekken', type: 'video', url: 'game%20card%20/tekken.mp4' },
    { id: 'mk', type: 'video', url: 'game%20card%20/mortal%20kombat.mp4' },
    { id: 'bgmi', type: 'video', url: 'game%20card%20/bgmi.mp4' },
    { id: 'cod', type: 'video', url: 'game%20card%20/cod.mp4' },
    { id: 'freefire', type: 'video', url: 'game%20card%20/free%20fire.mp4' },
    { id: 'logo', type: 'image', url: 'assets/space_apps_logo.png' },
    { id: 'img_fifa', type: 'image', url: 'assets/card_fifa.jpg' },
    { id: 'img_tekken', type: 'image', url: 'assets/card_tekken.jpg' },
    { id: 'img_mk', type: 'image', url: 'assets/card_mk.jpg' },
    { id: 'img_bgmi', type: 'image', url: 'assets/card_bgmi.jpg' },
    { id: 'img_cod', type: 'image', url: 'assets/card_cod.jpg' },
    { id: 'img_freefire', type: 'image', url: 'assets/card_freefire.jpg' }
  ];

  let loadedCount = 0;
  const total = manifest.length;
  let isDone = false;
  const startTime = Date.now();
  const minDisplayTime = 1600;

  function completePreloader() {
    if (isDone) return;
    isDone = true;

    const elapsed = Date.now() - startTime;
    const remainingWait = Math.max(0, minDisplayTime - elapsed);

    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 700);

      // Trigger hero video playback now that arena is revealed
      if (typeof startHeroVideoPlayback === 'function') {
        startHeroVideoPlayback();
      }
    }, remainingWait);
  }

  // Safety fallback timeout (12s max)
  setTimeout(() => {
    if (!isDone) completePreloader();
  }, 12000);

  // Preload all manifest items concurrently
  manifest.forEach(async (item) => {
    try {
      if (item.type === 'video') {
        const res = await fetch(item.url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        if (gameIntel[item.id]) {
          gameIntel[item.id].blobUrl = blobUrl;
        } else if (item.id === 'hero') {
          window.heroBlobUrl = blobUrl;
          const hero = document.getElementById('heroVideo');
          if (hero) hero.src = blobUrl;
        }
      } else if (item.type === 'image') {
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = item.url;
        });
      }
    } catch (err) {
      console.warn('Preload fallback for ' + item.url, err);
    } finally {
      loadedCount++;
      if (loadedCount >= total && !isDone) {
        completePreloader();
      }
    }
  });
}

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
  const sections = ['home', 'games', 'registration', 'schedule', 'faq'];

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
    video: 'game%20card%20/fifa.mp4',
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
    video: 'game%20card%20/tekken.mp4',
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
    video: 'game%20card%20/mortal%20kombat.mp4',
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
    video: 'game%20card%20/bgmi.mp4',
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
    video: 'game%20card%20/cod.mp4',
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
    video: 'game%20card%20/free%20fire.mp4',
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

function openGameModal(gameKey) {
  const modal = document.getElementById('gameModal');
  const content = document.getElementById('gameModalContent');
  const modalVideo = document.getElementById('modalVideo');
  const modalPoster = document.getElementById('modalPoster');
  const modalScroll = document.getElementById('gameModalScroll');
  const data = gameIntel[gameKey];

  if (!modal || !content || !data) return;

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

  content.innerHTML = `
    <h3 class="modal-title">${data.title}</h3>
    <div class="modal-subtitle">${data.subtitle}</div>
    
    <div class="modal-specs">
      ${data.specs.map(s => `
        <div class="spec-item">
          <span>${s.label}</span>
          <b>${s.val}</b>
        </div>
      `).join('')}
    </div>

    <h4 class="modal-rules-heading">OFFICIAL BRACKET REGULATIONS</h4>
    <ul class="modal-rules-list">
      ${data.rules.map(r => `<li>${r}</li>`).join('')}
    </ul>

    <div class="modal-action-row">
      <button class="btn-submit" onclick="selectGameAndScroll('${gameKey}')">
        <span>REGISTER FOR THIS TITLE</span>
        <span class="chevron-gold">&gt;</span>
      </button>
    </div>
  `;

  if (modalScroll) {
    modalScroll.scrollTop = 0;
  }

  requestAnimationFrame(() => {
    modal.classList.add('active');
  });
  document.body.style.overflow = 'hidden';
}

function closeGameModal() {
  const modal = document.getElementById('gameModal');
  const modalVideo = document.getElementById('modalVideo');
  if (modal) {
    modal.classList.remove('active');
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

function selectGameAndScroll(gameKey) {
  closeGameModal();
  const select = document.getElementById('regGame');
  if (select) {
    select.value = gameKey;
  }
  const regSection = document.getElementById('registration');
  if (regSection) {
    regSection.scrollIntoView({ behavior: 'smooth' });
  }
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

function handleFormSubmit(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('submitBtn');
  const feedback = document.getElementById('formFeedback');

  if (!submitBtn || !feedback) return;

  const originalContent = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span>TRANSMITTING CREDENTIALS...</span>';
  submitBtn.disabled = true;

  const token = 'LKO-' + Math.random().toString(36).substring(2, 7).toUpperCase();

  setTimeout(() => {
    feedback.className = 'form-feedback success';
    feedback.innerHTML = `✓ REGISTRATION CONFIRMED! Your tournament token is <b>#${token}</b>. Check your inbox for room keys and Discord link.`;

    submitBtn.innerHTML = '<span>✓ REGISTERED</span>';

    setTimeout(() => {
      const form = document.getElementById('regForm');
      if (form) form.reset();
      submitBtn.innerHTML = originalContent;
      submitBtn.disabled = false;
    }, 4000);
  }, 800);
}

// Global scope bindings for inline HTML handlers
window.openGameModal = openGameModal;
window.closeGameModal = closeGameModal;
window.selectGameAndScroll = selectGameAndScroll;
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

  // If preloader is absent or already dismissed, start playback directly
  const preloaderEl = document.getElementById('preloader');
  if (!preloaderEl || preloaderEl.style.display === 'none') {
    startHeroVideoPlayback();
  }

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

