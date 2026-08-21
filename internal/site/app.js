// Generated site behaviour. Source: internal/site/app.js
(function () {
  var root = document.documentElement;

  /* ---------- colours ---------- */

  function currentTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit === "light" || explicit === "dark") return explicit;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  var themeBtn = document.querySelector(".theme-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      themeBtn.setAttribute("aria-pressed", String(next === "dark"));
    });
    themeBtn.setAttribute("aria-pressed", String(currentTheme() === "dark"));
  }

  /* ---------- auto-switch notice ---------- */

  // head.js may have redirected here from the English page. Say so once, and
  // offer to make it stick, so the switch never feels like it just happened.
  var notice = document.getElementById("switched");
  if (notice) {
    var why = null;
    try {
      why = sessionStorage.getItem("auto-locale");
      sessionStorage.removeItem("auto-locale");
    } catch (e) {}
    if (why === "device") {
      notice.hidden = false;
      var ok = document.getElementById("switched-ok");
      if (ok)
        ok.addEventListener("click", function () {
          try {
            localStorage.setItem("locale", root.getAttribute("data-locale"));
          } catch (e) {}
          notice.hidden = true;
        });
    }
  }

  /* ---------- language ---------- */

  // Entry names are shared across locales, so the fragment is still valid on
  // the other side. Carry it over rather than dropping the reader at the top.
  var langBtn = document.querySelector(".lang-btn");
  if (langBtn) {
    langBtn.addEventListener("click", function () {
      try {
        localStorage.setItem("locale", langBtn.dataset.targetLocale || "");
      } catch (e) {}
      if (window.location.hash) langBtn.hash = window.location.hash;
    });
  }
})();
