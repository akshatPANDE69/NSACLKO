# Website performance

Keep the existing design and stars. The homepage hero alone becomes modestly taller. Esports retains its current hero dimensions and all six registration terminals.

- Preserve the preloader removal already present in main at 1bc5193.
- Fix Esports startup: muted autoplay, no metadata/window-load rewind, a poster from the actual video, and no concurrent hidden/offscreen video playback. Verify these behaviors with the actual controller in a browser-like test.
- Convert game artwork to smaller WebP copies, reserve image sizes and defer below-fold images. Preserve source files and the same visual content. Remove unused font downloads.
- Avoid drawing shared stars behind the fullscreen Esports iframe. Pause the homepage Earth video when offscreen or in a hidden tab. Keep the original visible scene unchanged.
- Make only the homepage hero about 10% taller. Verify laptop and mobile layouts, registration behavior, production build and existing tests. Review before publishing to the existing domain.

## Verification

- The six card images total 553,128 bytes versus 958,916 bytes for the originals, a 42% reduction, with identical pixel dimensions. Original artwork files and video files are retained.
- Both existing MP4s inspected already have their metadata before media data, so they were not repacked or reencoded. The 73,202-byte Esports poster comes from its actual first video frames.
- Production build, lint, typecheck, full npm test and JavaScript syntax checks passed. Media tests exercise muted startup, no load-time rewinds, offscreen/hidden playback, modal isolation, audio controls and homepage observer cleanup.
- Edge verified the homepage hero at 880px on desktop and 893.2px at a 375 by 812 phone viewport, with the original Earth video and stars present. The homepage Earth video paused offscreen and resumed on return. Phone layout had no horizontal overflow.
- Esports retained its 812px phone hero, opened without a preloader, used the new poster and WebP images, and deferred cards outside the initial area. Its BGMI terminal retained the registration fields, and the hero paused while the visible modal video played. No registrations were submitted. Checked browser error logs were empty.
- Fresh review found an Escape-with-no-popup mute-state bug. A regression reproduced it, an inactive-modal guard fixed it, and media plus registration controller tests passed again.
