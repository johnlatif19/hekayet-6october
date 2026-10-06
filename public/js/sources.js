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
  var footerYear = document.getElementById("footerYear");

  if (footerYear) footerYear.textContent = new Date().getFullYear();

  window.addEventListener("load", function () {
    setTimeout(function () {
      if (preloader) preloader.classList.add("is-hidden");
    }, 1200);
  });

  function updateProgress() {
    var h = document.documentElement;
    var scrolled = h.scrollTop || document.body.scrollTop;
    var total = h.scrollHeight - h.clientHeight;
    var pct = total > 0 ? (scrolled / total) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener("resize", updateProgress);
  updateProgress();

  var jumpLinks = document.querySelectorAll("[data-jump]");
  jumpLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var targetId = link.getAttribute("data-jump");
      var target = document.getElementById(targetId);
      if (target) {
        var offset = 40;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReduced && "IntersectionObserver" in window) {
    var fadeTargets = document.querySelectorAll(
      ".sources-section__header, .sources-list li, .archival-item, .note-block, .archival-note, .sources-intro__lead"
    );

    fadeTargets.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseFloat(el.dataset.delay) || 0;
          setTimeout(function () {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    fadeTargets.forEach(function (el, i) {
      if (el.matches(".sources-list li")) {
        el.dataset.delay = Math.min(i % 6, 5) * 60;
      }
      observer.observe(el);
    });
  }

  document.querySelectorAll('a[href^="index.html"]').forEach(function (link) {
    link.addEventListener("click", function () {
      if (progressBar) progressBar.style.width = "0%";
    });
  });

})();
