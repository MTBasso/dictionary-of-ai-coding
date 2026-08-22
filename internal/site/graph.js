// Graph explorer. Source: internal/site/graph.js
//
// The web is organised by the curriculum's seven sections. Each section owns a
// wedge around the centre, and every entry has a fixed slot inside its wedge
// decided by curriculum order — allocated up front, drawn only once revealed.
// The shape therefore never rearranges as you read: it only fills in, and the
// gaps in a wedge are what is left to do.
//
// The centre carries overall progress. Section hubs are visible from the
// start, so the whole of what there is to learn is legible immediately without
// putting all 69 entries on screen at once.

(function () {
  "use strict";

  var DATA = window.__DICT__;
  if (!DATA) return;

  var REVEAL_BATCH = 3;

  // Geometry. The outer radius is fixed by the largest section, so the web
  // occupies the same space from the first frame to the last and the zoom
  // never shifts under you.
  var HUB_R = 150; // section hubs
  var R0 = 225; // first band of entries
  var BAND = 50; // radial gap between bands
  // Two entries across each wedge. Wider than that and the labels collide:
  // a wedge is only ~51 degrees, which at the inner band is barely 70px per
  // column, and a term like "Next-token prediction" needs far more.
  var COLS = 2;
  var GUTTER = 0.13; // radians of empty space between wedges

  var UI = DATA.ui;
  var STORE_KEY = "dict-read-" + DATA.locale;

  var nodes = DATA.nodes;
  var sections = DATA.sections;
  var byId = {};

  /* ---------------- layout ---------------- */

  var TAU = Math.PI * 2;
  var wedge = TAU / sections.length;
  // The largest section sets the web's extent; it never changes, so the zoom
  // is fixed from the first frame.
  var WEB_RADIUS = 0;

  // Section 1 is centred at the top; the rest run clockwise from there.
  function sectionAngle(index) {
    return index * wedge - Math.PI / 2;
  }

  // Columns across the wedge, bands outward from the centre. Entry 0 sits
  // innermost-leftmost, so curriculum order reads inward-out.
  function slotFor(sectionIndex, order, count) {
    var cols = Math.min(COLS, count);
    var band = Math.floor(order / cols);
    var col = order % cols;
    var span = wedge - GUTTER;
    var start = sectionAngle(sectionIndex) - span / 2;
    var angle = start + ((col + 0.5) / cols) * span;
    var radius = R0 + band * BAND;
    return { angle: angle, radius: radius, col: col };
  }

  sections.forEach(function (s) {
    var bands = Math.ceil(s.count / Math.min(COLS, s.count));
    WEB_RADIUS = Math.max(WEB_RADIUS, R0 + (bands - 1) * BAND);
    s.read = 0;
    s.seen = 0;
    var a = sectionAngle(s.index);
    s.x = Math.cos(a) * HUB_R;
    s.y = Math.sin(a) * HUB_R;
    s.angle = a;
  });

  nodes.forEach(function (n, i) {
    n.index = i;
    var section = sections[n.sectionIndex];
    var slot = slotFor(n.sectionIndex, n.orderInSection, section.count);
    n.col = slot.col;
    n.tx = Math.cos(slot.angle) * slot.radius;
    n.ty = Math.sin(slot.angle) * slot.radius;
    // Entries fly out from their section hub when revealed.
    n.x = section.x;
    n.y = section.y;
    n.visible = false;
    n.read = false;
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
  var focus = null; // section index whose wedge is highlighted

  /* ---------------- reveal ---------------- */

  function recount() {
    sections.forEach(function (s) {
      s.read = 0;
      s.seen = 0;
    });
    nodes.forEach(function (n) {
      var s = sections[n.sectionIndex];
      if (n.visible) s.seen++;
      if (n.read) s.read++;
    });
  }

  function reveal(node, from) {
    if (!node || node.visible) return false;
    node.visible = true;
    var origin = from || sections[node.sectionIndex];
    node.x = origin.x;
    node.y = origin.y;
    return true;
  }

  // Reading an entry pulls in its neighbours, preferring ones from the same
  // section so a chapter can actually be finished before you wander.
  function expandFrom(node) {
    var here = [];
    var elsewhere = [];
    node.neighbors.forEach(function (id) {
      var v = byId[id];
      if (!v || v.visible) return;
      (v.sectionIndex === node.sectionIndex ? here : elsewhere).push(v);
    });
    var queue = here.concat(elsewhere);
    var added = 0;
    for (var i = 0; i < queue.length && added < REVEAL_BATCH; i++) {
      if (reveal(queue[i], node)) added++;
    }
    return added;
  }

  // Selecting a section opens the next of its entries in curriculum order.
  function revealSection(index, howMany) {
    var added = 0;
    for (var i = 0; i < nodes.length && added < howMany; i++) {
      var n = nodes[i];
      if (n.sectionIndex === index && !n.visible && reveal(n, null)) added++;
    }
    return added;
  }

  /* ---------------- persistence ---------------- */
  // Slots come from curriculum order, so only what you have read and what is
  // on screen needs saving. No positions.

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

  function restore(saved) {
    (saved.read || []).forEach(function (id) {
      if (byId[id]) byId[id].read = true;
    });
    var seen = saved.seen && saved.seen.length ? saved.seen : saved.read || [];
    seen.forEach(function (id) {
      var n = byId[id];
      if (n) {
        n.visible = true;
        n.x = n.tx;
        n.y = n.ty;
      }
    });
    nodes.forEach(function (n) {
      if (n.read && !n.visible) {
        n.visible = true;
        n.x = n.tx;
        n.y = n.ty;
      }
    });
  }

  /* ---------------- reading pane ---------------- */

  var paneEl = document.getElementById("pane");
  var progressEl = document.getElementById("progress");
  var legendEl = document.querySelector(".legend");

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
            '<li><a class="sec-' +
            (v.sectionIndex + 1) +
            '" href="#' +
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
      var first = sections[0];
      paneEl.innerHTML =
        '<div class="welcome"><h2>' +
        UI.welcomeTitle +
        "</h2><p>" +
        UI.welcomeBody +
        '</p><p><button type="button" class="start" data-section="0">' +
        UI.startAction.replace("%section%", first.shortLabel) +
        "</button></p></div>";
      return;
    }
    paneEl.innerHTML =
      '<article class="entry"><h2>' +
      active.term +
      '</h2><p class="sect sec-' +
      (active.sectionIndex + 1) +
      '">' +
      active.section +
      "</p>" +
      DATA.entries[active.id] +
      "</article>" +
      relatedList(active);
    paneEl.scrollTop = 0;
  }

  function updateProgress() {
    recount();
    var read = nodes.filter(function (n) {
      return n.read;
    }).length;
    progressEl.textContent = UI.progress
      .replace("%read%", read)
      .replace("%total%", nodes.length);

    sections.forEach(function (s) {
      var el = legendEl.querySelector('[data-count="' + s.index + '"]');
      if (el) el.textContent = s.read + "/" + s.count;
      var btn = legendEl.querySelector('[data-section="' + s.index + '"]');
      if (btn) {
        btn.classList.toggle("done", s.read === s.count);
        btn.classList.toggle("focused", focus === s.index);
        btn.setAttribute(
          "title",
          s.label + (s.read === s.count ? " — " + UI.sectionDone : "")
        );
      }
    });
  }

  function open(node, opts) {
    if (!node) return;
    var options = opts || {};
    reveal(node, active);
    node.read = true;
    if (options.grow !== false) expandFrom(node);
    active = node;
    focus = node.sectionIndex;
    renderPane();
    updateProgress();
    save();
    if (options.push !== false && history.replaceState) {
      history.replaceState(null, "", "#" + node.slug);
    }
    focusWedge(sections[node.sectionIndex]);
  }

  function selectSection(index) {
    focus = index;
    revealSection(index, REVEAL_BATCH);
    updateProgress();
    save();
    focusWedge(sections[index]);
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
    if (!targetView) view.k = wholeWebZoom();
  }

  var css = {};
  var SECTION_COLOURS = [];
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
      "bg-sunken",
    ].forEach(function (k) {
      css[k] = s.getPropertyValue("--" + k).trim();
    });
    SECTION_COLOURS = sections.map(function (_, i) {
      return s.getPropertyValue("--sec-" + (i + 1)).trim() || css.accent;
    });
  }

  function wholeWebZoom() {
    return Math.max(
      0.3,
      Math.min(1.3, Math.min(W, H) / (2 * (WEB_RADIUS + 74)))
    );
  }

  // The whole web, hub centred. The extent is fixed whether or not entries
  // have been revealed, so this never shifts as you read.
  function fitToView() {
    targetView = { x: 0, y: 0, k: wholeWebZoom() };
  }

  // Move onto one wedge. At whole-web zoom a wedge is ~40px per column, which
  // is narrower than the terms written in it; framing the wedge is what makes
  // its labels readable, and it is why selecting a section focuses rather than
  // merely highlights.
  function focusWedge(section) {
    var near = HUB_R;
    var far = WEB_RADIUS + 46;
    var mid = (near + far) / 2;
    var k = Math.max(
      wholeWebZoom(),
      Math.min(1.5, Math.min(W, H) / (far - near + 130))
    );
    targetView = {
      x: -Math.cos(section.angle) * mid,
      y: -Math.sin(section.angle) * mid,
      k: k,
    };
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

  function radius(n) {
    return 4.5 + Math.sqrt(n.neighbors.length) * 1.0 + (n === active ? 2.5 : 0);
  }

  function step() {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (!n.visible || n === dragging) continue;
      n.x += (n.tx - n.x) * 0.12;
      n.y += (n.ty - n.y) * 0.12;
    }
  }

  /* ---------------- drawing ---------------- */

  function threadControl(pa, pb, centre) {
    var mx = (pa.x + pb.x) / 2,
      my = (pa.y + pb.y) / 2;
    var dx = centre.x - mx,
      dy = centre.y - my;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var chord = Math.sqrt(
      (pb.x - pa.x) * (pb.x - pa.x) + (pb.y - pa.y) * (pb.y - pa.y)
    );
    var sag = Math.min(chord * 0.1, 20);
    return { cx: mx + (dx / len) * sag, cy: my + (dy / len) * sag };
  }

  function dim(sectionIndex) {
    return focus === null || focus === sectionIndex ? 1 : 0.28;
  }

  function drawCentre(centre) {
    var read = 0;
    for (var i = 0; i < nodes.length; i++) if (nodes[i].read) read++;
    var r = 40 * view.k;
    var done = read === nodes.length;

    ctx.beginPath();
    ctx.arc(centre.x, centre.y, r, 0, TAU);
    ctx.strokeStyle = css.border;
    ctx.lineWidth = 4;
    ctx.stroke();

    if (read) {
      ctx.beginPath();
      ctx.arc(
        centre.x,
        centre.y,
        r,
        -Math.PI / 2,
        -Math.PI / 2 + TAU * (read / nodes.length)
      );
      ctx.strokeStyle = done ? css.accent : css["fg-muted"];
      ctx.lineWidth = 4;
      ctx.stroke();
    }
    ctx.lineWidth = 1;

    ctx.fillStyle = done ? css.accent : css.fg;
    ctx.font =
      "600 " +
      Math.round(Math.max(11, 13 * view.k)) +
      "px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      done ? UI.allDone : read + "/" + nodes.length,
      centre.x,
      centre.y
    );
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var centre = toScreen({ x: 0, y: 0 });

    // Wedge backdrops, so the seven neighbourhoods are legible even empty.
    sections.forEach(function (s) {
      var span = wedge - GUTTER;
      var start = s.angle - span / 2;
      ctx.beginPath();
      ctx.moveTo(centre.x, centre.y);
      ctx.arc(
        centre.x,
        centre.y,
        (WEB_RADIUS + 42) * view.k,
        start,
        start + span
      );
      ctx.closePath();
      ctx.fillStyle = SECTION_COLOURS[s.index];
      ctx.globalAlpha = (focus === s.index ? 0.1 : 0.045) * dim(s.index);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Threads. Within-section always; cross-section only where they touch the
    // entry being read, since those are the ones that make a hairball.
    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      if (!a.visible) continue;
      for (var id in adj[a.id]) {
        var b = byId[id];
        if (!b || !b.visible || b.index < a.index) continue;
        var live = active && (a === active || b === active);
        var same = a.sectionIndex === b.sectionIndex;
        if (!same && !live) continue;
        var pa = toScreen(a),
          pb = toScreen(b);
        var c = threadControl(pa, pb, centre);
        ctx.strokeStyle = live
          ? css.accent
          : SECTION_COLOURS[a.sectionIndex] || css["fg-muted"];
        ctx.globalAlpha =
          (live ? 0.7 : 0.3) *
          Math.min(dim(a.sectionIndex), dim(b.sectionIndex));
        ctx.lineWidth = live ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.quadraticCurveTo(c.cx, c.cy, pb.x, pb.y);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;

    drawCentre(centre);

    // Section hubs.
    sections.forEach(function (s) {
      var p = toScreen(s);
      var complete = s.read === s.count;
      var r = 14 * Math.min(view.k, 1.2);
      ctx.globalAlpha = dim(s.index);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, TAU);
      ctx.fillStyle = complete ? SECTION_COLOURS[s.index] : css["bg-raised"];
      ctx.fill();
      ctx.strokeStyle = SECTION_COLOURS[s.index];
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.lineWidth = 1;

      ctx.fillStyle = complete ? css.bg : SECTION_COLOURS[s.index];
      ctx.font = "600 11px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(s.index + 1), p.x, p.y + 0.5);

      ctx.fillStyle = css["fg-muted"];
      ctx.font =
        Math.round(Math.max(9, 10 * view.k)) +
        "px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.letterSpacing = "0.08em";
      ctx.textBaseline = "top";
      ctx.fillText(s.read + "/" + s.count, p.x, p.y + r + 4);
      ctx.letterSpacing = "0px";
      ctx.globalAlpha = 1;
    });

    // Entries.
    for (var j = 0; j < nodes.length; j++) {
      var node = nodes[j];
      if (!node.visible) continue;
      var p = toScreen(node);
      var r = radius(node) * Math.min(view.k, 1.3);
      var colour = SECTION_COLOURS[node.sectionIndex] || css.accent;
      ctx.globalAlpha = dim(node.sectionIndex);

      if (node === active) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 6, 0, TAU);
        ctx.strokeStyle = colour;
        ctx.globalAlpha = 0.45 * dim(node.sectionIndex);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.globalAlpha = dim(node.sectionIndex);
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, TAU);
      if (node.read) {
        ctx.fillStyle = colour;
        ctx.fill();
      } else {
        ctx.fillStyle = css["bg-raised"];
        ctx.fill();
        ctx.strokeStyle = colour;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.lineWidth = 1;
      }

      // Label only what can actually be read: the open entry, and read
      // entries in the wedge you are working in. Everything else waits for
      // zoom. Columns alternate above/below so neighbours never collide.
      var labelled =
        node === active ||
        view.k > 0.95 ||
        (node.read && (focus === null || focus === node.sectionIndex));
      if (labelled) {
        ctx.font =
          (node === active ? "600 " : "") +
          Math.round(Math.max(9, 10 * Math.min(view.k, 1.2))) +
          "px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.letterSpacing = "0.08em";
        ctx.fillStyle = node === active ? css.fg : css["fg-muted"];
        ctx.textAlign = "center";
        var above = node.col % 2 === 1;
        ctx.textBaseline = above ? "bottom" : "top";
        ctx.fillText(
          node.term.toUpperCase(),
          p.x,
          above ? p.y - r - 4 : p.y + r + 4
        );
        ctx.letterSpacing = "0px";
      }
      ctx.globalAlpha = 1;
    }
  }

  function frame() {
    if (targetView) {
      view.x += (targetView.x - view.x) * 0.1;
      view.y += (targetView.y - view.y) * 0.1;
      if (targetView.k) view.k += (targetView.k - view.k) * 0.1;
      if (
        Math.abs(targetView.x - view.x) < 0.5 &&
        Math.abs(targetView.y - view.y) < 0.5 &&
        (!targetView.k || Math.abs(targetView.k - view.k) < 0.005)
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
      var d = Math.sqrt((n.x - w.x) * (n.x - w.x) + (n.y - w.y) * (n.y - w.y));
      if (d < (radius(n) + 12) / view.k && d < bestD) {
        best = n;
        bestD = d;
      }
    });
    if (best) return { node: best };
    var bestSection = null;
    sections.forEach(function (s) {
      var d = Math.sqrt((s.x - w.x) * (s.x - w.x) + (s.y - w.y) * (s.y - w.y));
      if (d < 26 / view.k && d < bestD) {
        bestSection = s;
        bestD = d;
      }
    });
    return bestSection ? { section: bestSection } : null;
  }

  canvas.addEventListener("pointerdown", function (ev) {
    canvas.setPointerCapture(ev.pointerId);
    last = { x: ev.offsetX, y: ev.offsetY };
    moved = 0;
    var h = hit(ev.offsetX, ev.offsetY);
    if (h && h.node) dragging = h.node;
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
    } else if (panning) {
      view.x += dx / view.k;
      view.y += dy / view.k;
      targetView = null;
    }
    last = { x: ev.offsetX, y: ev.offsetY };
  });

  canvas.addEventListener("pointerup", function (ev) {
    if (moved < 5) {
      var h = hit(ev.offsetX, ev.offsetY);
      if (h && h.node) open(h.node);
      else if (h && h.section) selectSection(h.section.index);
    }
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
        Math.min(2.4, view.k * Math.exp(-ev.deltaY * 0.0015))
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
    if (!a || a.hasAttribute("data-goto")) return;
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
              '<li><button type="button" class="sec-' +
              (n.sectionIndex + 1) +
              '" data-goto="' +
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
    var go = ev.target.closest("[data-goto]");
    if (go) {
      ev.preventDefault();
      open(byId[go.getAttribute("data-goto")]);
      resultsEl.hidden = true;
      searchEl.value = "";
      return;
    }
    var sec = ev.target.closest("[data-section]");
    if (sec) {
      ev.preventDefault();
      selectSection(Number(sec.getAttribute("data-section")));
    }
  });

  document.getElementById("reset").addEventListener("click", function () {
    if (!window.confirm(UI.resetConfirm)) return;
    try {
      localStorage.removeItem(STORE_KEY);
    } catch (e) {}
    nodes.forEach(function (n) {
      n.visible = false;
      n.read = false;
      n.x = sections[n.sectionIndex].x;
      n.y = sections[n.sectionIndex].y;
    });
    active = null;
    focus = null;
    fitToView();
    if (history.replaceState) history.replaceState(null, "", location.pathname);
    renderPane();
    updateProgress();
  });

  // Back out to the whole web — the seven wedges and where you are in each.
  document.getElementById("recenter").addEventListener("click", function () {
    focus = null;
    fitToView();
    updateProgress();
  });

  var themeBtn = document.querySelector(".theme-btn");
  if (themeBtn)
    themeBtn.addEventListener("click", function () {
      setTimeout(readTheme, 0);
    });
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  if (mq.addEventListener) mq.addEventListener("change", readTheme);
  window.addEventListener("resize", resize);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);

  /* ---------------- boot ---------------- */

  readTheme();
  resize();
  view.k = wholeWebZoom();

  var saved = load();
  if (saved) restore(saved);

  var fromHash = location.hash
    ? nodes.filter(function (n) {
        return n.slug === location.hash.slice(1);
      })[0]
    : null;

  if (fromHash) open(fromHash, { grow: false, push: false });
  else {
    renderPane();
    updateProgress();
  }

  frame();
})();
