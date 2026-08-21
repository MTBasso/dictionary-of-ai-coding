// Graph explorer. Source: internal/site/graph.js
//
// The dictionary's cross-references form a dense graph — average degree ~15,
// and every entry sits within two hops of "AI". Revealing every neighbour of
// every entry you read would put all 69 nodes on screen after two clicks and
// defeat the point, so reveals are rationed: opening an entry reveals its top
// REVEAL_BATCH ranked neighbours, and re-opening it reveals the next batch.
// That keeps every entry reachable without the web exploding.

(function () {
  "use strict";

  var DATA = window.__DICT__;
  if (!DATA) return;

  var REVEAL_BATCH = 3;
  var UI = DATA.ui;
  var STORE_KEY = "dict-read-" + DATA.locale;

  var nodes = DATA.nodes;
  var byId = {};
  nodes.forEach(function (n, i) {
    n.index = i;
    n.x = 0;
    n.y = 0;
    n.vx = 0;
    n.vy = 0;
    n.visible = false;
    n.read = false;
    n.shown = 0; // how many of its ranked neighbours have been offered
    byId[n.id] = n;
  });

  // Adjacency, for drawing edges between visible nodes.
  var adj = {};
  nodes.forEach(function (n) {
    adj[n.id] = {};
  });
  DATA.edges.forEach(function (e) {
    adj[e[0]][e[1]] = e[2];
    adj[e[1]][e[0]] = e[2];
  });

  /* ---------------- state ---------------- */

  var active = null;
  var seed = DATA.seed;

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return parsed && parsed.read ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function save() {
    try {
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify({
          read: nodes.filter((n) => n.read).map((n) => n.id),
          shown: nodes.filter((n) => n.shown > 0).map((n) => [n.id, n.shown]),
        })
      );
    } catch (e) {}
  }

  function reveal(node, near) {
    if (node.visible) return false;
    node.visible = true;
    // Spawn just off its parent so it visibly springs outward.
    var a = Math.random() * Math.PI * 2;
    var r = 40 + Math.random() * 30;
    node.x = (near ? near.x : 0) + Math.cos(a) * r;
    node.y = (near ? near.y : 0) + Math.sin(a) * r;
    node.vx = 0;
    node.vy = 0;
    node.born = performance.now();
    return true;
  }

  // Offer the next batch of a node's ranked neighbours.
  function expand(node) {
    var added = 0;
    while (node.shown < node.neighbors.length && added < REVEAL_BATCH) {
      var next = byId[node.neighbors[node.shown]];
      node.shown++;
      if (next && reveal(next, node)) added++;
    }
    return added;
  }

  function hiddenCount(node) {
    var n = 0;
    for (var i = 0; i < node.neighbors.length; i++) {
      var v = byId[node.neighbors[i]];
      if (v && !v.visible) n++;
    }
    return n;
  }

  /* ---------------- reading pane ---------------- */

  var paneEl = document.getElementById("pane");
  var progressEl = document.getElementById("progress");

  function relatedList(node) {
    var shown = node.neighbors
      .map(function (id) {
        return byId[id];
      })
      .filter(function (v) {
        return v && v.visible;
      });
    if (!shown.length) return "";
    var items = shown
      .map(function (v) {
        return (
          '<li><a href="#' +
          v.slug +
          '" data-goto="' +
          v.id +
          '">' +
          v.term +
          "</a>" +
          (v.read ? ' <span class="tag">' + UI.read + "</span>" : "") +
          "</li>"
        );
      })
      .join("");
    return (
      '<nav class="related"><h3>' +
      UI.related +
      "</h3><ul>" +
      items +
      "</ul></nav>"
    );
  }

  function renderPane() {
    if (!active) {
      paneEl.innerHTML =
        '<div class="welcome"><h2>' +
        UI.welcomeTitle +
        "</h2><p>" +
        UI.welcomeBody +
        '</p><p><button type="button" class="start" data-goto="' +
        seed +
        '">' +
        byId[seed].term +
        " &rarr;</button></p></div>";
      return;
    }
    paneEl.innerHTML =
      '<article class="entry"><h2>' +
      active.term +
      '</h2><p class="sect">' +
      active.section +
      "</p>" +
      DATA.entries[active.id] +
      "</article>" +
      relatedList(active);
    paneEl.scrollTop = 0;
  }

  function updateProgress() {
    var read = nodes.filter(function (n) {
      return n.read;
    }).length;
    progressEl.textContent = UI.progress
      .replace("%read%", read)
      .replace("%total%", nodes.length);
  }

  function open(node, fromUser) {
    if (!node) return;
    reveal(node, active);
    if (node.read) {
      // Re-opening a known entry pushes the web out a little further.
      expand(node);
    } else {
      node.read = true;
      expand(node);
    }
    active = node;
    renderPane();
    updateProgress();
    save();
    if (fromUser !== false && history.replaceState) {
      history.replaceState(null, "", "#" + node.slug);
    }
    focusOn(node);
  }

  /* ---------------- canvas ---------------- */

  var canvas = document.getElementById("web");
  var ctx = canvas.getContext("2d");
  var view = { x: 0, y: 0, k: 1 };
  var W = 0,
    H = 0,
    DPR = 1;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    var r = canvas.getBoundingClientRect();
    W = r.width;
    H = r.height;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  var css = {};
  function readTheme() {
    var s = getComputedStyle(document.documentElement);
    [
      "fg",
      "fg-muted",
      "fg-faint",
      "accent",
      "border",
      "bg",
      "bg-raised",
    ].forEach(function (k) {
      css[k] = s.getPropertyValue("--" + k).trim();
    });
  }

  // Frame every visible node, so a web grown past the viewport can be pulled
  // back into view in one click.
  function fitToView() {
    var vis = nodes.filter(function (n) {
      return n.visible;
    });
    if (!vis.length) return;
    var minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    vis.forEach(function (n) {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y);
    });
    var pad = 90;
    var w = maxX - minX + pad * 2;
    var h = maxY - minY + pad * 2;
    view.k = Math.max(0.32, Math.min(1.5, Math.min(W / w, H / h)));
    targetView = { x: -(minX + maxX) / 2, y: -(minY + maxY) / 2 };
  }

  function focusOn(node) {
    // Ease the view so the opened node sits near the middle.
    targetView = { x: -node.x, y: -node.y, k: view.k };
  }
  var targetView = null;

  function toScreen(p) {
    return {
      x: (p.x + view.x) * view.k + W / 2,
      y: (p.y + view.y) * view.k + H / 2,
    };
  }
  function toWorld(sx, sy) {
    return {
      x: (sx - W / 2) / view.k - view.x,
      y: (sy - H / 2) / view.k - view.y,
    };
  }

  function radius(n) {
    return n === active ? 9 : n.read ? 7 : 5;
  }

  /* ---------------- simulation ---------------- */

  function step() {
    var vis = nodes.filter(function (n) {
      return n.visible;
    });
    var i, j, a, b, dx, dy, d;

    for (i = 0; i < vis.length; i++) {
      a = vis[i];
      for (j = i + 1; j < vis.length; j++) {
        b = vis[j];
        dx = b.x - a.x;
        dy = b.y - a.y;
        d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        if (d > 520) continue;
        var rep = 4600 / (d * d);
        var ux = dx / d,
          uy = dy / d;
        a.vx -= ux * rep;
        a.vy -= uy * rep;
        b.vx += ux * rep;
        b.vy += uy * rep;
      }
    }

    for (i = 0; i < vis.length; i++) {
      a = vis[i];
      var nb = adj[a.id];
      for (var id in nb) {
        b = byId[id];
        if (!b || !b.visible || b.index < a.index) continue;
        dx = b.x - a.x;
        dy = b.y - a.y;
        d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        var rest = 155;
        var f = (d - rest) * 0.012;
        var ux2 = dx / d,
          uy2 = dy / d;
        a.vx += ux2 * f;
        a.vy += uy2 * f;
        b.vx -= ux2 * f;
        b.vy -= uy2 * f;
      }
      // Gentle pull to the origin keeps the web from drifting away.
      a.vx -= a.x * 0.0016;
      a.vy -= a.y * 0.0016;
    }

    for (i = 0; i < vis.length; i++) {
      a = vis[i];
      if (a === dragging) continue;
      a.vx *= 0.86;
      a.vy *= 0.86;
      a.x += Math.max(-12, Math.min(12, a.vx));
      a.y += Math.max(-12, Math.min(12, a.vy));
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var vis = nodes.filter(function (n) {
      return n.visible;
    });

    // edges
    ctx.lineWidth = 1;
    for (var i = 0; i < vis.length; i++) {
      var a = vis[i];
      var nb = adj[a.id];
      for (var id in nb) {
        var b = byId[id];
        if (!b || !b.visible || b.index < a.index) continue;
        var pa = toScreen(a),
          pb = toScreen(b);
        var touching = active && (a === active || b === active);
        ctx.strokeStyle = touching ? css.accent : css.border;
        ctx.globalAlpha = touching ? 0.55 : 0.32;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    // nodes
    for (var n = 0; n < vis.length; n++) {
      var node = vis[n];
      var p = toScreen(node);
      var r = radius(node) * Math.min(view.k, 1.4);

      if (node === active) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 6, 0, Math.PI * 2);
        ctx.strokeStyle = css.accent;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      if (node.read) {
        ctx.fillStyle = node === active ? css.accent : css["fg-muted"];
        ctx.fill();
      } else {
        ctx.fillStyle = css["bg-raised"];
        ctx.fill();
        ctx.strokeStyle = css["fg-faint"];
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.lineWidth = 1;
      }

      // hidden-neighbour badge
      var hid = hiddenCount(node);
      if (node.read && hid > 0) {
        ctx.beginPath();
        ctx.arc(p.x + r + 5, p.y - r - 3, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = css["bg-raised"];
        ctx.fill();
        ctx.strokeStyle = css.border;
        ctx.stroke();
        ctx.fillStyle = css["fg-muted"];
        ctx.font = "9px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(hid), p.x + r + 5, p.y - r - 2.5);
      }

      // label
      if (view.k > 0.55 || node === active || node.read) {
        ctx.font =
          (node === active ? "600 " : "") +
          Math.round(11 * Math.min(view.k, 1.25)) +
          "px ui-sans-serif, system-ui, sans-serif";
        ctx.fillStyle = node === active ? css.fg : css["fg-muted"];
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(node.term, p.x, p.y + r + 4);
      }
    }
  }

  function frame() {
    if (targetView) {
      view.x += (targetView.x - view.x) * 0.12;
      view.y += (targetView.y - view.y) * 0.12;
      if (
        Math.abs(targetView.x - view.x) < 0.5 &&
        Math.abs(targetView.y - view.y) < 0.5
      )
        targetView = null;
    }
    step();
    draw();
    requestAnimationFrame(frame);
  }

  /* ---------------- interaction ---------------- */

  var dragging = null,
    panning = false,
    last = null,
    moved = 0;

  function hit(sx, sy) {
    var w = toWorld(sx, sy);
    var best = null,
      bestD = Infinity;
    nodes.forEach(function (n) {
      if (!n.visible) return;
      var dx = n.x - w.x,
        dy = n.y - w.y;
      var d = Math.sqrt(dx * dx + dy * dy);
      var reach = (radius(n) + 12) / view.k;
      if (d < reach && d < bestD) {
        best = n;
        bestD = d;
      }
    });
    return best;
  }

  canvas.addEventListener("pointerdown", function (ev) {
    canvas.setPointerCapture(ev.pointerId);
    last = { x: ev.offsetX, y: ev.offsetY };
    moved = 0;
    var n = hit(ev.offsetX, ev.offsetY);
    if (n) dragging = n;
    else panning = true;
  });

  canvas.addEventListener("pointermove", function (ev) {
    var n;
    if (!last) {
      n = hit(ev.offsetX, ev.offsetY);
      canvas.style.cursor = n ? "pointer" : "grab";
      return;
    }
    var dx = ev.offsetX - last.x,
      dy = ev.offsetY - last.y;
    moved += Math.abs(dx) + Math.abs(dy);
    if (dragging) {
      dragging.x += dx / view.k;
      dragging.y += dy / view.k;
      dragging.vx = 0;
      dragging.vy = 0;
    } else if (panning) {
      view.x += dx / view.k;
      view.y += dy / view.k;
      targetView = null;
    }
    last = { x: ev.offsetX, y: ev.offsetY };
  });

  canvas.addEventListener("pointerup", function (ev) {
    if (dragging && moved < 5) open(dragging);
    dragging = null;
    panning = false;
    last = null;
  });

  canvas.addEventListener(
    "wheel",
    function (ev) {
      ev.preventDefault();
      var f = Math.exp(-ev.deltaY * 0.0015);
      var before = toWorld(ev.offsetX, ev.offsetY);
      view.k = Math.max(0.3, Math.min(2.6, view.k * f));
      var after = toWorld(ev.offsetX, ev.offsetY);
      view.x += after.x - before.x;
      view.y += after.y - before.y;
      targetView = null;
    },
    { passive: false }
  );

  // Links inside an entry jump to that entry instead of scrolling nowhere.
  paneEl.addEventListener("click", function (ev) {
    var a = ev.target.closest("a[href^='#']");
    if (!a) return;
    var slug = a.getAttribute("href").slice(1);
    var target = nodes.filter(function (n) {
      return n.slug === slug;
    })[0];
    if (!target) return;
    ev.preventDefault();
    open(target);
  });

  /* ---------------- controls ---------------- */

  var searchEl = document.getElementById("search");
  var resultsEl = document.getElementById("results");

  searchEl.addEventListener("input", function () {
    var q = searchEl.value.trim().toLowerCase();
    if (!q) {
      resultsEl.hidden = true;
      resultsEl.innerHTML = "";
      return;
    }
    var hits = nodes
      .filter(function (n) {
        return n.term.toLowerCase().indexOf(q) !== -1;
      })
      .slice(0, 8);
    resultsEl.hidden = false;
    resultsEl.innerHTML = hits.length
      ? hits
          .map(function (n) {
            return (
              '<li><button type="button" data-goto="' +
              n.id +
              '">' +
              n.term +
              "</button></li>"
            );
          })
          .join("")
      : "<li class='none'>" + UI.noResults + "</li>";
  });

  document.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-goto]");
    if (!el) return;
    ev.preventDefault();
    open(byId[el.getAttribute("data-goto")]);
    resultsEl.hidden = true;
    searchEl.value = "";
  });

  document.getElementById("reset").addEventListener("click", function () {
    if (!window.confirm(UI.resetConfirm)) return;
    try {
      localStorage.removeItem(STORE_KEY);
    } catch (e) {}
    nodes.forEach(function (n) {
      n.visible = false;
      n.read = false;
      n.shown = 0;
    });
    active = null;
    view = { x: 0, y: 0, k: 1 };
    reveal(byId[seed], null);
    renderPane();
    updateProgress();
  });

  document.getElementById("recenter").addEventListener("click", fitToView);

  var themeBtn = document.querySelector(".theme-btn");
  if (themeBtn)
    themeBtn.addEventListener("click", function () {
      setTimeout(readTheme, 0);
    });
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  if (mq.addEventListener) mq.addEventListener("change", readTheme);

  window.addEventListener("resize", resize);

  /* ---------------- boot ---------------- */

  readTheme();
  resize();

  var saved = load();
  reveal(byId[seed], null);
  if (saved) {
    (saved.shown || []).forEach(function (pair) {
      var n = byId[pair[0]];
      if (n) n.shown = pair[1];
    });
    saved.read.forEach(function (id) {
      var n = byId[id];
      if (n) {
        n.read = true;
        reveal(n, null);
      }
    });
    // Re-offer everything a read entry had already pushed out.
    nodes.forEach(function (n) {
      if (!n.read) return;
      for (var i = 0; i < n.shown && i < n.neighbors.length; i++) {
        reveal(byId[n.neighbors[i]], n);
      }
    });
  }

  var fromHash = location.hash
    ? nodes.filter(function (n) {
        return n.slug === location.hash.slice(1);
      })[0]
    : null;
  if (fromHash) open(fromHash, false);
  else {
    renderPane();
    updateProgress();
  }

  frame();
})();
