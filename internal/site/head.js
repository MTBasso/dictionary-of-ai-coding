// Inlined into <head> so both decisions happen before the first paint.
(function () {
  var el = document.documentElement;
  var here = el.getAttribute("data-locale");

  // Theme. An explicit choice wins; with nothing stored, the stylesheet's
  // prefers-color-scheme rules follow the device on their own.
  try {
    var t = localStorage.getItem("theme");
    if (t === "light" || t === "dark") el.setAttribute("data-theme", t);
  } catch (e) {}

  // Language. A stored choice wins; otherwise follow the device, treating any
  // pt tag — pt, pt-BR, pt-PT — as Portuguese and everything else as English.
  var stored = null;
  try {
    stored = localStorage.getItem("locale");
  } catch (e) {}

  var want;
  if (stored === "en" || stored === "pt-BR") {
    want = stored;
  } else {
    var langs =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language || ""];
    want = "en";
    for (var i = 0; i < langs.length; i++) {
      if (/^pt(-|$)/i.test(langs[i])) {
        want = "pt-BR";
        break;
      }
    }
  }

  if (want === here) return;
  // Only ever redirect away from English. Landing on /pt-BR/ is already a
  // choice someone made, and bouncing it would hijack shared links.
  if (here !== "en") return;

  var href = el.getAttribute("data-alt-href");
  if (!href) return;
  try {
    sessionStorage.setItem("auto-locale", stored ? "stored" : "device");
  } catch (e) {}
  location.replace(href + location.hash);
})();
