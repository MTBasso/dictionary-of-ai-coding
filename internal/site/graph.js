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
  var RING = 205; // distance between web rings, in world units
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

  function place(node, depth) {
    node.visible = true;
    node.depth = depth;
  }

  // --- orb-web layout -------------------------------------------------
  //
  // Nodes are laid out on concentric rings around the seed. Order is breadth
  // first from the hub, so the closer an entry is to where you started, the
  // further in it sits; each ring is filled to the spacing its circumference
  // allows before the next one begins. Rings are therefore "roughly how far
  // out you are", not a strict hop count — the honest structure is in the
  // threads, which are all real cross-references.

  function ringRadius(depth) {
    return depth * RING;
  }

  // How many labelled nodes fit around a ring before they collide.
  function ringCapacity(depth) {
    return Math.max(6, Math.floor((2 * Math.PI * ringRadius(depth)) / 108));
  }

  function fract(x) {
    return x - Math.floor(x);
  }

  function relayout() {
    var vis = visible();
    if (!vis.length) return;
    var root = byId[seed];

    // Breadth-first from the hub through the visible web.
    var seen = {};
    var order = [];
    if (root.visible) {
      seen[root.id] = true;
      order.push(root);
      for (var i = 0; i < order.length; i++) {
        var u = order[i];
        for (var k = 0; k < u.neighbors.length; k++) {
          var v = byId[u.neighbors[k]];
          if (v && v.visible && !seen[v.id]) {
            seen[v.id] = true;
            order.push(v);
          }
        }
      }
    }
    // Anything not reachable from the hub still needs a place.
    vis.forEach(function (n) {
      if (!seen[n.id]) order.push(n);
    });

    root.depth = 0;
    root.angle = 0;
    root.tx = 0;
    root.ty = 0;

    var depth = 1;
    var idx = 1; // order[0] is the hub
    while (idx < order.length) {
      var capacity = Math.min(ringCapacity(depth), order.length - idx);
      var ring = order.slice(idx, idx + capacity);
      // Alternate rings are offset so spokes stagger rather than line up.
      var offset = depth % 2 ? Math.PI / capacity : 0;
      for (var j = 0; j < ring.length; j++) {
        var node = ring[j];
        var angle = (j / ring.length) * Math.PI * 2 + offset;
        // A little deterministic variation keeps it from looking like a dial.
        var wobble = 0.94 + 0.13 * fract(node.index * 0.6180339887);
        node.depth = depth;
        node.angle = angle;
        node.tx = Math.cos(angle) * ringRadius(depth) * wobble;
        node.ty = Math.sin(angle) * ringRadius(depth) * wobble;
      }
      idx += capacity;
      depth++;
    }
  }

  function reveal(node, near) {
    if (!node || node.visible) return false;
    node.visible = true;
    node.depth = near ? near.depth + 1 : 0;
    // Spawn on the parent so it visibly travels out to its place on the web.
    node.x = near ? near.x : 0;
    node.y = near ? near.y : 0;
    node.tx = node.x;
    node.ty = node.y;
    return true;
  }

  function expand(node) {
    var added = 0;
    while (node.shown < node.neighbors.length && added < REVEAL_BATCH) {
      var next = byId[node.neighbors[node.shown]];
      node.shown++;
      if (reveal(next, node)) added++;
    }
    if (added) relayout();
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
          seen: nodes
            .filter(function (n) {
              return n.visible;
            })
            .map(function (n) {
              return n.id;
            }),
        })
      );
    } catch (e) {}
  }

  // Restore exactly the web that was on screen. `seen` covers nodes revealed
  // by opening a neighbour, which no `shown` counter records; older saves
  // without it fall back to the read list.
  function restore(saved) {
    (saved.shown || []).forEach(function (pair) {
      var n = byId[pair[0]];
      if (n) n.shown = pair[1];
    });
    (saved.read || []).forEach(function (id) {
      if (byId[id]) byId[id].read = true;
    });
    var seen = saved.seen && saved.seen.length ? saved.seen : saved.read || [];
    byId[seed].visible = true;
    seen.forEach(function (id) {
      if (byId[id]) byId[id].visible = true;
    });
    nodes.forEach(function (n) {
      if (n.read) n.visible = true;
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
    if (reveal(node, active)) relayout();
    node.read = true;
    if (options.grow !== false) expand(node);
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

  function fitToView() {
    var vis = visible();
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
    var pad = 95;
    view.k = Math.max(
      0.3,
      Math.min(
        1.5,
        Math.min(W / (maxX - minX + pad * 2), H / (maxY - minY + pad * 2))
      )
    );
    targetView = { x: -(minX + maxX) / 2, y: -(minY + maxY) / 2 };
  }

  // Keep the hub centred — panning to each opened node is what stopped the
  // rings reading as a web. Only move the view if the node is off screen.
  function focusOn(node) {
    var p = toScreen(node);
    var pad = 70;
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
        ctx.strokeStyle = live ? css.accent : css["fg-faint"];
        ctx.globalAlpha = live ? 0.65 : 0.1;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.quadraticCurveTo(c.cx, c.cy, pb.x, pb.y);
        ctx.stroke();

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
    place(byId[seed], 0);
    relayout();
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

  /* ---------------- boot ---------------- */

  readTheme();
  resize();

  var saved = load();
  if (saved) {
    restore(saved);
    relayout();
    // Snap straight onto the laid-out web, so a refresh shows the shape you
    // left rather than an animation of it assembling itself.
    visible().forEach(function (n) {
      n.x = n.tx;
      n.y = n.ty;
    });
  } else {
    place(byId[seed], 0);
    relayout();
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
