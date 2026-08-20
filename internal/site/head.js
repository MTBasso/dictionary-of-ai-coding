// Inlined into <head> so the stored theme is applied before first paint.
(function () {
  try {
    var t = localStorage.getItem("theme");
    if (t === "light" || t === "dark")
      document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
})();
