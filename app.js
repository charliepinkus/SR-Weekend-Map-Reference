/* SR Weekend map. Layout and behavior only. Content lives in locations.js. */
(function () {
  "use strict";

  const B = window.SR_BASEMAP, M = B.meta, D = window.SR_MAP, CFG = D.config;
  const params = new URLSearchParams(location.search);
  const $ = (id) => document.getElementById(id);
  const app = $("app"), svgEl = $("svg"), ov = $("ov"), card = $("card"), cardBody = $("cardBody"), cardScroll = $("cardScroll");
  const isDesk = () => window.matchMedia("(min-width: 900px)").matches;

  if (params.get("clean") === "1") document.body.classList.add("clean");
  if (params.get("debug") === "1") document.body.classList.add("debug");
  $("brandName").textContent = CFG.eventName;
  $("brandSub").textContent = CFG.city + ", " + CFG.dates.replace(/, \d{4}$/, "");

  /* ---------- Projection (same math as tools/prep.py) ---------- */
  const RC = Math.cos(M.rot), RS = Math.sin(M.rot);
  function proj(lat, lng) {
    const x = (lng - M.lon0) * M.kx, y = (lat - M.lat0) * M.ky;
    return [x * RC - y * RS, -(x * RS + y * RC)];
  }

  /* ---------- Icons ---------- */
  const I = {
    help: '<path d="M9.2 9.2a2.9 2.9 0 1 1 4.1 2.6c-.8.4-1.3 1-1.3 1.8v.6"/><path d="M12 17.6v.2"/>',
    bag: '<path d="M5.5 8.5h13l-1 11h-11z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/>',
    cup: '<path d="M5 9h10.5v4.5A4.5 4.5 0 0 1 11 18h-1.5A4.5 4.5 0 0 1 5 13.5z"/><path d="M15.5 10.5h1.5a2 2 0 0 1 0 4h-1.5"/>',
    headphones: '<path d="M4.5 15v-2.5a7.5 7.5 0 0 1 15 0V15"/><path d="M4.5 14.5h3v5h-3zM16.5 14.5h3v5h-3z"/>',
    camera: '<path d="M4 8.5h3.5l1.8-2.2h5.4l1.8 2.2H20v10H4z"/><circle cx="12" cy="13.3" r="3"/>',
    layers: '<path d="M12 4.5l8 4.2-8 4.2-8-4.2z"/><path d="M4 13.3l8 4.2 8-4.2"/>',
    disc: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="1.8"/>',
    glass: '<path d="M7 5h10l-5 7z"/><path d="M12 12v6.5M8.5 19h7"/>',
    star: '<path d="M12 4.5l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z"/>',
    bus: '<rect x="5.5" y="4.5" width="13" height="13" rx="2.5"/><path d="M5.5 11h13M8.5 17.5v2M15.5 17.5v2"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    list: '<path d="M9 7h11M9 12h11M9 17h11"/><circle cx="4.8" cy="7" r="1"/><circle cx="4.8" cy="12" r="1"/><circle cx="4.8" cy="17" r="1"/>',
    chat: '<path d="M4.5 5.5h15v10h-8l-4 3.5v-3.5h-3z"/>',
    lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
    chev: '<path d="M9 5l7 7-7 7"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    route: '<path d="M6 19V9a4 4 0 0 1 4-4h8M14 1.5L18 5l-4 3.5"/>'
  };
  const icon = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${I[n] || ""}</svg>`;
  const ROCKS = '<svg class="edge-rocks" viewBox="0 0 36 24" aria-hidden="true"><path d="M1 22 L6 11 L10 14 L15 4 L21 13 L25 9 L35 22 Z" fill="#BA514E" stroke="#121111" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 22 L13 16 M20 22 L24 15" stroke="#121111" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>';
  const ART = {
    "union-station": '<svg viewBox="0 0 64 40" width="62" height="39"><path class="f" d="M3 22h14v16H3zM47 22h14v16H47z"/><path class="f" d="M17 14h30v24H17z"/><path d="M17 14 L32 8.5 L47 14"/><path d="M21 38V27a3 3 0 0 1 6 0v11M29 38V27a3 3 0 0 1 6 0v11M37 38V27a3 3 0 0 1 6 0v11"/><rect class="fc" x="21" y="1" width="22" height="4.5" rx="1"/><path d="M25 5.5v4M39 5.5v4"/><path d="M6 28h8M50 28h8M6 33h8M50 33h8"/><path d="M1 38h62"/></svg>',
    capitol: '<svg viewBox="0 0 44 50" width="40" height="46"><path class="f" d="M4 48V35h36v13z"/><path d="M10 48v-9M16 48v-9M22 48v-9M28 48v-9M34 48v-9M4 38.5h36"/><path class="f" d="M12 35v-6h20v6z"/><path class="f" d="M13 29a9 10.5 0 0 1 18 0z"/><path d="M22 18.5v-7M19.5 11.5h5M17 29v-4M22 29v-5M27 29v-4"/><path d="M1 48h42"/></svg>'
  };

  /* ---------- Base map ---------- */
  const world = d3.select("#world");
  const layer = (d, cls, style) => { const p = world.append("path").attr("d", d).attr("class", cls); if (style) p.attr("style", style); return p; };
  layer(B.broadway, "l-corridor", "stroke-width:70");
  layer(B.colfax, "l-corridor", "stroke-width:70");
  layer(B.land, "l-land");
  layer(B.land, "l-land-edge");
  layer(B.parks, "l-park");
  layer(B.rivers, "l-water", "stroke-width:14");
  // Casings first, for a drawn edge on every street
  [[B.road_residential, 8], [B.road_tertiary, 11], [B.road_secondary, 13], [B.road_primary, 16], [B.road_motorway, 24], [B.broadway, 16], [B.colfax, 16], [B.mall, 18]]
    .forEach(([d, w]) => layer(d, "l-case", `stroke-width:${w + 3.2}`));
  layer(B.road_residential, "l-road", "stroke-width:8");
  layer(B.road_tertiary, "l-road", "stroke-width:11");
  layer(B.road_secondary, "l-road major", "stroke-width:13");
  layer(B.road_primary, "l-road major", "stroke-width:16");
  layer(B.road_motorway, "l-road major", "stroke-width:24");
  layer(B.broadway, "l-road major", "stroke-width:16");
  layer(B.colfax, "l-road major", "stroke-width:16");
  layer(B.mall, "l-mall", "stroke-width:18");
  layer(B.mall, "l-mall-dash", "stroke-width:2.2;stroke-dasharray:1 7");
  layer(B.buildings, "l-bldg");
  layer(B.hotel_blocks, "l-hotel-block");
  layer(B.hotel_buildings, "l-hotel");
  const HX = M.hotel_center[0];
  layer(`M${HX} 716 V751`, "l-bridge", "stroke-width:4");   // skybridge over Court Pl

  /* ---------- Overlay ---------- */
  const items = [];
  function add(el, x, y, o) {
    el.classList.add("oi");
    ov.appendChild(el);
    const it = Object.assign({ el, x, y, pri: 10, minK: 0, fixed: false, rot: 0 }, o || {});
    items.push(it);
    return it;
  }
  const div = (cls, html) => { const d = document.createElement("div"); d.className = cls; d.innerHTML = html; return d; };

  // Street labels (drawn from the real street positions in basemap.js)
  const R = M.rows, C = M.cols, A = M.anchors;
  const mid = (a, b) => (a + b) / 2;
  const STREETS = [
    ["16th Street Mall", C["16th Street Mall"], mid(R["Champa Street"], R["Stout Street"]), -90, 0, "mall", 46],
    ["15th St", C["15th Street"], mid(R["Welton Street"], R["California Street"]), -90, 0.2, "", 32],
    ["17th St", C["17th Street"], mid(R["Curtis Street"], R["Champa Street"]), -90, 0.2, "", 32],
    ["20th St", C["20th Street"], mid(R["Larimer Street"], R["Lawrence Street"]), -90, 0.2, "", 31],
    ["18th St", C["18th Street"], mid(R["California Street"], R["Stout Street"]), -90, 0.36, "", 24],
    ["14th St", C["14th Street"], mid(R["Arapahoe Street"], R["Curtis Street"]), -90, 0.36, "", 24],
    ["Market St", mid(C["16th Street Mall"], C["17th Street"]), R["Market Street"], 0, 0.2, "", 31],
    ["Larimer St", mid(C["18th Street"], C["19th Street"]), R["Larimer Street"], 0, 0.22, "", 30],
    ["Champa St", mid(C["17th Street"], C["18th Street"]), R["Champa Street"], 0, 0.36, "", 24],
    ["Court Pl", mid(C["14th Street"], C["15th Street"]), R["Court Place"], 0, 0.3, "", 26],
    ["Wynkoop St", mid(C["17th Street"], C["18th Street"]), R["Wynkoop Street"], 0, 0.3, "", 25],
    ["Broadway", A["Broadway"][0], A["Broadway"][1], A["Broadway"][2], 0, "", 33],
    ["Colfax Ave", A["Colfax Ave"][0], A["Colfax Ave"][1], A["Colfax Ave"][2], 0, "", 33],
    ["Speer Blvd", A["Speer Blvd"][0], A["Speer Blvd"][1], A["Speer Blvd"][2], 0.2, "", 30],
    ["South Platte River", A["South Platte River"][0], A["South Platte River"][1], A["South Platte River"][2], 0.2, "water", 28]
  ];
  STREETS.forEach(([t, x, y, rot, minK, cls, pri]) => add(div("sl " + cls, `<span>${t}</span>`), x, y, { rot, minK, pri, kind: "label" }));

  const HOODS = [
    ["LoDo", 330, -640, 0.18, ""],
    ["Auraria", -860, 420, 0.18, ""],
    ["Civic Center", M.civic[0] - 60, M.civic[1] + 90, 0.26, ""],
    ["Capitol Hill", 560, 1520, 0, "big"],
    ["Golden Triangle", -560, 1480, 0.26, ""]
  ];
  HOODS.forEach(([t, x, y, minK, cls]) => add(div("nb " + cls, `<span>${t}</span>`), x, y, { minK, pri: 12, kind: "label" }));

  (D.landmarks || []).forEach((l) => {
    const [x, y] = proj(l.lat, l.lng);
    add(div("lm", `<div class="lm-in">${ART[l.art] || ""}<span class="lm-name">${esc(l.name)}</span></div>`), x, y, { pri: 40, minK: 0.16, kind: "label" });
  });

  // Sheraton HQ marker, hung under the hotel footprint
  const hq = D.hq;
  const hqEl = document.createElement("div");
  hqEl.className = "hq";
  hqEl.innerHTML = `<div class="hq-group">
      <button class="hq-tag" type="button" data-sel="${hq.id}"><span class="hq-mark" aria-hidden="true"></span>
        <span class="hq-t"><b>${esc(hq.tag)}</b><small>${esc(hq.name)}</small></span></button>
      <button class="hq-help" type="button" data-sel="help-desk"><i>?</i>Super Steve Help Desk</button>
    </div>`;
  const hqIt = add(hqEl, HX, 848, { pri: 100, fixed: true, id: hq.id });

  // City pins
  D.city.forEach((p) => {
    const [x, y] = proj(p.lat, p.lng);
    const el = document.createElement("div");
    el.dataset.id = p.id;
    if (p.utility) {
      el.className = "util";
      el.innerHTML = `<button class="util-btn" type="button" data-sel="${p.id}" aria-label="${esc(p.name)}"><span class="util-sq">${icon(p.icon)}</span></button>
        <span class="pin-lbl"><b>${esc(p.name)}</b></span>`;
    } else {
      el.className = "pin" + (p.labelSide === "left" ? " left" : "");
      el.innerHTML = `<button class="pin-btn" type="button" data-sel="${p.id}" aria-label="${esc(p.name)}">
          <svg class="pin-drop" viewBox="0 0 32 40"><path class="body" d="M16 38.5C16 38.5 3 25.5 3 15.5a13 13 0 0 1 26 0c0 10-13 23-13 23z"/><g class="ic" transform="translate(8.5 8) scale(.625)">${I[p.icon] || ""}</g></svg></button>
        <span class="pin-lbl"><b>${esc(p.name)}</b>${p.short ? `<small>${esc(p.short)}</small>` : ""}</span>`;
    }
    add(el, x, y, { pri: p.utility ? 60 : 80, fixed: true, id: p.id, pin: true });
  });

  // Off-map chips
  const edgeRow = document.createElement("div");
  edgeRow.className = "edge-row";
  edgeRow.id = "edgeRow";
  app.appendChild(edgeRow);
  edgeRow.addEventListener("click", (e) => {
    const b = e.target.closest("[data-sel]");
    if (b) { e.stopPropagation(); select(b.dataset.sel); }
  });
  const edges = D.edge.map((p) => {
    const el = document.createElement("div");
    el.className = "edge";
    el.dataset.id = p.id;
    el.innerHTML = `<button class="edge-btn" type="button" data-sel="${p.id}" aria-label="${esc(p.name)}, about ${esc(p.distance)}">
        <span class="edge-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><g class="rot">${I.arrow}</g></svg></span>
        <span class="edge-t"><b>${esc(p.label || p.name)}</b><small>${esc(p.distance)}</small></span>${p.icon === "rocks" ? ROCKS : ""}</button>`;
    ov.appendChild(el);
    el.classList.add("oi");
    const [x, y] = proj(p.lat, p.lng);
    return { el, x, y, p, rotEl: el.querySelector(".rot") };
  });

  ov.addEventListener("click", (e) => {
    const b = e.target.closest("[data-sel]");
    if (b) { e.stopPropagation(); select(b.dataset.sel); }
  });

  /* ---------- Zoom and pan ---------- */
  let T = d3.zoomIdentity;
  const lb = M.land_bounds;
  const zoom = d3.zoom()
    .scaleExtent([0.14, 2.6])
    .translateExtent([[lb[0] - 400, lb[1] - 400], [lb[2] + 1200, lb[3] + 700]])
    .clickDistance(6)
    .on("zoom", (e) => { T = e.transform; world.attr("transform", T); place(); })
    .on("end", () => cull());
  const svg = d3.select(svgEl).call(zoom);

  function homeTransform() {
    const w = innerWidth, h = innerHeight;
    const hy = M.hotel_center[1];
    if (isDesk()) {
      const k = Math.min(h / 2350, w / 2700);
      return d3.zoomIdentity.translate(w * 0.5 - k * HX, h * 0.6 - k * hy).scale(k);
    }
    const k = Math.min((w - 20) / 1150, (h - 150) / 2250);
    return d3.zoomIdentity.translate(Math.max(122, w * 0.33) - k * HX, h * 0.58 - k * hy).scale(k);
  }

  function place() {
    const k = T.k;
    for (const it of items) {
      const [sx, sy] = T.apply([it.x, it.y]);
      const off = k < it.minK;
      it.el.classList.toggle("off", off || it.culled === true);
      it.el.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px)` + (it.rot ? ` rotate(${it.rot}deg)` : "");
      if (it.pin) {
        const lw = it.lw || (it.lw = it.el.querySelector(".pin-lbl").offsetWidth);
        if (it.el.classList.contains("pin")) it.el.classList.toggle("left", sx + 24 + lw > innerWidth - 12);
        else it.el.classList.toggle("right", sx - 20 - lw < 10);
      }
    }
    placeEdges();
  }

  function viewRect() {
    const w = innerWidth, h = innerHeight;
    const r = { l: 14, t: isDesk() ? 96 : 74, r: w - (isDesk() ? 76 : 14), b: h - (isDesk() ? 48 : 44) };
    if (!card.hidden) {
      if (isDesk()) r.r = w - 400 - 44 - 64;
      else r.b = h - card.getBoundingClientRect().height - 12;
    }
    return r;
  }

  function placeEdges() {
    if (!isDesk()) {
      edges.forEach((e) => {
        if (e.el.parentNode !== edgeRow) { edgeRow.appendChild(e.el); e.el.style.transform = ""; }
        const [px, py] = T.apply([e.x, e.y]);
        const a = Math.atan2(py - innerHeight / 2, px - innerWidth / 2);
        e.rotEl.setAttribute("transform", `rotate(${(a * 180 / Math.PI).toFixed(1)} 12 12)`);
      });
      return;
    }
    edges.forEach((e) => { if (e.el.parentNode !== ov) ov.appendChild(e.el); });
    const v = viewRect();
    const cx = (v.l + v.r) / 2, cy = (v.t + v.b) / 2;
    const placed = [];
    edges.forEach((e) => {
      const [px, py] = T.apply([e.x, e.y]);
      let dx = px - cx, dy = py - cy;
      const ang = Math.atan2(dy, dx);
      const bw = e.el.firstElementChild.offsetWidth || 160, bh = 46;
      const hw = bw / 2 + 2, hh = bh / 2 + 2;
      const tx = dx > 0 ? (v.r - hw - cx) / dx : (v.l + hw - cx) / dx;
      const ty = dy > 0 ? (v.b - hh - cy) / dy : (v.t + hh - cy) / dy;
      const t = Math.min(Math.abs(tx), Math.abs(ty));
      let x = cx + dx * t, y = cy + dy * t;
      x = Math.max(v.l + hw, Math.min(v.r - hw, x));
      y = Math.max(v.t + hh, Math.min(v.b - hh, y));
      const blocks = avoidRects();
      for (let n = 0; n < 12; n++) {
        const bad = blocks.find((q) => x - hw < q.right && q.left < x + hw && y - hh < q.bottom && q.top < y + hh);
        if (!bad) break;
        const up = bad.top - hh - 6, down = bad.bottom + hh + 6;
        const upOk = up >= v.t + hh, downOk = down <= v.b - hh;
        if (Math.abs(x - v.l) < Math.abs(x - v.r) || true) {
          if (upOk && (!downOk || Math.abs(up - y) <= Math.abs(down - y))) y = up; else if (downOk) y = down; else break;
        }
      }
      for (const q of placed) {
        if (Math.abs(q.x - x) < (q.hw + hw) && Math.abs(q.y - y) < (bh + 6)) y = q.y + (y >= q.y ? 1 : -1) * (bh + 8);
      }
      y = Math.max(v.t + hh, Math.min(v.b - hh, y));
      placed.push({ x, y, hw });
      e.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      e.rotEl.setAttribute("transform", `rotate(${(ang * 180 / Math.PI).toFixed(1)} 12 12)`);
    });
  }

  function avoidRects() {
    const out = [];
    const add = (n, p) => { if (!n) return; const r = n.getBoundingClientRect(); out.push({ left: r.left - p, top: r.top - p, right: r.right + p, bottom: r.bottom + p }); };
    add(hqEl.querySelector(".hq-group"), 10);
    document.querySelectorAll(".pin-drop, .util-sq").forEach((n) => add(n, 8));
    add($("ctrl"), 8);
    add($("brand"), 8);
    return out;
  }

  // Hide lower-priority labels that collide with anything more important.
  function cull() {
    items.forEach((it) => { it.culled = false; });
    place();
    const rects = [];
    const hit = (r, own) => rects.some((q) => (!own || q.own !== own) && r.left < q.right && q.left < r.right && r.top < q.bottom && q.top < r.bottom);
    const pad = (r, p) => ({ left: r.left - p, top: r.top - p, right: r.right + p, bottom: r.bottom + p });
    const vis = items.filter((it) => !it.el.classList.contains("off"));
    if (isDesk()) edges.forEach((e) => rects.push(pad(e.el.firstElementChild.getBoundingClientRect(), 4)));
    else rects.push(pad(edgeRow.getBoundingClientRect(), 2), pad($("home").getBoundingClientRect(), 2));
    rects.push(pad($("brand").getBoundingClientRect(), 4));
    vis.filter((it) => it.fixed).forEach((it) => {
      it.el.querySelectorAll(".hq-group, .pin-drop, .util-sq").forEach((n) => rects.push(Object.assign(pad(n.getBoundingClientRect(), 3), { own: it })));
    });
    vis.filter((it) => it.pin).sort((a, b) => b.pri - a.pri).forEach((it) => {
      const lbl = it.el.querySelector(".pin-lbl");
      lbl.style.visibility = "";
      const r = pad(lbl.getBoundingClientRect(), 2);
      if (hit(r, it)) lbl.style.visibility = "hidden"; else rects.push(r);
    });
    vis.filter((it) => !it.fixed).sort((a, b) => b.pri - a.pri).forEach((it) => {
      const n = it.el.firstElementChild;
      const r = pad(n.getBoundingClientRect(), 3);
      if (hit(r)) { it.culled = true; it.el.classList.add("off"); } else rects.push(r);
    });
  }

  /* ---------- Cards ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  const TBC = '<span class="tbc">TBC</span>';
  const val = (s) => (s === "TBC" ? '<span class="tbc solo">TBC</span>' : esc(s));
  const enc = encodeURIComponent;
  const byId = {};
  byId[hq.id] = Object.assign({ _t: "hq" }, hq);
  D.hotel.forEach((p) => { byId[p.id] = Object.assign({ _t: "hotel" }, p); });
  D.city.forEach((p) => { byId[p.id] = Object.assign({ _t: p.utility ? "util" : "city" }, p); });
  D.edge.forEach((p) => { byId[p.id] = Object.assign({ _t: "edge" }, p); });

  function maps(p, kind) {
    const addr = p.address;
    if (!addr) return null;
    if (kind === "apple-directions") return { apple: "https://maps.apple.com/?daddr=" + enc(addr), google: "https://www.google.com/maps/dir/?api=1&destination=" + enc(addr) };
    const q = p.mapsQuery || p.name;
    return { apple: "https://maps.apple.com/?q=" + enc(q) + "&address=" + enc(addr), google: "https://www.google.com/maps/search/?api=1&query=" + enc(q + ", " + addr) };
  }

  function ctaHtml(p) {
    const c = p.cta || {};
    if (c.kind === "apple-place" || c.kind === "apple-directions") {
      const u = maps(p, c.kind);
      if (!u) return "";
      return `<a class="c-cta" href="${u.apple}" target="_blank" rel="noopener">${icon(c.kind === "apple-directions" ? "route" : "pin")}${esc(c.label)}</a>
        <div class="c-alt"><a href="${u.google}" target="_blank" rel="noopener">or open in Google Maps</a></div>`;
    }
    if (c.kind === "help") return `<a class="c-cta help" href="${esc(CFG.helpDeskUrl)}">${icon("chat")}${esc(c.label)}</a>`;
    if (c.kind === "itinerary") return `<a class="c-cta" href="${esc(CFG.itineraryUrl)}">${icon("list")}${esc(c.label)}</a>`;
    if (c.kind === "goto" && byId[c.target]) {
      const help = byId[c.target].help;
      return `<button class="c-cta${help ? " help" : ""}" type="button" data-sel="${esc(c.target)}">${icon(help ? "chat" : "chev")}${esc(c.label)}</button>`;
    }
    return "";
  }

  function whenHtml(p) {
    const hours = p.hoursFrom && byId[p.hoursFrom] ? byId[p.hoursFrom].hours : p.hours;
    if (!hours || !hours.length) return "";
    const rows = hours.map((h) => `<div class="c-day">${esc(h.day)}</div><div class="c-time">${val(h.time)}${h.tbc ? TBC : ""}${h.note ? `<span class="c-note">${esc(h.note)}</span>` : ""}</div>`).join("");
    const from = p.hoursFrom ? `<div class="c-day"></div><div class="c-time"><span class="c-note" style="margin:0">Follows Parlur hours</span></div>` : "";
    return `<div class="c-when">${rows}${from}</div>`;
  }
  const accessHtml = (p) => p.access ? `<div class="c-access">${icon("lock")}${esc(p.access)}${p.accessTbc ? TBC : ""}</div>` : "";
  const tbcTail = (s) => esc(String(s).replace(/ TBC$/, "")) + (/ TBC$/.test(s) ? TBC : "");

  function renderPlace(p) {
    const kind = p._t === "edge" ? ["edge", "Off the map, about " + p.distance] : p._t === "util" ? ["util", p.kind] : ["", p.kind];
    const where = p.address ? esc(p.address) : (p.where ? tbcTail(p.where) : '<span class="tbc solo">Address TBC</span>');
    cardBody.innerHTML = `
      <div class="c-kind"><i class="${kind[0]}"></i>${esc(kind[1])}</div>
      <h2 class="c-name">${esc(p.name)}</h2>
      ${p.subtitle ? `<p class="c-sub">${esc(p.subtitle)}</p>` : ""}
      <p class="c-where">${where}</p>
      ${whenHtml(p)}
      <p class="c-desc">${esc(p.description)}</p>
      ${accessHtml(p)}
      ${ctaHtml(p)}`;
  }

  function renderHQ() {
    const lobby = D.hotel.filter((h) => h.spots.some((s) => s.level === "lobby") && !h.help);
    const up = D.hotel.filter((h) => h.spots.every((s) => s.level === "level2"));
    const help = D.hotel.find((h) => h.help);
    const row = (h, cls) => `<li class="${cls || ""}"><button type="button" data-sel="${h.id}">
        <span class="dot${h.help ? " help" : ""}">${icon(h.icon)}</span>
        <span><b>${esc(h.name)}</b><small>${esc(h.row || h.level)}</small></span>
        <svg class="chev" viewBox="0 0 24 24">${I.chev}</svg></button></li>`;
    cardBody.innerHTML = `
      <div class="c-kind"><i></i>${esc(hq.tag)}</div>
      <h2 class="c-name">${esc(hq.name)}</h2>
      <p class="c-where">${esc(hq.address)}</p>
      <p class="c-desc">${esc(hq.description)}</p>
      <div class="hd">${diagram(null, false)}</div>
      <ul class="hl">${help ? row(help, "help-row") : ""}</ul>
      <p class="hl-h">Lobby level</p><ul class="hl">${lobby.map((h) => row(h)).join("")}</ul>
      <p class="hl-h">Level 2</p><ul class="hl">${up.map((h) => row(h)).join("")}</ul>
      ${ctaHtml(Object.assign({}, hq))}`;
  }

  function renderHotelItem(p) {
    cardBody.innerHTML = `
      <button class="c-back" type="button" data-sel="${hq.id}">${icon("back")}Sheraton</button>
      <div class="c-kind"><i class="${p.help ? "help" : ""}"></i>${esc(p.level)}</div>
      <h2 class="c-name">${esc(p.name)}</h2>
      ${p.subtitle ? `<p class="c-sub">${esc(p.subtitle)}</p>` : ""}
      ${p.where ? `<p class="c-where">${tbcTail(p.where)}</p>` : ""}
      <div class="hd compact">${diagram(p.id, true)}</div>
      ${whenHtml(p)}
      <p class="c-desc">${esc(p.description)}</p>
      ${accessHtml(p)}
      ${ctaHtml(p)}
      ${p.help ? `<p class="c-foot">Name of the online help desk ${TBC}</p>` : ""}`;
  }

  /* Illustrated hotel diagram: two stacked levels in a light isometric view */
  function diagram(focus, compact) {
    const s = compact ? 1.3 : 1.72, th = 7, dz = 55 * s + 18;
    const iso = (u, v, lv) => [(u - v) * 0.866 * s, (u + v) * 0.5 * s - (lv === "level2" ? dz : 0)];
    const pt = (a) => a.map((n) => n.toFixed(1)).join(" ");
    const plates = { lobby: [0, 0, 100, 40], level2: [0, 0, 70, 40] };
    let out = "", labels = "";
    function plate(lv) {
      const [u0, v0, u1, v1] = plates[lv];
      const A = iso(u0, v0, lv), Bp = iso(u1, v0, lv), Cp = iso(u1, v1, lv), Dp = iso(u0, v1, lv);
      out += `<path class="side" d="M${pt(Bp)} L${pt(Cp)} L${Cp[0]} ${Cp[1] + th} L${Bp[0]} ${Bp[1] + th}Z"/>`;
      out += `<path class="side2" d="M${pt(Dp)} L${pt(Cp)} L${Cp[0]} ${Cp[1] + th} L${Dp[0]} ${Dp[1] + th}Z"/>`;
      out += `<path class="plate" d="M${pt(A)} L${pt(Bp)} L${pt(Cp)} L${pt(Dp)}Z"/>`;
      D.rooms.filter((r) => r.level === lv).forEach((r) => {
        const a = iso(r.u0, r.v0, lv), b = iso(r.u1, r.v0, lv), c = iso(r.u1, r.v1, lv), d = iso(r.u0, r.v1, lv);
        out += `<path class="room" d="M${pt(a)} L${pt(b)} L${pt(c)} L${pt(d)}Z"/>`;
        if (!compact) {
          const m = iso(r.u0 + 2, r.v1 - 2, lv);
          labels += `<text class="room-n" x="${(m[0] + 4).toFixed(1)}" y="${(m[1] + 3).toFixed(1)}">${esc(r.name)}</text>`;
        }
      });
      if (lv === "lobby") {
        const a = iso(88, 5, lv), b = iso(94, 5, lv), c = iso(94, 30, lv), d = iso(88, 30, lv);
        out += `<path class="desk" d="M${pt(a)} L${pt(b)} L${pt(c)} L${pt(d)}Z"/>`;
      }
      const lab = iso(u0, v1, lv);
      out += `<text class="lvl" x="${(lab[0] - 10).toFixed(1)}" y="${(lab[1] + 4).toFixed(1)}" text-anchor="end">${lv === "lobby" ? "Lobby" : "Level 2"}</text>`;
    }
    function pins(lv) {
      D.hotel.forEach((h) => h.spots.forEach((sp) => {
        if (sp.level !== lv) return;
        const [x, y] = iso(sp.u, sp.v, lv);
        const r = h.help ? 12 : 10.5, st = compact ? 11 : 14;
        const cls = "hp" + (h.help ? " help" : "") + (focus ? (focus === h.id ? " on" : " dim") : "");
        out += `<g class="${cls}" data-sel="${h.id}" role="button" aria-label="${esc(h.name)}">
          <ellipse class="shadow" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="5" ry="2.5"/>
          <path class="stem" d="M${x.toFixed(1)} ${y.toFixed(1)} V${(y - st).toFixed(1)}"/>
          <circle class="head" cx="${x.toFixed(1)}" cy="${(y - st - r + 2).toFixed(1)}" r="${r}"/>
          <g class="ic" transform="translate(${(x - r * 0.62).toFixed(1)} ${(y - st - r + 2 - r * 0.62).toFixed(1)}) scale(${(r * 1.24 / 24).toFixed(3)})">${I[h.icon]}</g>
          <circle cx="${x.toFixed(1)}" cy="${(y - st - r).toFixed(1)}" r="20" fill="transparent"/>
        </g>`;
      }));
    }
    plate("lobby"); pins("lobby");
    const e1 = iso(56, 16, "lobby"), e2 = iso(56, 16, "level2");
    out += `<path class="esc" d="M${pt(e1)} L${pt(e2)}"/>`;
    plate("level2"); pins("level2");
    out += labels;
    const vbx = -40 * 0.866 * s - 66, vbw = 140 * 0.866 * s + 72;
    const top = -dz - 34, bottom = 70 * s + th + 6;
    return `<svg viewBox="${vbx} ${top.toFixed(0)} ${vbw} ${(bottom - top).toFixed(0)}" role="img" aria-label="Sheraton levels">${out}</svg>`;
  }

  cardBody.addEventListener("click", (e) => {
    const b = e.target.closest("[data-sel]");
    if (b) { e.preventDefault(); select(b.dataset.sel); }
  });

  /* ---------- Selection ---------- */
  let sel = null;
  function select(id) {
    const p = byId[id];
    if (!p) return;
    sel = id;
    if (p._t === "hq") renderHQ();
    else if (p._t === "hotel") renderHotelItem(p);
    else renderPlace(p);
    app.classList.add("has-sel");
    const inHotel = p._t === "hq" || p._t === "hotel";
    hqEl.classList.toggle("is-on", inHotel && !p.help);
    hqEl.classList.toggle("help-on", !!p.help);
    document.querySelectorAll(".pin, .util, .edge").forEach((m) => m.classList.toggle("is-on", m.dataset.id === id));
    card.hidden = false;
    cardScroll.scrollTop = 0;
    setParam(id);
    requestAnimationFrame(() => { reveal(p); placeEdges(); });
  }
  function clearSel() {
    if (!sel) return;
    sel = null;
    app.classList.remove("has-sel");
    document.querySelectorAll(".is-on, .help-on").forEach((m) => m.classList.remove("is-on", "help-on"));
    card.hidden = true;
    card.style.transform = "";
    setParam(null);
    placeEdges();
  }
  function setParam(id) {
    const q = new URLSearchParams(location.search);
    if (id) q.set("loc", id); else q.delete("loc");
    const s = q.toString();
    history.replaceState(null, "", location.pathname + (s ? "?" + s : ""));
  }

  // Keep the chosen place in view, clear of the card.
  function reveal(p) {
    let wx, wy;
    if (p._t === "hq" || p._t === "hotel") { wx = HX; wy = M.hotel_center[1] + 40; }
    else if (p._t === "edge") return;
    else [wx, wy] = proj(p.lat, p.lng);
    const v = viewRect();
    const [sx, sy] = T.apply([wx, wy]);
    const tx = isDesk() ? (v.l + v.r) / 2 : innerWidth / 2;
    const ty = isDesk() ? (v.t + v.b) / 2 : v.t + (v.b - v.t) * 0.5;
    const m = 70;
    if (sx < v.l + m || sx > v.r - m || sy < v.t + m || sy > v.b - m || !isDesk() || p._t === "hq" || p._t === "hotel") {
      svg.transition().duration(420).call(zoom.translateBy, (tx - sx) / T.k, (ty - sy) / T.k);
    }
  }

  $("close").addEventListener("click", clearSel);
  svgEl.addEventListener("click", clearSel);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") clearSel(); });
  $("zin").addEventListener("click", () => svg.transition().duration(250).call(zoom.scaleBy, 1.5));
  $("zout").addEventListener("click", () => svg.transition().duration(250).call(zoom.scaleBy, 1 / 1.5));
  $("home").addEventListener("click", () => svg.transition().duration(450).call(zoom.transform, homeTransform()));

  // Swipe the sheet down to close it.
  (function () {
    let y0 = null, dy = 0;
    const start = (e) => {
      if (isDesk()) return;
      if (cardScroll.scrollTop > 0 && !e.target.closest(".grab")) return;
      if (e.target.closest("a, button:not(.grab)")) return;
      y0 = (e.touches ? e.touches[0] : e).clientY; dy = 0; card.classList.add("dragging");
    };
    const move = (e) => { if (y0 === null) return; dy = Math.max(0, (e.touches ? e.touches[0] : e).clientY - y0); card.style.transform = `translateY(${dy}px)`; };
    const end = () => { if (y0 === null) return; card.classList.remove("dragging"); y0 = null; card.style.transform = ""; if (dy > 70) clearSel(); };
    card.addEventListener("touchstart", start, { passive: true });
    card.addEventListener("touchmove", move, { passive: true });
    card.addEventListener("touchend", end);
    $("grab").addEventListener("pointerdown", start);
    addEventListener("pointermove", move);
    addEventListener("pointerup", end);
  })();

  /* ---------- Boot ---------- */
  function boot() {
    svg.call(zoom.transform, homeTransform());
    cull();
    const start = params.get("loc");
    if (start && byId[start]) select(start);
  }
  addEventListener("resize", () => { place(); cull(); });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(boot);
})();
