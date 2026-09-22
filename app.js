/* SR Weekend map reference. Layout code only. Content lives in locations.js. */
(function () {
  "use strict";

  const DATA = window.SR_MAP;
  const CFG = DATA.config;
  const W = 390, H = 686;
  const SVGNS = "http://www.w3.org/2000/svg";
  const params = new URLSearchParams(location.search);
  const isDesktop = () => window.matchMedia("(min-width: 900px)").matches;

  const $ = (id) => document.getElementById(id);
  const app = $("app"), stage = $("stage"), stageWrap = $("stageWrap"), base = $("base"),
        overlay = $("overlay"), card = $("card"), cardBody = $("cardBody"), panelEmpty = $("panelEmpty");

  if (params.get("clean") === "1") document.body.classList.add("clean");
  if (params.get("debug") === "1") document.body.classList.add("debug");

  const locs = DATA.locations.filter((l) => l.enabled !== false);
  const byId = Object.fromEntries(locs.map((l) => [l.id, l]));
  const state = { sel: null, point: 0, view: "denver" };

  $("brandName").textContent = CFG.eventName;
  $("brandSub").textContent = CFG.hotelName;
  $("brandSub").dataset.full = CFG.hotelName + ", " + CFG.hotelAddress.split(",")[0];

  /* ---------------- Icons ---------------- */
  const ICON = {
    help: '<path d="M9.2 9.2a2.9 2.9 0 1 1 4.1 2.6c-.8.4-1.3 1-1.3 1.8v.6"/><path d="M12 17.6v.2"/>',
    bag: '<path d="M5.5 8.5h13l-1 11h-11z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/>',
    cup: '<path d="M5 9h10.5v4.5A4.5 4.5 0 0 1 11 18h-1.5A4.5 4.5 0 0 1 5 13.5z"/><path d="M15.5 10.5h1.5a2 2 0 0 1 0 4h-1.5"/>',
    headphones: '<path d="M4.5 15v-2.5a7.5 7.5 0 0 1 15 0V15"/><path d="M4.5 14.5h3v5h-3zM16.5 14.5h3v5h-3z"/>',
    camera: '<path d="M4 8.5h3.5l1.8-2.2h5.4l1.8 2.2H20v10H4z"/><circle cx="12" cy="13.3" r="3"/>',
    layers: '<path d="M12 4.5l8 4.2-8 4.2-8-4.2z"/><path d="M4 13.3l8 4.2 8-4.2"/>',
    disc: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="1.8"/>',
    glass: '<path d="M7 5h10l-5 7z"/><path d="M12 12v6.5M8.5 19h7"/>',
    wave: '<path d="M3.5 12c2.5-3.5 5.5 3.5 8.5 0s6 3.5 8.5 0"/>'
  };
  const icon = (name) => name && ICON[name] ? `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[name]}</svg>` : "";
  const ARROW = {
    w: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    e: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    ne: '<path d="M7 17L17 7M9 7h8v8"/>',
    nw: '<path d="M17 17L7 7M15 7H7v8"/>'
  };

  /* ---------------- Hand-drawn line helpers ---------------- */
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  let seedCounter = 7;
  function wobblePts(pts, closed, amp) {
    const r = rng(seedCounter++ * 977);
    const out = [];
    const n = closed ? pts.length : pts.length - 1;
    for (let i = 0; i < n; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const len = Math.hypot(dx, dy);
      const steps = Math.max(1, Math.round(len / 16));
      const nx = -dy / (len || 1), ny = dx / (len || 1);
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        const j = s === 0 ? (r() - 0.5) * amp * 0.6 : (r() - 0.5) * 2 * amp;
        out.push([a[0] + dx * t + nx * j, a[1] + dy * t + ny * j]);
      }
    }
    if (!closed) out.push(pts[pts.length - 1]);
    return out;
  }
  function smoothPath(pts, closed) {
    const f = (p) => p[0].toFixed(1) + " " + p[1].toFixed(1);
    if (pts.length < 3) return "M" + f(pts[0]) + " L" + f(pts[1]);
    let d = "";
    if (closed) {
      const m0 = mid(pts[pts.length - 1], pts[0]);
      d = "M" + f(m0);
      for (let i = 0; i < pts.length; i++) d += " Q" + f(pts[i]) + " " + f(mid(pts[i], pts[(i + 1) % pts.length]));
      return d + " Z";
    }
    d = "M" + f(pts[0]);
    for (let i = 1; i < pts.length - 1; i++) d += " Q" + f(pts[i]) + " " + f(mid(pts[i], pts[i + 1]));
    return d + " L" + f(pts[pts.length - 1]);
  }
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const hLine = (pts, amp = 0.7) => smoothPath(wobblePts(pts, false, amp), false);
  const hRect = (x, y, w, h, amp = 0.7) => smoothPath(wobblePts([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true, amp), true);

  function el(tag, attrs, parent) {
    const n = document.createElementNS(SVGNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    (parent || base).appendChild(n);
    return n;
  }
  function text(str, x, y, cls, extra) {
    const t = el("text", Object.assign({ x, y, class: cls }, extra || {}));
    t.textContent = str;
    return t;
  }

  /* ---------------- Base map ---------------- */
  function drawBase() {
    base.innerHTML = "";
    seedCounter = 7;
    const city = el("g", { class: "city-layer" });

    // A light hint of the diagonal downtown grid, top and bottom bands only.
    // Everywhere except under the hotel footprint. The sides only show on wide screens.
    const mask = el("mask", { id: "streets", maskUnits: "userSpaceOnUse", x: -700, y: -400, width: W + 1400, height: 1500 }, el("defs", {}));
    el("rect", { x: -700, y: -400, width: W + 1400, height: 1500, fill: "#fff" }, mask);
    el("rect", { x: 8, y: 118, width: 374, height: 484, rx: 10, fill: "#000" }, mask);
    const grid = el("g", { mask: "url(#streets)" }, city);
    for (let c = -1040; c <= 1400; c += 110) el("path", { class: "street", d: hLine([[c - 400, -400], [c + 1100, 1100]], 0.9) }, grid);
    for (let c = -500; c <= 1900; c += 130) el("path", { class: "street", d: hLine([[c + 400, -400], [c - 1100, 1100]], 0.9) }, grid);

    // 16th Street Mall, running northwest from the hotel to Union Station.
    el("path", { class: "mall", d: hLine([[300, 306], [84, 90]], 0.6) }, city);
    el("path", { class: "mall", d: hLine([[306, 300], [90, 84]], 0.6) }, city);
    text("16th St Mall", 0, 0, "mono", { transform: "translate(128 98) rotate(45)", "text-anchor": "middle", style: "font-size:9.5px" }).parentNode === base && city.appendChild(base.lastChild);

    // Union Station, the one downtown landmark.
    const us = el("g", { transform: "translate(16 18)" }, city);
    el("path", { class: "plate", d: hRect(0, 22, 18, 16, 0.3) }, us);
    el("path", { class: "plate", d: hRect(56, 22, 18, 16, 0.3) }, us);
    el("path", { class: "plate", d: hRect(18, 12, 38, 26, 0.3) }, us);
    el("path", { class: "ln-thin", d: "M18 12 L37 6 L56 12" }, us);
    el("path", { class: "ln-thin", d: "M23 38 V26 a3.5 3.5 0 0 1 7 0 V38 M33.5 38 V26 a3.5 3.5 0 0 1 7 0 V38 M44 38 V26 a3.5 3.5 0 0 1 7 0 V38" }, us);
    el("path", { class: "ln-thin", d: hLine([[20, -3], [54, -3]], 0.3) + " M24 -3 V7 M50 -3 V8.2" }, us);
    el("path", { class: "ln-thin", d: "M4 28h10 M60 28h10 M4 33h10 M60 33h10" }, us);
    text("Union Station", 16, 67, "mono", {});
    city.appendChild(base.lastChild);

    // Court Pl along the front of the hotel.
    el("path", { class: "street", style: "stroke:rgba(18,17,17,.34)", d: hLine([[0, 614], [W, 614]], 0.6) }, city);
    text("Court Pl", 312, 630, "mono", {});
    city.appendChild(base.lastChild);

    // Compass and the cactus.
    const cmp = el("g", { transform: "translate(364 178)" });
    el("path", { class: "ln", d: "M0 30 L0 4 M-5 10 L0 3 L5 10" }, cmp);
    text("N", -3.5, 42, "mono-strong", {}); cmp.appendChild(base.lastChild);
    const cac = el("g", { transform: "translate(292 62) scale(0.95)" });
    el("path", { class: "ln", d: hLine([[13, 48], [13, 6], [13.5, 4]], 0.3) + " M8 48 V10 a5 5 0 0 1 10 0 V48" }, cac);
    el("path", { class: "ln", d: "M8 30 H4 a3 3 0 0 1 -3 -3 V19 M18 24 H22 a3 3 0 0 0 3 -3 V13" }, cac);
    el("path", { class: "ln-thin", d: hLine([[-2, 48.5], [28, 48.5]], 0.4) }, cac);

    // Hotel plates, drawn as two stacked sheets.
    DATA.plates.forEach((p) => {
      el("path", { class: "plate-shadow", d: hRect(p.x + 5, p.y + 5, p.w, p.h, 0.5) });
    });
    DATA.plates.forEach((p) => {
      el("path", { class: "plate", d: hRect(p.x, p.y, p.w, p.h, 0.6) });
      const tabEl = el("path", { class: "tab" });
      const t = text(p.tab, p.x + 8, p.y - 3.5, "tab-text", {});
      const tw = t.getComputedTextLength() + 16;
      tabEl.setAttribute("d", `M${p.x} ${p.y} V${p.y - 13} a4 4 0 0 1 4 -4 H${p.x + tw - 4} a4 4 0 0 1 4 4 V${p.y} Z`);
    });

    // Rooms
    DATA.areas.forEach((a) => {
      if (a.for && !byId[a.for]) return;
      el("path", { class: "room", "data-for": a.for || "", d: hRect(a.x, a.y, a.w, a.h, 0.5) });
    });
    const par = DATA.areas.find((a) => a.id === "parlur");
    if (par) {
      // Street entrance on the outside wall, hotel entrance into the lobby.
      el("path", { class: "door", style: "stroke:var(--paper);stroke-width:5", d: `M${par.x - 12} ${par.doorLeft - 9} V${par.doorLeft + 9}` });
      el("path", { class: "door", style: "stroke:var(--crimson-tint);stroke-width:4", d: `M${par.x} ${par.doorLeft - 9} V${par.doorLeft + 9}` });
      el("path", { class: "door", style: "stroke:var(--crimson-tint);stroke-width:4", d: `M${par.x + par.w} ${par.doorRight - 9} V${par.doorRight + 9}` });
      el("path", { class: "ln", d: `M1 ${par.doorLeft} H${par.x - 4} M${par.x - 9} ${par.doorLeft - 5} L${par.x - 4} ${par.doorLeft} L${par.x - 9} ${par.doorLeft + 5}` });
      text("Street entrance", 0, 0, "mono", { transform: `translate(10 ${par.doorLeft + 104}) rotate(-90)`, style: "font-size:9.5px" });
    }
    const ball = DATA.areas.find((a) => a.id === "ballroom");
    if (ball && byId[ball.for]) text(ball.note, ball.x + 8, ball.y + ball.h - 10, "room-note", {});

    // Escalators between the plates.
    const ex = 206;
    el("path", { class: "ln-thin", d: `M${ex} 322 V374 M${ex + 16} 322 V374` });
    for (let y = 328; y < 372; y += 7) el("path", { class: "hatch", d: `M${ex} ${y} H${ex + 16}` });
    text("Escalators", ex + 24, 352, "mono", {});

    // Front desk and fireplace wall, for orientation.
    el("path", { class: "plate", style: "fill:var(--plate-shadow)", d: hRect(334, 404, 20, 84, 0.4) });
    text("Front desk", 366, 504, "mono", { "text-anchor": "end" });
    for (let y = 524; y < 578; y += 6) el("path", { class: "hatch", d: `M364 ${y} l8 -5` });
    text("Fireplace", 0, 0, "mono", { transform: "translate(360 578) rotate(-90)", style: "font-size:9.5px" });
    text("Lobby", 214, 512, "mono", {});

    // Main entrance
    el("path", { class: "door", style: "stroke:var(--paper);stroke-width:5", d: "M252 592 H290" });
    el("path", { class: "ln", d: "M271 608 V584 M266 589 L271 583 L276 589" });
    text("Main entrance", 281, 606, "mono", {});
  }

  /* ---------------- Overlay ---------------- */
  const pctX = (x) => (x / W * 100) + "%";
  const pctY = (y) => (y / H * 100) + "%";

  function buildOverlay() {
    overlay.innerHTML = "";

    DATA.areas.forEach((a) => {
      if (!a.for || !byId[a.for]) return;
      const b = document.createElement("button");
      b.className = "area-hit";
      b.type = "button";
      b.tabIndex = -1;
      b.setAttribute("aria-hidden", "true");
      Object.assign(b.style, { left: pctX(a.x), top: pctY(a.y), width: pctX(a.w), height: pctY(a.h) });
      b.addEventListener("click", (e) => { e.stopPropagation(); select(a.for, 0); });
      overlay.appendChild(b);
    });

    locs.forEach((loc) => {
      (loc.map || []).forEach((pt, i) => {
        if (loc.type === "edge") return overlay.appendChild(buildChip(loc, pt, i));
        overlay.appendChild(buildMarker(loc, pt, i));
      });
    });
  }

  function buildMarker(loc, pt, i) {
    const b = document.createElement("button");
    b.type = "button";
    const tier = loc.type === "help" ? "help" : loc.type === "city" ? "city" : loc.minor ? "minor" : "hotel";
    b.className = "mk mk--" + tier + (tier === "minor" ? " mk--hotelish" : "");
    b.dataset.id = loc.id;
    b.dataset.i = i;
    b.style.left = pctX(pt.x);
    b.style.top = pctY(pt.y);
    const tagTxt = pt.tag ? ` <span class="tag">${esc(pt.tag)}</span>` : "";
    const lbl = loc.label && tier !== "minor" ? `<span class="lbl lbl--${pt.label || "right"}${pt.tagBelow ? " tag-below" : ""}">${esc(loc.label)}${tagTxt}</span>` : "";
    b.innerHTML = `<span class="dot">${tier === "city" ? "" : icon(pt.icon)}</span>${lbl}`;
    b.setAttribute("aria-label", loc.name + (pt.tag ? ", " + pt.tag : ""));
    b.addEventListener("click", (e) => { e.stopPropagation(); select(loc.id, i); });
    return b;
  }

  function buildChip(loc, pt, i) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.dataset.id = loc.id;
    b.dataset.i = i;
    b.style.top = pctY(pt.y);
    if (pt.anchor === "right") b.style.right = pctX(W - pt.x); else b.style.left = pctX(pt.x);
    const arrow = `<svg class="chip-arrow" viewBox="0 0 24 24" aria-hidden="true">${ARROW[pt.arrow] || ARROW.e}</svg>`;
    const rocks = pt.icon === "rocks"
      ? '<svg class="chip-rocks" viewBox="0 0 36 24" aria-hidden="true"><path d="M1 22 L7 9 L11 13 L16 3 L22 12 L26 8 L35 22 Z" fill="#BA514E" stroke="#121111" stroke-width="1.6" stroke-linejoin="round"/></svg>'
      : "";
    const txt = `<span class="chip-txt"><span class="chip-name">${esc(loc.label || loc.name)}</span><span class="chip-dist">${esc(loc.distance)}</span></span>`;
    const inner = pt.anchor === "right" ? `${rocks}${txt}${arrow}` : `${arrow}${rocks}${txt}`;
    if (pt.anchor === "right") b.classList.add("chip--right");
    b.innerHTML = `<span class="chip-in">${inner}</span>`;
    b.setAttribute("aria-label", `${loc.name}, about ${loc.distance}, off map`);
    b.addEventListener("click", (e) => { e.stopPropagation(); select(loc.id, i); });
    return b;
  }

  /* ---------------- Card ---------------- */
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const tbc = '<span class="tbc">TBC</span>';
  const val = (s) => s === "TBC" ? tbc.replace('class="tbc"', 'class="tbc" style="margin-left:0"') : esc(s);

  const enc = encodeURIComponent;
  function mapsUrls(cta, loc) {
    const addr = cta.address || loc.address;
    if (!addr) return null;
    if (cta.kind === "apple-directions") {
      return { apple: "https://maps.apple.com/?daddr=" + enc(addr), google: "https://www.google.com/maps/dir/?api=1&destination=" + enc(addr) };
    }
    const q = cta.query || loc.name;
    return { apple: "https://maps.apple.com/?q=" + enc(q) + "&address=" + enc(addr), google: "https://www.google.com/maps/search/?api=1&query=" + enc(q + ", " + addr) };
  }

  const PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>';
  const LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>';
  const CHAT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 5.5h15v10h-8l-4 3.5v-3.5h-3z"/></svg>';
  const LIST = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7h11M9 12h11M9 17h11"/><circle cx="4.8" cy="7" r="1"/><circle cx="4.8" cy="12" r="1"/><circle cx="4.8" cy="17" r="1"/></svg>';

  function renderCard(loc) {
    const kind = loc.type === "help" ? ["help", "At the Sheraton"]
      : loc.type === "hotel" ? ["", "At the Sheraton"]
      : loc.type === "edge" ? ["city", "Off the map, about " + loc.distance]
      : ["city", "Around downtown"];

    let where;
    if (loc.type === "city" || loc.type === "edge") {
      where = loc.address ? esc(loc.address) : (loc.where ? esc(loc.where.replace(/ TBC$/, "")) + " " : "") + '<span class="tbc" style="margin-left:0">Address TBC</span>';
    } else {
      where = esc(loc.where).replace(/ TBC$/, "") + (/ TBC$/.test(loc.where) ? tbc : "");
    }

    const hours = loc.hoursFrom && byId[loc.hoursFrom] ? byId[loc.hoursFrom].hours : loc.hours || [];
    const when = hours.map((h) => `
      <div class="c-day">${esc(h.day === "All" ? "" : h.day)}</div>
      <div class="c-time">${val(h.time)}${h.tbc ? tbc : ""}${h.note ? `<span class="c-note">${esc(h.note)}</span>` : ""}</div>`).join("");
    const whenNote = loc.hoursFrom ? `<div class="c-day"></div><div class="c-time"><span class="c-note" style="margin:0">Follows Parlur hours</span></div>` : "";

    const access = loc.access ? `<div class="c-access">${LOCK}${esc(loc.access)}${loc.accessTbc ? tbc : ""}</div>` : "";

    const cta = loc.cta || {};
    let ctaHtml = "", alt = "";
    if (cta.kind === "apple-place" || cta.kind === "apple-directions") {
      const u = mapsUrls(cta, loc);
      if (u) {
        ctaHtml = `<a class="c-cta" href="${u.apple}" target="_blank" rel="noopener">${PIN}${esc(cta.label)}</a>`;
        alt = `<div class="c-alt"><a href="${u.google}" target="_blank" rel="noopener">Google Maps</a></div>`;
      }
    } else if (cta.kind === "help") {
      ctaHtml = `<a class="c-cta help" href="${esc(CFG.helpDeskUrl)}">${CHAT}${esc(cta.label)}</a>`;
    } else if (cta.kind === "location" && byId[cta.target]) {
      const isHelp = byId[cta.target].type === "help";
      ctaHtml = `<button class="c-cta${isHelp ? " help" : ""}" type="button" data-goto="${esc(cta.target)}">${isHelp ? CHAT : PIN}${esc(cta.label)}</button>`;
    } else if (cta.kind === "itinerary") {
      ctaHtml = `<a class="c-cta" href="${esc(CFG.itineraryUrl)}">${LIST}${esc(cta.label)}</a>`;
    } else if (cta.url) {
      ctaHtml = `<a class="c-cta" href="${esc(cta.url)}" target="_blank" rel="noopener">${esc(cta.label)}</a>`;
    }
    const foot = loc.footnote ? `<p class="c-foot">${esc(loc.footnote.replace(/ TBC$/, ""))}${/ TBC$/.test(loc.footnote) ? tbc : ""}</p>` : "";

    cardBody.innerHTML = `
      <div class="c-kind"><i class="${kind[0]}"></i>${esc(kind[1])}</div>
      <h2 class="c-name" id="cardTitle">${esc(loc.name)}</h2>
      ${loc.subtitle ? `<p class="c-sub">${esc(loc.subtitle)}</p>` : ""}
      <p class="c-where">${where}</p>
      ${hours.length ? `<div class="c-when">${when}${whenNote}</div>` : ""}
      <p class="c-desc">${esc(loc.description)}</p>
      ${access}
      ${ctaHtml}${alt}${foot}`;
    card.setAttribute("aria-labelledby", "cardTitle");
    const go = cardBody.querySelector("[data-goto]");
    if (go) go.addEventListener("click", () => select(go.dataset.goto, 0));
  }

  function levelOf(loc) {
    if (loc.id === "living-album") return "Level 2 and Lobby level";
    return /Level 2/.test(loc.where) ? "Level 2" : "Lobby level";
  }

  function renderEmpty() {
    panelEmpty.innerHTML = `
      <h2 class="pe-title">Where to find everything</h2>
      <p class="pe-text">The ${esc(CFG.hotelName)} is home base for ${esc(CFG.eventName)}. Tap any spot for times and details. If something isn't clear, find a Super Steve in an orange shirt.</p>
      <ul class="pe-key">
        <li><span class="k"><span class="k-help"></span></span>Super Steve Help Desk</li>
        <li><span class="k"><span class="k-hotel"></span></span>At the Sheraton</li>
        <li><span class="k"><span class="k-city"></span></span>Around downtown</li>
        <li><span class="k"><span class="k-edge"></span></span>Off the map, with drive time</li>
      </ul>
      <button class="c-cta help pe-help" type="button" data-goto="help-desk">${CHAT}Find a Super Steve</button>
      <svg hidden class="pe-cactus" viewBox="0 0 30 52" aria-hidden="true" fill="none" stroke="#121111" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 50V10a5 5 0 0 1 10 0v40M10 32H6a3 3 0 0 1-3-3v-8M20 26h4a3 3 0 0 0 3-3v-8M1 50.5h28"/></svg>`;
    panelEmpty.querySelector("[data-goto]").addEventListener("click", () => select("help-desk", 0));
  }

  /* ---------------- Selection ---------------- */
  function select(id, i) {
    const loc = byId[id];
    if (!loc) return;
    state.sel = id; state.point = i || 0;
    app.classList.add("has-sel");
    document.querySelectorAll(".mk, .chip").forEach((m) => m.classList.toggle("is-on", m.dataset.id === id));
    base.querySelectorAll(".room").forEach((r) => r.classList.toggle("is-on", r.dataset.for === id));
    renderCard(loc);
    card.hidden = false;
    card.scrollTop = 0;
    setParam(id);
    requestAnimationFrame(reveal);
  }

  function clearSel() {
    if (!state.sel) return;
    state.sel = null;
    app.classList.remove("has-sel");
    document.querySelectorAll(".is-on").forEach((m) => m.classList.remove("is-on"));
    card.hidden = true;
    card.style.transform = "";
    stageWrap.style.transform = "";
    setParam(null);
  }

  function setParam(id) {
    const p = new URLSearchParams(location.search);
    if (id) p.set("loc", id); else p.delete("loc");
    const q = p.toString();
    history.replaceState(null, "", location.pathname + (q ? "?" + q : ""));
  }

  // On phones, nudge the map up so the chosen spot sits above the sheet.
  function reveal() {
    if (isDesktop() || !state.sel) { stageWrap.style.transform = ""; return; }
    const m = document.querySelector(`.mk.is-on[data-i="${state.point}"], .chip.is-on[data-i="${state.point}"]`) || document.querySelector(".is-on");
    if (!m) return;
    stageWrap.style.transform = "";
    const r = m.getBoundingClientRect();
    const sheetTop = window.innerHeight - card.getBoundingClientRect().height;
    const want = sheetTop - 20;
    const cy = r.top + r.height / 2 + 28;
    if (cy > want) stageWrap.style.transform = `translateY(${-Math.min(cy - want, 520)}px)`;
  }

  /* ---------------- Sizing ---------------- */
  function fit() {
    const sub = $("brandSub");
    sub.textContent = isDesktop() ? sub.dataset.full : CFG.hotelName;
    const col = stageWrap.parentElement;
    const cs = getComputedStyle(col);
    const padV = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const hintH = $("hint").offsetHeight + 10;
    const availW = col.clientWidth - (isDesktop() ? 48 : 0);
    const availH = col.clientHeight - padV - hintH;
    let w = Math.min(availW, availH * W / H, isDesktop() ? 560 : 440);
    w = Math.max(w, 300);
    stage.style.width = w + "px";
    stage.style.height = (w * H / W) + "px";
    reveal();
    checkCollisions();
  }

  // Warns in the console if any label, marker or chip overlaps another.
  function checkCollisions() {
    const items = [];
    overlay.querySelectorAll(".mk, .chip").forEach((m) => {
      if (getComputedStyle(m).opacity === "0") return;
      m.querySelectorAll(".dot, .lbl, .chip-in").forEach((n) => items.push({ n, owner: m, r: n.getBoundingClientRect() }));
    });
    const hits = [];
    for (let a = 0; a < items.length; a++) for (let b = a + 1; b < items.length; b++) {
      const A = items[a], B = items[b];
      if (A.owner === B.owner) continue;
      if (A.r.left < B.r.right - 1 && B.r.left < A.r.right - 1 && A.r.top < B.r.bottom - 1 && B.r.top < A.r.bottom - 1) {
        hits.push([A.owner.dataset.id, B.owner.dataset.id]);
        A.n.classList.add("collide"); B.n.classList.add("collide");
      }
    }
    window.__collisions = hits;
    if (hits.length) console.warn("SR map: overlapping markers", hits);
  }

  /* ---------------- Events ---------------- */
  $("helpBtn").addEventListener("click", () => select("help-desk", 0));
  $("close").addEventListener("click", clearSel);
  stageWrap.parentElement.addEventListener("click", (e) => {
    if (!e.target.closest(".mk, .chip, .area-hit")) clearSel();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") clearSel(); });

  // Swipe down to close the sheet.
  (function swipe() {
    let y0 = null, dy = 0;
    const start = (e) => {
      if (isDesktop()) return;
      if (e.target.closest(".c-cta, a, .close")) return;
      if (card.scrollTop > 0 && !e.target.closest(".grab")) return;
      y0 = e.touches ? e.touches[0].clientY : e.clientY; dy = 0;
      card.classList.add("dragging");
    };
    const move = (e) => {
      if (y0 === null) return;
      dy = Math.max(0, (e.touches ? e.touches[0].clientY : e.clientY) - y0);
      card.style.transform = `translateY(${dy}px)`;
    };
    const end = () => {
      if (y0 === null) return;
      card.classList.remove("dragging");
      y0 = null;
      if (dy > 70) { card.style.transform = ""; clearSel(); } else card.style.transform = "";
    };
    card.addEventListener("touchstart", start, { passive: true });
    card.addEventListener("touchmove", move, { passive: true });
    card.addEventListener("touchend", end);
    $("grab").addEventListener("pointerdown", start);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
  })();

  // Optional Hotel / Denver toggle
  if (CFG.showToggle) {
    const seg = $("seg");
    seg.hidden = false;
    app.classList.add("has-toggle");
    state.view = "hotel";
    const setView = (v) => {
      state.view = v;
      app.classList.toggle("view-hotel", v === "hotel");
      seg.querySelectorAll("button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.view === v)));
      if (state.sel && v === "hotel" && ["city", "edge"].includes(byId[state.sel].type)) clearSel();
      checkCollisions();
    };
    seg.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));
    setView("hotel");
  }

  /* ---------------- Boot ---------------- */
  drawBase();
  buildOverlay();
  renderEmpty();
  window.addEventListener("resize", fit);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    drawBase();
    fit();
    const start = params.get("loc");
    if (start && byId[start]) {
      if (CFG.showToggle && ["city", "edge"].includes(byId[start].type)) $("seg").querySelector('[data-view="denver"]').click();
      select(start, 0);
    }
  });
  fit();
})();
