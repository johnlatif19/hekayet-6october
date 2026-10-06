(function () {
  "use strict";

  document.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  document.addEventListener("dragstart", function (e) {
    if (e.target && (e.target.tagName === "IMG" || e.target.tagName === "SVG")) {
      e.preventDefault();
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "F12") { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) {
      e.preventDefault(); return false;
    }
    if (e.ctrlKey && (e.key === "U" || e.key === "u" || e.key === "S" || e.key === "s")) {
      e.preventDefault(); return false;
    }
  });

  var preloader = document.getElementById("preloader");
  var progressBar = document.getElementById("progressBar");
  var timeline = document.getElementById("timeline");
  var timelineToggle = document.getElementById("timelineToggle");
  var timelineList = document.getElementById("timelineList");
  var audioToggle = document.getElementById("audioToggle");
  var ambientAudio = document.getElementById("ambientAudio");
  var footerYear = document.getElementById("footerYear");
  var clockEl = document.getElementById("ch04-clock");

  if (footerYear) footerYear.textContent = new Date().getFullYear();

  window.addEventListener("load", function () {
    setTimeout(function () {
      if (preloader) preloader.classList.add("is-hidden");
    }, 1400);
  });

  if (timelineToggle && timeline) {
    timelineToggle.addEventListener("click", function () {
      timeline.classList.toggle("is-collapsed");
    });
  }

  if (audioToggle && ambientAudio) {
    ambientAudio.volume = 0.35;
    audioToggle.addEventListener("click", function () {
      var pressed = audioToggle.getAttribute("aria-pressed") === "true";
      if (pressed) {
        ambientAudio.pause();
        audioToggle.setAttribute("aria-pressed", "false");
      } else {
        ambientAudio.play().then(function () {
          audioToggle.setAttribute("aria-pressed", "true");
        }).catch(function () {
          audioToggle.setAttribute("aria-pressed", "false");
        });
      }
    });
  }

  function updateProgress() {
    var h = document.documentElement;
    var scrolled = h.scrollTop || document.body.scrollTop;
    var total = h.scrollHeight - h.clientHeight;
    var pct = total > 0 ? (scrolled / total) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
  }

  var sections = document.querySelectorAll("[data-chapter]");
  var timelineItems = timelineList ? timelineList.querySelectorAll("li") : [];

  function updateActiveChapter() {
    var scrollPos = window.scrollY + window.innerHeight * 0.4;
    var current = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    if (!current) return;

    var key = current.getAttribute("data-chapter");

    timelineItems.forEach(function (item) {
      var itemKey = item.getAttribute("data-year");
      if (itemKey === key) item.classList.add("is-active");
      else item.classList.remove("is-active");
    });
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateProgress();
        updateActiveChapter();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener("resize", function () {
    updateProgress();
    updateActiveChapter();
  });

  updateProgress();
  updateActiveChapter();

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReduced) {

      gsap.from(".hero__eyebrow", { y: 20, opacity: 0, duration: 1.2, delay: 1.5, ease: "power3.out" });
      gsap.from(".hero__title-ar", { y: 40, opacity: 0, duration: 1.4, delay: 1.7, ease: "power3.out" });
      gsap.from(".hero__title-en", { y: 20, opacity: 0, duration: 1.2, delay: 2.0, ease: "power3.out" });
      gsap.from(".hero__subtitle", { y: 20, opacity: 0, duration: 1.2, delay: 2.2, ease: "power3.out" });
      gsap.from(".hero__date", { y: 20, opacity: 0, duration: 1, delay: 2.4, ease: "power3.out" });
      gsap.from(".hero__cta", { y: 20, opacity: 0, duration: 1, delay: 2.6, ease: "power3.out" });

      gsap.to(".hero__sweep", {
        opacity: 1,
        duration: 3,
        delay: 1.2,
        ease: "power2.inOut",
        onComplete: function () {
          gsap.to(".hero__sweep", { opacity: 0, duration: 2, ease: "power2.inOut" });
        }
      });

      gsap.to(".hero__map", {
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1
        },
        y: 100,
        opacity: 0,
        ease: "none"
      });

      gsap.to(".hero__content", {
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1
        },
        y: -60,
        opacity: 0,
        ease: "none"
      });

      document.querySelectorAll(".chapter__header").forEach(function (header) {
        gsap.from(header.children, {
          scrollTrigger: {
            trigger: header,
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out"
        });
      });

      document.querySelectorAll(".chapter__text p, .facts li, .mini-timeline li, .crossing__facts li, .return-timeline li").forEach(function (el) {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse"
          },
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: "power2.out"
        });
      });

      document.querySelectorAll(".map, .photo, .barlev").forEach(function (el) {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          y: 40,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out"
        });
      });

      document.querySelectorAll(".map").forEach(function (mapEl) {
        gsap.to(mapEl.querySelector(".map__svg"), {
          scrollTrigger: {
            trigger: mapEl,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          },
          scale: 1.06,
          ease: "none"
        });
      });

      var clockTrigger = document.getElementById("chapter-04");
      if (clockTrigger && clockEl) {
        ScrollTrigger.create({
          trigger: clockTrigger,
          start: "top 60%",
          onEnter: function () {
            var el = clockEl;
            var text = "الساعة 2:00 ظهرًا";
            el.textContent = "";
            var i = 0;
            var interval = setInterval(function () {
              el.textContent += text.charAt(i);
              i++;
              if (i >= text.length) clearInterval(interval);
            }, 55);
          }
        });
      }

      var boats = document.querySelectorAll(".boat");
      boats.forEach(function (boat, i) {
        gsap.fromTo(boat,
          { x: "-30vw", y: 0, opacity: 0 },
          {
            scrollTrigger: {
              trigger: "#chapter-05",
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2
            },
            x: "80vw",
            y: -20,
            opacity: 1,
            ease: "none",
            delay: i * 0.15
          }
        );
      });

      var flag = document.querySelector(".crossing__flag");
      if (flag) {
        gsap.fromTo(flag,
          { opacity: 0, scale: 0.6 },
          {
            scrollTrigger: {
              trigger: "#chapter-05",
              start: "top 60%",
              end: "center center",
              scrub: 1
            },
            opacity: 1,
            scale: 1,
            ease: "power2.out"
          }
        );
      }

      var aircraftWave = document.querySelectorAll(".scene__aircraft--wave");
      aircraftWave.forEach(function (ac, i) {
        gsap.fromTo(ac,
          { x: "-10vw", opacity: 0 },
          {
            scrollTrigger: {
              trigger: "#chapter-04",
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            },
            x: "110vw",
            opacity: 0.8,
            ease: "none",
            delay: i * 0.2
          }
        );
      });

      document.querySelectorAll(".chapter").forEach(function (chapter) {
        gsap.to(chapter, {
          scrollTrigger: {
            trigger: chapter,
            start: "top top",
            end: "bottom top",
            scrub: true
          },
          backgroundPosition: "50% 100%",
          ease: "none"
        });
      });

      document.querySelectorAll(".veh").forEach(function (v, i) {
        gsap.fromTo(v,
          { x: 0 },
          {
            scrollTrigger: {
              trigger: "#chapter-07",
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            },
            x: 60,
            ease: "none",
            delay: i * 0.3
          }
        );
      });

      document.querySelectorAll(".map__expansion").forEach(function (el) {
        gsap.from(el, {
          scrollTrigger: {
            trigger: "#chapter-07",
            start: "top 70%",
            toggleActions: "play none none reverse"
          },
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.6,
          ease: "power3.out"
        });
      });

      document.querySelectorAll(".map__routes path, .map__syrian-arrows path, .map__counter-arrows path, .map__armour-arrows path, .map__israel-arrows path").forEach(function (path) {
        var length = path.getTotalLength ? path.getTotalLength() : 300;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;

        ScrollTrigger.create({
          trigger: path.closest(".map") || path,
          start: "top 75%",
          onEnter: function () {
            gsap.to(path, { strokeDashoffset: 0, duration: 2, ease: "power2.out" });
          }
        });
      });

      var finalTitle = document.querySelector(".final-title");
      if (finalTitle) {
        gsap.from(finalTitle, {
          scrollTrigger: {
            trigger: finalTitle,
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
          y: 60,
          opacity: 0,
          duration: 1.4,
          ease: "power3.out"
        });
      }

      var closing = document.querySelector(".closing");
      if (closing) {
        gsap.from(closing.children, {
          scrollTrigger: {
            trigger: closing,
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
          y: 40,
          opacity: 0,
          duration: 1.2,
          stagger: 0.3,
          ease: "power3.out"
        });
      }

      var timelineEl = document.getElementById("timeline");
      if (timelineEl) {
        ScrollTrigger.create({
          trigger: "body",
          start: "top -10%",
          onEnter: function () { timelineEl.style.opacity = "1"; },
          onLeaveBack: function () { timelineEl.style.opacity = "0.4"; }
        });
      }
    }
  }

  window.addEventListener("beforeunload", function () {
    if (ambientAudio && !ambientAudio.paused) {
      ambientAudio.pause();
    }
  });

})();
