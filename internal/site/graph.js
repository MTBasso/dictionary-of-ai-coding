// Graph explorer. Source: internal/site/graph.js
//
// The dictionary's cross-references are dense — 527 links, average degree ~15,
// every entry within two hops of "AI". Revealing a whole neighbourhood per read
// would put all 69 nodes on screen after two clicks, so reveals are rationed:
// opening an entry offers its top REVEAL_BATCH ranked neighbours, and opening
// it again offers the next batch. Search reaches anything directly.
//
// Layout is an orb web. Every node carries the depth at which it was revealed,
// and a radial force pulls it onto the ring for that depth: the seed sits at
// the centre, its neighbours form the first ring, theirs the next. Real links
// then fall naturally into radial spokes and cross-threads. No thread on
// screen is decorative — every one is a real cross-reference between entries.

(function () {
  "use strict";

  var DATA = window.__DICT__;
  if (!DATA) return;

  var REVEAL_BATCH = 3;
  var RING = 172; // distance between web rings, in world units
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
    n.depth = 0;
    n.visible = false;
    n.read = false;
    n.shown = 0; // how many of its ranked neighbours have been offered
    byId[n.id] = n;
  });

  var adj = {};
  nodes.forEach(function (n) {
    adj[n.id] = {};
  });
  DATA.edges.forEach(function (e) {
    adj[e[0]][e[1]] = e[2];
    adj[e[1]][e[0]] = e[2];
  });

  var active = null;
  var seed = DATA.seed;

  /* ---------------- reveal ---------------- */

  // --- orb-web layout -------------------------------------------------
  //
  // Each ring holds a fixed number of evenly spaced slots. A node claims one
  // slot the first time it is revealed and keeps it for good: the hub never
  // moves, and everything already on screen stays exactly where you last saw
  // it while new entries fill outward. Recomputing the whole layout on every
  // reveal — which is what this replaced — reshuffled the web each time you
  // read something, so nothing stayed where you had learned it was.

  function ringRadius(depth) {
    return depth * RING;
  }

  // How many labelled nodes fit around a ring before they collide.
  function ringCapacity(depth) {
    return Math.max(6, Math.floor((2 * Math.PI * ringRadius(depth)) / 96));
  }

  function fract(x) {
    return x - Math.floor(x);
  }

  var slots = {}; // depth -> array of node ids, indexed by slot

  function slotAngle(depth, index) {
    var capacity = ringCapacity(depth);
    // Alternate rings are offset so spokes stagger rather than line up.
    var offset = depth % 2 ? Math.PI / capacity : 0;
    return (index / capacity) * Math.PI * 2 + offset;
  }

  function angleGap(a, b) {
    var d = Math.abs(a - b) % (Math.PI * 2);
    return d > Math.PI ? Math.PI * 2 - d : d;
  }

  function positionFromSlot(node) {
    node.angle = slotAngle(node.depth, node.slot);
    // A little deterministic variation keeps it from looking like a dial.
    var wobble = 0.95 + 0.11 * fract(node.index * 0.6180339887);
    var r = ringRadius(node.depth) * wobble;
    node.tx = Math.cos(node.angle) * r;
    node.ty = Math.sin(node.angle) * r;
  }

  function claimSlot(node, depth, index) {
    if (!slots[depth]) slots[depth] = [];
    slots[depth][index] = node.id;
    node.depth = depth;
    node.slot = index;
    positionFromSlot(node);
  }

  // Innermost ring with a free slot, taking the slot nearest the parent so
  // related entries end up as neighbours on the web.
  function assignSlot(node, parent) {
    if (node.id === seed) {
      node.depth = 0;
      node.slot = 0;
      node.angle = 0;
      node.tx = 0;
      node.ty = 0;
      return;
    }
    var want = parent && parent.angle !== undefined ? parent.angle : 0;
    for (var depth = 1; depth <= 14; depth++) {
      var capacity = ringCapacity(depth);
      if (!slots[depth]) slots[depth] = [];
      var best = -1;
      var bestGap = Infinity;
      for (var i = 0; i < capacity; i++) {
        if (slots[depth][i]) continue;
        var gap = angleGap(slotAngle(depth, i), want);
        if (gap < bestGap) {
          bestGap = gap;
          best = i;
        }
      }
      if (best >= 0) {
        claimSlot(node, depth, best);
        return;
      }
    }
  }

  function reveal(node, near) {
    if (!node || node.visible) return false;
    node.visible = true;
    assignSlot(node, near);
    // Spawn on the parent so it visibly travels out to its place on the web.
    node.x = near ? near.x : node.tx;
    node.y = near ? near.y : node.ty;
    return true;
  }

  function expand(node) {
    var added = 0;
    while (node.shown < node.neighbors.length && added < REVEAL_BATCH) {
      var next = byId[node.neighbors[node.shown]];
      node.shown++;
      if (reveal(next, node)) added++;
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

  /* ---------------- persistence ---------------- */

  function load() {
    try {
      var parsed = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
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
          read: nodes
            .filter(function (n) {
              return n.read;
            })
            .map(function (n) {
              return n.id;
            }),
          shown: nodes
            .filter(function (n) {
              return n.shown > 0;
            })
            .map(function (n) {
              return [n.id, n.shown];
            }),
          // Slot per visible node, so a reload rebuilds the identical web.
          pos: nodes
            .filter(function (n) {
              return n.visible;
            })
            .map(function (n) {
              return [n.id, n.depth, n.slot];
            }),
        })
      );
    } catch (e) {}
  }

  // Rebuild the identical web: every node goes back to the slot it held, so a
  // reload is indistinguishable from never having left.
  function restore(saved) {
    (saved.shown || []).forEach(function (pair) {
      var n = byId[pair[0]];
      if (n) n.shown = pair[1];
    });
    (saved.read || []).forEach(function (id) {
      if (byId[id]) byId[id].read = true;
    });

    slots = {};
    var root = byId[seed];
    root.visible = true;
    assignSlot(root, null);

    (saved.pos || []).forEach(function (entry) {
      var n = byId[entry[0]];
      if (!n || n.id === seed) return;
      n.visible = true;
      claimSlot(n, entry[1], entry[2]);
    });

    // Older saves, and anything read but missing a slot, get one now.
    var legacy = saved.seen || saved.read || [];
    legacy.forEach(function (id) {
      var n = byId[id];
      if (n && !n.visible) {
        n.visible = true;
        assignSlot(n, root);
      }
    });
    nodes.forEach(function (n) {
      if (n.read && !n.visible) {
        n.visible = true;
        assignSlot(n, root);
      }
    });
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
    return (
      '<nav class="related"><h3>' +
      UI.related +
      "</h3><ul>" +
      shown
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
        .join("") +
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

  // `opts.grow` is what separates a click from a page load: reopening an entry
  // deliberately pushes the web out, but restoring one on refresh must not, or
  // the web would creep outward every time the page is reloaded.
  function open(node, opts) {
    if (!node) return;
    var options = opts || {};
    if (reveal(node, active)) ensureFits();
    node.read = true;
    if (options.grow !== false && expand(node)) ensureFits();
    active = node;
    renderPane();
    updateProgress();
    save();
    if (options.push !== false && history.replaceState) {
      history.replaceState(null, "", "#" + node.slug);
    }
    focusOn(node);
  }

  /* ---------------- canvas ---------------- */

  var canvas = document.getElementById("web");
  var ctx = canvas.getContext("2d");
  var view = { x: 0, y: 0, k: 1 };
  var targetView = null;
  var W = 0,
    H = 0,
    DPR = 1;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    var r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    if (Math.abs(r.width - W) < 0.5 && Math.abs(r.height - H) < 0.5) return;
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
      "border-strong",
      "bg",
      "bg-raised",
    ].forEach(function (k) {
      css[k] = s.getPropertyValue("--" + k).trim();
    });
  }

  function visible() {
    return nodes.filter(function (n) {
      return n.visible;
    });
  }

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

  // Bigger circles mean more connections, so the hubs read as hubs.
  function radius(n) {
    var deg = n.neighbors.length;
    return (4 + Math.sqrt(deg) * 1.15 + (n === active ? 2.5 : 0)) * 1;
  }

  function outerRadius() {
    var maxR = RING * 0.6;
    visible().forEach(function (n) {
      var tx = n.tx === undefined ? n.x : n.tx;
      var ty = n.ty === undefined ? n.y : n.ty;
      maxR = Math.max(maxR, Math.sqrt(tx * tx + ty * ty));
    });
    return maxR;
  }

  // The hub stays dead centre. Only the zoom changes as the web grows, so the
  // entries you started from never drift out of view.
  var FIT_PAD = 110;

  function fitToView() {
    if (!visible().length) return;
    view.k = Math.max(
      0.45,
      Math.min(1.35, Math.min(W, H) / (2 * (outerRadius() + FIT_PAD)))
    );
    targetView = { x: 0, y: 0 };
  }

  // Widen the view only when the web has outgrown it.
  function ensureFits() {
    if ((outerRadius() + FIT_PAD) * 2 * view.k > Math.min(W, H)) fitToView();
  }

  // Never pan to the opened entry: the hub stays centred and the web keeps
  // its shape. Only widen the view if the entry sits outside it.
  function focusOn(node) {
    var p = toScreen(node);
    var pad = 60;
    if (p.x > pad && p.x < W - pad && p.y > pad && p.y < H - pad) return;
    fitToView();
  }

  /* ---------------- simulation ---------------- */

  var dragging = null;

  // No force simulation any more: positions ease toward the laid-out target,
  // which keeps the web's shape stable instead of drifting every frame.
  function step() {
    var vis = visible();
    for (var i = 0; i < vis.length; i++) {
      var n = vis[i];
      if (n === dragging) continue;
      if (n.tx === undefined) continue;
      n.x += (n.tx - n.x) * 0.085;
      n.y += (n.ty - n.y) * 0.085;
    }
  }

  /* ---------------- drawing ---------------- */

  // A thread sags toward the middle of the web, the way silk does between
  // radials, instead of running dead straight.
  function threadPath(pa, pb, centre) {
    var mx = (pa.x + pb.x) / 2,
      my = (pa.y + pb.y) / 2;
    var dx = centre.x - mx,
      dy = centre.y - my;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var chord = Math.sqrt(
      (pb.x - pa.x) * (pb.x - pa.x) + (pb.y - pa.y) * (pb.y - pa.y)
    );
    var sag = Math.min(chord * 0.11, 24);
    return { cx: mx + (dx / len) * sag, cy: my + (dy / len) * sag };
  }

  function quadAt(pa, c, pb, t) {
    var u = 1 - t;
    return {
      x: u * u * pa.x + 2 * u * t * c.cx + t * t * pb.x,
      y: u * u * pa.y + 2 * u * t * c.cy + t * t * pb.y,
    };
  }

  function drawRings(centre, vis) {
    var deepest = 0;
    vis.forEach(function (n) {
      deepest = Math.max(deepest, n.depth);
    });
    ctx.strokeStyle = css["border-strong"];
    ctx.globalAlpha = 0.13;
    ctx.lineWidth = 1;
    for (var d = 1; d <= deepest; d++) {
      ctx.beginPath();
      ctx.arc(centre.x, centre.y, ringRadius(d) * view.k, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var vis = visible();
    var centre = toScreen({ x: 0, y: 0 });

    drawRings(centre, vis);

    // threads
    ctx.lineWidth = 1;
    for (var i = 0; i < vis.length; i++) {
      var a = vis[i];
      var nb = adj[a.id];
      for (var id in nb) {
        var b = byId[id];
        if (!b || !b.visible || b.index < a.index) continue;
        var pa = toScreen(a),
          pb = toScreen(b);
        var live = active && (a === active || b === active);
        var c = threadPath(pa, pb, centre);
        ctx.strokeStyle = live ? css.accent : css["fg-muted"];
        ctx.globalAlpha = live ? 0.75 : 0.26;
        ctx.lineWidth = live ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.quadraticCurveTo(c.cx, c.cy, pb.x, pb.y);
        ctx.stroke();
        ctx.lineWidth = 1;

        // Dew on the threads of whatever you are reading.
        if (live && view.k > 0.5) {
          ctx.fillStyle = css.accent;
          ctx.globalAlpha = 0.55;
          for (var t = 0.25; t < 0.9; t += 0.25) {
            var q = quadAt(pa, c, pb, t);
            ctx.beginPath();
            ctx.arc(q.x, q.y, 1.3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
    ctx.globalAlpha = 1;

    // nodes
    for (var n = 0; n < vis.length; n++) {
      var node = vis[n];
      var p = toScreen(node);
      var r = radius(node) * Math.min(view.k, 1.35);

      if (node === active) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 7, 0, Math.PI * 2);
        ctx.strokeStyle = css.accent;
        ctx.globalAlpha = 0.45;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;
      }

      if (node.id === seed) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 4, 0, Math.PI * 2);
        ctx.strokeStyle = css["fg-faint"];
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
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

      var hid = hiddenCount(node);
      if (node.read && hid > 0 && view.k > 0.45) {
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

      if (node === active || node.read || view.k > 0.78) {
        ctx.font =
          (node === active ? "600 " : "") +
          Math.round(Math.max(9, 10 * Math.min(view.k, 1.2))) +
          "px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.letterSpacing = "0.09em";
        ctx.fillStyle = node === active ? css.fg : css["fg-muted"];
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(node.term.toUpperCase(), p.x, p.y + r + 5);
        ctx.letterSpacing = "0px";
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

  var panning = false,
    last = null,
    moved = 0;

  function hit(sx, sy) {
    var w = toWorld(sx, sy);
    var best = null,
      bestD = Infinity;
    visible().forEach(function (n) {
      var dx = n.x - w.x,
        dy = n.y - w.y;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d < (radius(n) + 12) / view.k && d < bestD) {
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
    if (!last) {
      canvas.style.cursor = hit(ev.offsetX, ev.offsetY) ? "pointer" : "grab";
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

  canvas.addEventListener("pointerup", function () {
    if (dragging && moved < 5) open(dragging);
    dragging = null;
    panning = false;
    last = null;
  });

  canvas.addEventListener(
    "wheel",
    function (ev) {
      ev.preventDefault();
      var before = toWorld(ev.offsetX, ev.offsetY);
      view.k = Math.max(
        0.3,
        Math.min(2.6, view.k * Math.exp(-ev.deltaY * 0.0015))
      );
      var after = toWorld(ev.offsetX, ev.offsetY);
      view.x += after.x - before.x;
      view.y += after.y - before.y;
      targetView = null;
    },
    { passive: false }
  );

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
      n.depth = 0;
    });
    active = null;
    view = { x: 0, y: 0, k: 1 };
    targetView = null;
    slots = {};
    assignSlot(byId[seed], null);
    byId[seed].visible = true;
    byId[seed].x = 0;
    byId[seed].y = 0;
    if (history.replaceState) history.replaceState(null, "", location.pathname);
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
  // The pane can change size without the window doing so — the language notice
  // appearing, for one — and a stale bitmap distorts everything drawn into it.
  if (window.ResizeObserver) {
    new ResizeObserver(function () {
      resize();
      ensureFits();
    }).observe(canvas);
  }

  /* ---------------- boot ---------------- */

  readTheme();
  resize();

  var saved = load();
  if (saved) {
    restore(saved);
    // Snap straight onto the laid-out web, so a refresh shows the shape you
    // left rather than an animation of it assembling itself.
    visible().forEach(function (n) {
      n.x = n.tx;
      n.y = n.ty;
    });
  } else {
    byId[seed].visible = true;
    assignSlot(byId[seed], null);
    byId[seed].x = 0;
    byId[seed].y = 0;
  }

  var fromHash = location.hash
    ? nodes.filter(function (n) {
        return n.slug === location.hash.slice(1);
      })[0]
    : null;

  if (fromHash) {
    // Restoring, not clicking: must not grow the web.
    open(fromHash, { grow: false, push: false });
  } else {
    renderPane();
    updateProgress();
  }
  if (saved) fitToView();

  frame();
})();
