// app/components/EffectsInitializer.tsx

"use client";

import { useEffect } from "react";

export default function EffectsInitializer() {
  useEffect(() => {
    // Enhanced intersection observer for different effect types
    const createIntersectionObserver = (
      callback: (entries: IntersectionObserverEntry[]) => void,
      options = {}
    ) => {
      const defaultOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      };

      return new IntersectionObserver(callback, {
        ...defaultOptions,
        ...options,
      });
    };

    // Fixed typing effect - maintains layout and prevents re-triggering
    function createTypingEffect(element: HTMLElement, speed = 50) {
      if (!element || element.dataset.typingStarted === "true") return;

      element.dataset.typingStarted = "true";
      const originalHTML = element.innerHTML;
      const textContent = element.textContent || element.innerText;

      // Store original computed styles to preserve exact layout
      const computedStyles = window.getComputedStyle(element);
      const originalStyles = {
        margin: computedStyles.margin,
        padding: computedStyles.padding,
        fontSize: computedStyles.fontSize,
        lineHeight: computedStyles.lineHeight,
        fontWeight: computedStyles.fontWeight,
        textAlign: computedStyles.textAlign,
        color: computedStyles.color,
        width: computedStyles.width,
        height: computedStyles.height,
        minHeight: computedStyles.minHeight,
        maxWidth: computedStyles.maxWidth,
        display: computedStyles.display,
        textTransform: computedStyles.textTransform,
        letterSpacing: computedStyles.letterSpacing,
      };

      // Calculate and reserve the space needed for the full content
      const tempElement = element.cloneNode(true) as HTMLElement;
      tempElement.style.visibility = "hidden";
      tempElement.style.position = "absolute";
      tempElement.style.top = "-9999px";
      tempElement.innerHTML = originalHTML;
      document.body.appendChild(tempElement);

      const fullHeight = tempElement.offsetHeight;
      const fullWidth = tempElement.offsetWidth;
      document.body.removeChild(tempElement);

      // Set fixed dimensions to prevent layout shift
      element.style.minHeight = `${fullHeight}px`;
      if (computedStyles.width === "auto" || !computedStyles.width) {
        element.style.width = `${fullWidth}px`;
      }

      // Process content into words while preserving structure
      const words: any[] = [];
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = originalHTML;

      function processNode(node: ChildNode, paragraphIndex = 0) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim();
          if (text) {
            const nodeWords = text
              .split(/\s+/)
              .filter((word) => word.length > 0);
            nodeWords.forEach((word, index) => {
              words.push({
                word,
                paragraphIndex,
                isLastInNode: index === nodeWords.length - 1,
                needsSpace: index < nodeWords.length - 1,
              });
            });
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (
            (node as HTMLElement).tagName === "P" ||
            (node as HTMLElement).tagName === "DIV" ||
            (node as HTMLElement).tagName === "BR"
          ) {
            paragraphIndex++;
          }
          node.childNodes.forEach((child) =>
            processNode(child, paragraphIndex)
          );
        }
      }

      processNode(tempDiv);
      element.innerHTML = "";
      element.style.opacity = "1";

      // Preserve all original element styles
      Object.assign(element.style, originalStyles);

      // Create container to maintain exact layout
      const contentContainer = document.createElement("div");
      contentContainer.style.cssText = `
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: ${originalStyles.display};
        text-align: ${originalStyles.textAlign};
        line-height: ${originalStyles.lineHeight};
        font-size: ${originalStyles.fontSize};
        font-weight: ${originalStyles.fontWeight};
        color: ${originalStyles.color};
        text-transform: ${originalStyles.textTransform};
        letter-spacing: ${originalStyles.letterSpacing};
      `;

      element.appendChild(contentContainer);

      const paragraphs: Record<number, HTMLElement> = {};
      if (words.length > 0) {
        const p = document.createElement("span");
        p.style.cssText = `
          margin: 0;
          padding: 0;
          display: inline;
          font-size: inherit;
          line-height: inherit;
          font-weight: inherit;
          text-align: inherit;
          color: inherit;
          text-transform: inherit;
          letter-spacing: inherit;
        `;
        contentContainer.appendChild(p);
        paragraphs[0] = p;
      }

      let wordIndex = 0;
      const cursor = document.createElement("span");
      cursor.textContent = "|";
      cursor.style.cssText = `
        animation: blink 1s infinite;
        margin-left: 2px;
        display: inline;
      `;

      if (!document.getElementById("cursor-blink-style")) {
        const style = document.createElement("style");
        style.id = "cursor-blink-style";
        style.textContent = `@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }`;
        document.head.appendChild(style);
      }

      function typeNextWord() {
        if (wordIndex >= words.length) {
          cursor.remove();
          return;
        }

        const currentWord = words[wordIndex];
        const targetParagraph = currentWord.paragraphIndex;

        if (!paragraphs[targetParagraph]) {
          const span = document.createElement("span");
          span.style.cssText = `
            margin: 0;
            padding: 0;
            display: inline;
            font-size: inherit;
            line-height: inherit;
            font-weight: inherit;
            text-align: inherit;
            color: inherit;
            text-transform: inherit;
            letter-spacing: inherit;
          `;

          // Add line break if needed
          if (targetParagraph > 0) {
            contentContainer.appendChild(document.createElement("br"));
          }

          contentContainer.appendChild(span);
          paragraphs[targetParagraph] = span;
        }

        const targetP = paragraphs[targetParagraph];
        cursor.remove();

        const wordSpan = document.createElement("span");
        wordSpan.textContent = currentWord.word;
        wordSpan.style.display = "inline";
        targetP.appendChild(wordSpan);

        if (
          currentWord.needsSpace ||
          (wordIndex < words.length - 1 &&
            words[wordIndex + 1].paragraphIndex === targetParagraph)
        ) {
          targetP.appendChild(document.createTextNode(" "));
        }

        targetP.appendChild(cursor);
        wordIndex++;

        const baseSpeed = speed;
        const randomVariation = Math.random() * 30 - 15;
        const wordLength = currentWord.word.length;
        const adjustedSpeed = baseSpeed + wordLength * 2 + randomVariation;

        setTimeout(typeNextWord, Math.max(adjustedSpeed, 30));
      }

      setTimeout(typeNextWord, 100);
    }

    // Particle effect - triggered when container comes into view
    function createParticles(container: HTMLElement) {
      if (!container || container.dataset.particlesCreated === "true") return;

      container.dataset.particlesCreated = "true";
      container.innerHTML = "";

      const particleCount = 50;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";

        const startPosition = Math.random() * 100;
        particle.style.left = `${startPosition}%`;
        particle.style.top = `-${Math.random() * 20}%`;

        particle.style.animationDelay = `${Math.random() * 2}s`;
        particle.style.animationDuration = `${Math.random() * 3 + 5}s`;

        container.appendChild(particle);
      }
    }

    // Timeline items animation - triggered individually
    function animateTimelineItem(item: HTMLElement, index: number) {
      if (item.dataset.animated === "true") return;

      item.dataset.animated = "true";
      item.style.animationDelay = `${index * 0.2}s`;
      item.classList.add("animate");
    }

    // Staggered fade-in animation
    function createStaggeredFadeIn(elements: NodeListOf<Element>, delay = 200) {
      elements.forEach((element, index) => {
        if ((element as HTMLElement).dataset.fadeAnimated === "true") return;

        (element as HTMLElement).dataset.fadeAnimated = "true";
        setTimeout(() => {
          (element as HTMLElement).style.opacity = "1";
          (element as HTMLElement).style.transform = "translateY(0)";
        }, index * delay);
      });
    }

    // Simple fade-in for hero titles (no typing)
    function createHeroTitleFade(element: HTMLElement) {
      if (element.dataset.titleFaded === "true") return;

      element.dataset.titleFaded = "true";
      element.style.transition =
        "opacity 1.5s ease-out, transform 1.5s ease-out";
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }

    // Main intersection observer for typing effects
    const typingObserver = createIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            // Skip if element has typing-disabled class
            if (element.classList.contains("typing-disabled")) return;
            const speed = parseInt(element.dataset.typingSpeed || "80");
            createTypingEffect(element, speed);
            typingObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    // Observer for particle effects
    const particleObserver = createIntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          createParticles(entry.target as HTMLElement);
          particleObserver.unobserve(entry.target);
        }
      });
    });

    // Observer for fade-in effects
    const fadeInObserver = createIntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
          fadeInObserver.unobserve(entry.target);
        }
      });
    });

    // Observer for hero titles (special fade-only treatment)
    const heroTitleObserver = createIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            setTimeout(() => createHeroTitleFade(element), 1000);
            heroTitleObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observer for timeline items
    const timelineObserver = createIntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll(
            ".timeline-item"
          ) as NodeListOf<HTMLElement>;
          items.forEach((item, index) => {
            setTimeout(() => animateTimelineItem(item, index), index * 100);
          });
          timelineObserver.unobserve(entry.target);
        }
      });
    });

    // Observer for staggered animations
    const staggeredObserver = createIntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const children = entry.target.querySelectorAll(".stagger-item");
          createStaggeredFadeIn(children);
          staggeredObserver.unobserve(entry.target);
        }
      });
    });

    function initScrollFade() {
      const sections = document.querySelectorAll(".fade-section");
      function handleScroll() {
        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const sectionTop = rect.top;
          const sectionHeight = rect.height;
          if (sectionTop < -sectionHeight * 0.55) {
            section.classList.add("fade-out");
          } else {
            section.classList.remove("fade-out");
          }
        });
      }
      window.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    function initVideoHandling() {
      const video = document.querySelector("video");
      if (video) {
        video.addEventListener("error", function () {
          console.log("Video failed to load, using fallback background");
          (this.parentElement as HTMLElement).style.background =
            "linear-gradient(135deg, #000428 0%, #004e92 100%)";
        });
      }
    }

    function initProgressBar() {
      let currentWidth = 0;
      let targetWidth = 0;
      let lastTime = 0;
      let animationFrameId: number | null = null;

      const calculateScrollPercentage = () => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        return (scrollTop / scrollHeight) * 100;
      };

      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const updateProgressBar = (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        const progressBar = document.querySelector(
          ".progress-bar"
        ) as HTMLElement;
        if (!progressBar) return;

        targetWidth = calculateScrollPercentage();

        const interpolationFactor = Math.min(1, deltaTime / 16);
        const diff = targetWidth - currentWidth;
        currentWidth += diff * interpolationFactor * 0.1;

        const easedWidth = easeOutCubic(currentWidth / 100) * 100;
        progressBar.style.width = `${easedWidth}%`;

        animationFrameId = requestAnimationFrame(updateProgressBar);
      };

      let ticking = false;
      window.addEventListener(
        "scroll",
        () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              targetWidth = calculateScrollPercentage();
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true }
      );

      animationFrameId = requestAnimationFrame(updateProgressBar);

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }

    function initNavbarScroll() {
      window.addEventListener("scroll", () => {
        const navbar = document.getElementById("navbar");
        if (navbar) {
          if (window.scrollY > 100) {
            navbar.classList.add("scrolled");
          } else {
            navbar.classList.remove("scrolled");
          }
        }
      });
    }

    function initSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (this: HTMLAnchorElement, e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href")!);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });
    }

    function initFormHandling() {
      const form = document.querySelector("form");
      if (!form) return;
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const submitBtn = (e.target as HTMLFormElement).querySelector(
          ".submit-btn"
        ) as HTMLElement;
        if (!submitBtn) return;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "REGISTERING...";
        submitBtn.style.opacity = "0.7";
        setTimeout(() => {
          submitBtn.textContent = "REGISTRATION COMPLETE";
          submitBtn.style.background = "#fff";
          submitBtn.style.color = "#000";
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = "transparent";
            submitBtn.style.color = "#fff";
            submitBtn.style.opacity = "1";
            (e.target as HTMLFormElement).reset();
            document.querySelectorAll(".form-group").forEach((group) => {
              const input = group.querySelector(
                "input, textarea"
              ) as HTMLInputElement;
              const label = group.querySelector("label");
              if (input && label) {
                input.classList.remove("focused");
                label.classList.remove("focused");
              }
            });
          }, 3000);
        }, 2000);
      });
    }

    function initializeFormAnimations() {
      document.querySelectorAll(".form-group").forEach((group) => {
        const input = group.querySelector(
          "input, textarea"
        ) as HTMLInputElement;
        const label = group.querySelector("label");
        if (input && label) {
          input.addEventListener("focus", () => {
            input.classList.add("focused");
            label.classList.add("focused");
            input.style.borderBottomColor = "#fff";
            input.style.boxShadow = "0 1px 0 0 #fff";
          });
          input.addEventListener("blur", () => {
            if (!input.value.trim()) {
              input.classList.remove("focused");
              label.classList.remove("focused");
              input.style.borderBottomColor = "#333";
              input.style.boxShadow = "none";
            }
          });
          input.addEventListener("input", () => {
            if (input.value.trim()) {
              input.classList.add("focused");
              label.classList.add("focused");
            }
          });
          if (input.value.trim()) {
            input.classList.add("focused");
            label.classList.add("focused");
          }
        }
      });
    }

    // Initialize effects that don't need intersection observer
    initScrollFade();
    initVideoHandling();
    initProgressBar();
    initNavbarScroll();
    initSmoothScroll();
    initFormHandling();
    initializeFormAnimations();

    // Set up intersection observers for elements
    // Typing content elements (but exclude titles that should only fade)
    document
      .querySelectorAll(
        ".typing-content:not(.hero-main-title):not(.main-heading)"
      )
      .forEach((el) => {
        (el as HTMLElement).style.opacity = "0";
        typingObserver.observe(el);
      });

    // Hero titles get special treatment - fade only, no typing
    const heroTitles = document.querySelectorAll(
      ".hero-main-title, .main-heading"
    );
    heroTitles.forEach((title) => {
      const element = title as HTMLElement;
      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";
      heroTitleObserver.observe(element);
    });

    // Particle containers
    const particleContainers = document.querySelectorAll(
      "#particles, .particles"
    );
    particleContainers.forEach((container) => {
      particleObserver.observe(container);
    });

    // Fade-in elements
    document.querySelectorAll(".fade-in").forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(50px)";
      (el as HTMLElement).style.transition = "all 1s ease-out";
      fadeInObserver.observe(el);
    });

    // Timeline containers
    document
      .querySelectorAll(".timeline-container, .timeline")
      .forEach((el) => {
        timelineObserver.observe(el);
      });

    // Staggered animation containers
    document.querySelectorAll(".stagger-container").forEach((el) => {
      staggeredObserver.observe(el);
    });

    // Nav links hover effect
    document
      .querySelectorAll<HTMLAnchorElement>(".nav-links a")
      .forEach((link) => {
        link.addEventListener("mouseenter", () => {
          link.style.transform = "translateY(-2px)";
        });
        link.addEventListener("mouseleave", () => {
          link.style.transform = "translateY(0)";
        });
      });

    // Clean up function
    return () => {
      typingObserver.disconnect();
      particleObserver.disconnect();
      fadeInObserver.disconnect();
      timelineObserver.disconnect();
      staggeredObserver.disconnect();
      heroTitleObserver.disconnect();

      const particlesContainer = document.getElementById("particles");
      if (particlesContainer) {
        particlesContainer.innerHTML = "";
      }
    };
  }, []);

  return null;
}

export const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
    }
  });
};

export const createObserver = (
  options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }
) => {
  if (typeof window === "undefined") return null;
  return new IntersectionObserver(handleIntersection, options);
};
