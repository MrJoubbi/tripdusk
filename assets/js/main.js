/* TripDusk — shared chrome + interactions */
(function () {
  "use strict";
  var me = document.currentScript;
  var page = document.body.getAttribute("data-page") || "";
  var act = function (p) { return page === p ? " active" : ""; };

  var chev = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

  /* ---------- Header ---------- */
  var header =
  '<header class="site-header"><div class="wrap nav">' +
    '<a href="/index.html" class="brand"><img class="mark" src="/assets/img/logo.svg" alt=""><span class="word"><b>Trip</b><span>Dusk</span></span></a>' +
    '<nav class="nav-links" aria-label="Primary">' +
      '<a href="/index.html" class="' + (page === "home" ? "active" : "") + '">Home</a>' +

      '<div class="nav-item">' +
        '<a href="/romantic-escapes.html" class="nav-top' + act("romantic") + '">Romantic Escapes ' + chev + '</a>' +
        '<div class="mega">' +
          '<a class="mega-all" href="/romantic-escapes.html">All Romantic Escapes</a>' +
          '<a href="/romantic-escapes.html#honeymoon">Honeymoon Destinations<small>Say "I do" at golden hour</small></a>' +
          '<a href="/romantic-escapes.html#getaways">Couples’ Weekend Getaways<small>Short, romantic escapes</small></a>' +
          '<a href="/romantic-escapes.html#stays">Sunset Stays &amp; Resorts<small>Rooms with the best view</small></a>' +
          '<a href="/romantic-escapes.html#experiences">Romantic Experiences<small>Cruises, dinners &amp; more</small></a>' +
        '</div>' +
      '</div>' +

      '<div class="nav-item">' +
        '<a href="/nomad-life.html" class="nav-top' + act("nomad") + '">Nomad Life ' + chev + '</a>' +
        '<div class="mega">' +
          '<a class="mega-all" href="/nomad-life.html">All Nomad Life</a>' +
          '<a href="/nomad-life.html#esim">eSIM &amp; Connectivity<small>Stay online anywhere</small></a>' +
          '<a href="/nomad-life.html#insurance">Travel Insurance<small>Cover for long-term travel</small></a>' +
          '<a href="/nomad-life.html#cities">Best Nomad Cities<small>Where to base yourself</small></a>' +
          '<a href="/nomad-life.html#gear">Remote-Work Stays &amp; Gear<small>Wi-Fi, desks &amp; kit</small></a>' +
        '</div>' +
      '</div>' +

      '<div class="nav-item">' +
        '<a href="/golden-hour.html" class="nav-top' + act("golden") + '">Golden Hour ' + chev + '</a>' +
        '<div class="mega">' +
          '<a class="mega-all" href="/golden-hour.html">All Golden Hour</a>' +
          '<a href="/sunset-finder.html">🌅 Sunset Finder<small>Best sunset for any city — a tool</small></a>' +
          '<a href="/golden-hour.html#tips">Sunset Photography Tips<small>Settings &amp; timing</small></a>' +
          '<a href="/golden-hour.html#presets">Presets &amp; Editing<small>Our TripDusk presets</small></a>' +
          '<a href="/golden-hour.html#gear">Camera &amp; Phone Gear<small>What we actually pack</small></a>' +
          '<a href="/golden-hour.html#spots">Best Sunset Spots<small>Where to be at dusk</small></a>' +
        '</div>' +
      '</div>' +

      '<a href="/destinations.html" class="' + (page === "destinations" ? "active" : "") + '">Destinations</a>' +
      '<a href="/about.html" class="' + (page === "about" ? "active" : "") + '">About</a>' +
    '</nav>' +
    '<div class="nav-cta">' +
      '<a href="/contact.html" class="btn btn-primary">Subscribe</a>' +
      '<button class="burger" aria-label="Menu"><span></span><span></span><span></span></button>' +
    '</div>' +
  '</div></header>';

  /* ---------- Footer ---------- */
  var footer =
  '<footer class="site-footer"><div class="wrap">' +
    '<div class="foot-grid">' +
      '<div class="foot-brand">' +
        '<a href="/index.html" class="brand"><img class="mark" src="/assets/img/logo.svg" alt=""><span><b>Trip</b><span>Dusk</span></span></a>' +
        '<p>A travel journal for sunset chasers — romantic escapes, the digital-nomad life, and golden-hour photography.</p>' +
        '<div class="socials">' +
          '<a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>' +
          '<a href="#" aria-label="Pinterest"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.5-.2 1 .5 1.9 1.5 1.9 1.9 0 3.2-2.4 3.2-5.2 0-2.1-1.5-3.7-4.1-3.7a4.7 4.7 0 0 0-4.9 4.7c0 .9.3 1.5.7 2 .2.2.2.3.1.6l-.2.9c-.1.3-.3.4-.6.2-1.2-.5-1.7-1.9-1.7-3.4 0-2.5 2.1-5.5 6.3-5.5 3.4 0 5.6 2.4 5.6 5 0 3.4-1.9 6-4.7 6-1 0-1.9-.5-2.2-1.1l-.6 2.4c-.2.8-.7 1.6-1 2.2A10 10 0 1 0 12 2z"/></svg></a>' +
          '<a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.7C19.3 5.2 12 5.2 12 5.2s-7.3 0-8.9.4A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.7c1.6.4 8.9.4 8.9.4s7.3 0 8.9-.4a2.5 2.5 0 0 0 1.7-1.7C23 15.2 23 12 23 12zM9.8 15.3V8.7l5.7 3.3z"/></svg></a>' +
          '<a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg></a>' +
        '</div>' +
      '</div>' +
      '<div class="foot-col"><h4>Explore</h4><a href="/romantic-escapes.html">Romantic Escapes</a><a href="/nomad-life.html">Nomad Life</a><a href="/golden-hour.html">Golden Hour</a><a href="/destinations.html">Destinations</a></div>' +
      '<div class="foot-col"><h4>Regions</h4><a href="/destinations.html">Europe</a><a href="/destinations.html">Asia</a><a href="/destinations.html">Caribbean</a><a href="/destinations.html">USA &amp; Africa</a></div>' +
      '<div class="foot-col"><h4>Company</h4><a href="/about.html">About</a><a href="/contact.html">Contact</a><a href="/contact.html">Privacy Policy</a><a href="/contact.html">Work with us</a></div>' +
    '</div>' +
    '<div class="foot-bottom"><span>© <span data-year>2026</span> TripDusk. Made in the half-light.</span><span>contact@tripdusk.com</span></div>' +
  '</div></footer>';

  document.body.insertAdjacentHTML("afterbegin", header);
  if (me) me.insertAdjacentHTML("beforebegin", footer);
  else document.body.insertAdjacentHTML("beforeend", footer);

  /* ---------- Sticky header ---------- */
  var siteHeader = document.querySelector(".site-header");
  var onScroll = function () {
    if (siteHeader) siteHeader.classList.toggle("scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var burger = document.querySelector(".burger");
  if (burger) burger.addEventListener("click", function () { document.body.classList.toggle("nav-open"); });

  document.querySelectorAll(".nav-item > .nav-top").forEach(function (top) {
    top.addEventListener("click", function (e) {
      if (window.matchMedia("(max-width: 900px)").matches) {
        e.preventDefault();
        top.parentElement.classList.toggle("open");
      }
    });
  });
  document.querySelectorAll(".nav-links a:not(.nav-top)").forEach(function (a) {
    a.addEventListener("click", function () { document.body.classList.remove("nav-open"); });
  });

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- FAQ ---------- */
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () {
      var item = q.closest(".faq-item");
      var ans = item.querySelector(".faq-a");
      var open = item.classList.toggle("open");
      ans.style.maxHeight = open ? ans.scrollHeight + "px" : "0";
    });
  });

  /* ---------- Hero sun parallax ---------- */
  var sun = document.querySelector(".hero-sun");
  if (sun && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < window.innerHeight) sun.style.transform = "translateX(-50%) translateY(" + y * 0.18 + "px)";
    }, { passive: true });
  }

  /* ---------- Demo forms ---------- */
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector(".form-result");
      if (note) { note.textContent = "Thanks — your message is on its way. We’ll reply within 48 hours. 🌅"; note.style.color = "var(--gold)"; }
      form.reset();
    });
  });

  /* ---------- Footer year ---------- */
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
