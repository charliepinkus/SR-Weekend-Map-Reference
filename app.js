/* SR Weekend map. Layout and behavior only. Content lives in locations.js. */
(function () {
  "use strict";

  const D = window.SR_MAP, CFG = D.config, GEO = window.SR_GEO || {};
  const params = new URLSearchParams(location.search);
  const $ = (id) => document.getElementById(id);
  const app = $("app"), card = $("card"), cardBody = $("cardBody"), cardScroll = $("cardScroll");
  const isDesk = () => window.matchMedia("(min-width: 900px)").matches;

  if (params.get("clean") === "1") document.body.classList.add("clean");
  if (params.get("debug") === "1") document.body.classList.add("debug");
  $("brandName").textContent = CFG.eventName;
  $("brandSub").textContent = CFG.city + ", " + CFG.dates.replace(/, \d{4}$/, "");

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
    pen: '<path d="M15.5 4.5l4 4L9 19H5v-4z"/><path d="M13 7l4 4"/>',
    mic: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M6 11.5a6 6 0 0 0 12 0M12 17.5v3"/>',
    bus: '<rect x="5.5" y="4.5" width="13" height="13" rx="2.5"/><path d="M5.5 11h13M8.5 17.5v2M15.5 17.5v2"/>',
    saloon: '<path d="M4.5 19.5V9.5h15v10"/><path d="M3 9.5h18M6 6.5h12v3H6z"/><path d="M8 19.5v-5h3v5M14 12h3v3h-3z"/>',
    flash: '<path d="M12 3.5l2 5.2 5.5.4-4.2 3.5 1.3 5.4L12 15.1 7.4 18l1.3-5.4L4.5 9.1l5.5-.4z"/><path d="M12 8.6v3.6"/>',
    leaf: '<path d="M12 4.5c-4.5 3.5-6 7-6 9.5a6 6 0 0 0 12 0c0-2.5-1.5-6-6-9.5z"/><path d="M12 8v11.5M9 14.5l3 2 3-2"/>',
    hotel: '<path d="M4.5 19.5V7l5-2.5v15M9.5 19.5V4.5h10v15"/><path d="M12.5 8h1.5M16 8h1.5M12.5 11.5h1.5M16 11.5h1.5M12.5 15h1.5M16 15h1.5M3 19.5h18"/>',
    pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    list: '<path d="M9 7h11M9 12h11M9 17h11"/><circle cx="4.8" cy="7" r="1"/><circle cx="4.8" cy="12" r="1"/><circle cx="4.8" cy="17" r="1"/>',
    chat: '<path d="M4.5 5.5h15v10h-8l-4 3.5v-3.5h-3z"/>',
    lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
    chev: '<path d="M9 5l7 7-7 7"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    route: '<path d="M6 19V9a4 4 0 0 1 4-4h8M14 1.5L18 5l-4 3.5"/>'
  };
  const icon = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${I[n] || ""}</svg>`;
  const ROCKS = '<svg viewBox="0 0 48 32" aria-hidden="true"><path class="rk" d="M2 29 L6 16 L10 20 L14 9 L19 22 L21 29 Z"/><path class="rk" d="M17 29 L22 12 L27 6 L33 18 L36 29 Z"/><path class="rk" d="M32 29 L36 19 L41 14 L46 29 Z"/><path class="rl" d="M9 29 L13 22 M25 29 L28 20 M39 29 L42 23 M2 30h44"/></svg>';
  const PLANE = '<svg viewBox="0 0 28 28" aria-hidden="true"><path class="pl" d="M14 3.5v8l9.5 5.5v2.5L14 16.8v5.2l3 2.2V26l-3-1-3 1v-1.8l3-2.2v-5.2L4.5 19.5V17l9.5-5.5v-8z"/></svg>';
  const ART = {
    hills: '<svg viewBox="0 0 120 40" width="110" height="37"><path class="hl" d="M2 36 C14 30 20 22 30 20 C38 19 42 26 50 25 C60 24 66 12 78 12 C88 12 92 20 100 22 C108 24 114 32 118 36"/><path class="hl2" d="M14 36 C22 33 26 29 34 29 C41 29 46 32 54 31 C62 30 70 23 80 23 C90 23 96 29 104 31 C110 33 114 35 118 36"/></svg>',
    "union-station": '<svg viewBox="0 0 64 40" width="66" height="41"><path class="f" d="M3 22h14v16H3zM47 22h14v16H47z"/><path class="f" d="M17 14h30v24H17z"/><path d="M17 14 L32 8.5 L47 14"/><path d="M21 38V27a3 3 0 0 1 6 0v11M29 38V27a3 3 0 0 1 6 0v11M37 38V27a3 3 0 0 1 6 0v11"/><rect class="fc" x="21" y="1" width="22" height="4.5" rx="1"/><path d="M25 5.5v4M39 5.5v4"/><path d="M6 28h8M50 28h8M6 33h8M50 33h8"/><path d="M1 38h62"/></svg>',
    capitol: '<svg viewBox="0 0 44 50" width="42" height="48"><path class="f" d="M4 48V35h36v13z"/><path d="M10 48v-9M16 48v-9M22 48v-9M28 48v-9M34 48v-9M4 38.5h36"/><path class="f" d="M12 35v-6h20v6z"/><path class="f" d="M13 29a9 10.5 0 0 1 18 0z"/><path d="M22 18.5v-7M19.5 11.5h5M17 29v-4M22 29v-5M27 29v-4"/><path d="M1 48h42"/></svg>'
  };
  /* Hand-drawn line helpers: a seeded wobble so shapes stay stable between renders */
  function rng(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function sketch(pts, closed, amp, seed) {
    const r = rng(seed || 7), out = [], n = closed ? pts.length : pts.length - 1;
    for (let i = 0; i < n; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length], dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy) || 1;
      const steps = Math.max(1, Math.round(len / 14)), nx = -dy / len, ny = dx / len;
      for (let s = 0; s < steps; s++) { const t = s / steps, j = (r() - 0.5) * 2 * amp * (s ? 1 : 0.3); out.push([p[0] + dx * t + nx * j, p[1] + dy * t + ny * j]); }
    }
    if (!closed) out.push(pts[pts.length - 1]);
    const f = (p) => p[0].toFixed(1) + " " + p[1].toFixed(1), m = (u, v) => [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2];
    let d = closed ? "M" + f(m(out[out.length - 1], out[0])) : "M" + f(out[0]);
    const end = closed ? out.length : out.length - 1;
    for (let i = closed ? 0 : 1; i < end; i++) d += " Q" + f(out[i]) + " " + f(m(out[i], out[(i + 1) % out.length]));
    return d + (closed ? " Z" : " L" + f(out[out.length - 1]));
  }
  const HOTEL_ART = '<svg viewBox="0 0 48 44" aria-hidden="true"><path class="bf" d="M5 41V12l8-4v33zM13 41V8h14v33zM31 41V16h12v25z"/><path d="M27 20h4M27 24h4" class="bl"/><path class="bw" d="M16 13h3M21 13h3M16 18h3M21 18h3M16 23h3M21 23h3M16 28h3M21 28h3M34 21h2.5M38 21h2.5M34 26h2.5M38 26h2.5M34 31h2.5M38 31h2.5M7 16h3M7 21h3M7 26h3M7 31h3"/><path class="bl" d="M2 41h44M18 41v-6h4v6"/></svg>';
  function qrSvg(seed) {
    const n = 21, r = rng(seed || 11), cells = [];
    const finder = (x, y) => { for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) { const edge = i === 0 || j === 0 || i === 6 || j === 6, core = i > 1 && i < 5 && j > 1 && j < 5; if (edge || core) cells.push([x + j, y + i]); } };
    finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
    for (let i = 8; i < n - 8; i++) if (i % 2 === 0) { cells.push([i, 6]); cells.push([6, i]); }
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const inF = (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8) || x === 6 || y === 6;
      if (!inF && r() < 0.44) cells.push([x, y]);
    }
    return `<svg class="qr" viewBox="-1 -1 ${n + 2} ${n + 2}" role="img" aria-label="QR code placeholder"><rect x="-1" y="-1" width="${n + 2}" height="${n + 2}" fill="#fff"/>${cells.map((c) => `<rect x="${c[0]}" y="${c[1]}" width="1" height="1"/>`).join("")}</svg>`;
  }

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  /* ---------- Map ---------- */
  const map = L.map("map", {
    zoomControl: false, zoomSnap: 0.25, zoomDelta: 0.5, wheelPxPerZoomLevel: 90,
    minZoom: 9, maxZoom: 19, maxBounds: [[39.35, -105.75], [40.15, -104.45]], maxBoundsViscosity: 0.8,
    tap: true, attributionControl: true
  });
  map.attributionControl.setPrefix(false);
  map.createPane("routePane").style.zIndex = 410;
  map.createPane("labelPane").style.zIndex = 430;
  map.getPane("labelPane").style.pointerEvents = "none";
  map.createPane("hotelPane").style.zIndex = 440;

  const ink = CFG.basemap.style === "ink" && CFG.basemap.ink;
  document.body.classList.toggle("ink", !!ink);
  const base = L.tileLayer(ink ? CFG.basemap.ink : CFG.basemap.base, { subdomains: "abcd", maxZoom: 20, className: "tiles-base" + (ink ? " tiles-ink" : ""), attribution: CFG.basemap.attribution }).addTo(map);
  const labelUrl = ink ? CFG.basemap.inkLabels : CFG.basemap.labels;
  if (labelUrl) L.tileLayer(labelUrl, { subdomains: "abcd", maxZoom: 20, className: "tiles-labels", pane: "labelPane" }).addTo(map);
  // Rivers through town, drawn on top of the tiles so water reads as water
  map.createPane("waterPane").style.zIndex = 405;
  (GEO.rivers || []).forEach((line) => L.polyline(line, { pane: "waterPane", className: "river", color: "#8FA9AA", weight: 4, opacity: 0.9, lineCap: "round", lineJoin: "round", interactive: false }).addTo(map));

  // If CARTO refuses the tiles, switch to OpenStreetMap's standard tiles.
  // If those fail too (offline preview), draw downtown streets from bundled OSM data.
  let tileOk = 0, tileErr = 0, swapped = false, fallbackOn = false, alt = null;
  base.on("tileload", () => { tileOk++; });
  base.on("tileerror", () => {
    tileErr++;
    if (!swapped && tileErr > 4 && tileOk === 0 && CFG.basemap.fallback) {
      swapped = true;
      map.removeLayer(base);
      document.body.classList.remove("ink");
      alt = L.tileLayer(CFG.basemap.fallback, { maxZoom: 19, className: "tiles-base tiles-osm",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors' }).addTo(map);
      let aOk = 0, aErr = 0;
      alt.on("tileload", () => { aOk++; });
      alt.on("tileerror", () => { aErr++; if (aErr > 6 && aOk === 0) drawFallback(); });
    }
  });
  function drawFallback() {
    {
      if (fallbackOn || !GEO.fallbackRoads) return;
      fallbackOn = true;
      app.classList.add("offline");
      const w = { motorway: 7, primary: 5, secondary: 4, tertiary: 3 };
      Object.keys(w).forEach((k) => (GEO.fallbackRoads[k] || []).forEach((line) =>
        L.polyline(line, { color: "#FFFFFF", weight: w[k], opacity: 1, interactive: false }).addTo(map)));
    }
  }

  let sel = null;
  const HQ = D.hq;
  const HQLL = [HQ.lat, HQ.lng];

  /* ---------- Route ---------- */
  const routes = (D.routes || []).filter((r) => r.show !== false).map((r) => {
    const cls = r.primary ? "primary" : "secondary";
    const o = { pane: "routePane", lineCap: "round", lineJoin: "round", interactive: false };
    const rt = {
      def: r,
      kase: L.polyline(r.path, Object.assign({ className: "rt-case " + cls, color: "#FBFAF4", weight: r.primary ? 10 : 7, opacity: r.primary ? 0.9 : 0.7 }, o)).addTo(map),
      line: L.polyline(r.path, Object.assign({ className: "rt-line " + cls, color: r.primary ? "#BA514E" : "#4A443B", weight: r.primary ? 5.5 : 3, opacity: r.primary ? 1 : 0.55 }, o)).addTo(map),
      pill: L.marker(r.path[Math.floor(r.path.length * 0.55)], { interactive: false, keyboard: false, icon: L.divIcon({ className: "rt-pill-m " + cls, iconSize: [0, 0], html: `<div class="route-pill ${cls}"><span>${esc(r.label)}</span></div>` }) }).addTo(map)
    };
    if (r.snapToRoads) {
      const p0 = r.path[0], p1 = r.path[r.path.length - 1];
      fetch(`https://router.project-osrm.org/route/v1/driving/${p0[1]},${p0[0]};${p1[1]},${p1[0]}?overview=full&geometries=geojson`)
        .then((x) => (x.ok ? x.json() : Promise.reject()))
        .then((j) => {
          const c = j.routes && j.routes[0] && j.routes[0].geometry && j.routes[0].geometry.coordinates;
          if (!c || c.length < 3) return;
          const ll = c.map((p) => [p[1], p[0]]);
          rt.kase.setLatLngs(ll); rt.line.setLatLngs(ll); rt.pill.setLatLng(ll[Math.floor(ll.length * 0.55)]);
        }).catch(() => {});
    }
    return rt;
  });
  const routeFor = (id) => routes.find((rt) => rt.def.to === id || (rt.def.from === id && rt.def.from !== "sheraton"));

  /* ---------- Sheraton footprint ---------- */
  const foot = L.layerGroup((GEO.hotelFootprints || []).map((poly) =>
    L.polygon(poly, { pane: "hotelPane", color: "#121111", weight: 1.6, fillColor: "#BA514E", fillOpacity: 1, interactive: true })
      .on("click", () => select(HQ.id))));

  /* ---------- Markers ---------- */
  const markers = [];
  function addMarker(latlng, html, o) {
    const m = L.marker(latlng, { icon: L.divIcon({ className: "sr-m " + (o.cls || ""), html, iconSize: [0, 0] }), zIndexOffset: o.z || 0, keyboard: false, interactive: !o.static });
    const it = Object.assign({ m, latlng, minZoom: 0, maxZoom: 99, pri: 10, on: false }, o);
    if (!o.static) m.on("click", (e) => {
      const t = e.originalEvent && e.originalEvent.target.closest && e.originalEvent.target.closest("[data-sel]");
      select(t ? t.dataset.sel : o.id);
    });
    markers.push(it);
    return it;
  }

  // Home base
  const hqIt = addMarker(HQLL, `<button class="hq-badge" type="button" data-sel="${HQ.id}" aria-label="${esc(HQ.name)}">${HOTEL_ART}<span class="hq-mark" aria-hidden="true"></span></button>
    <div class="hq-group">
      <button class="hq-tag" type="button" data-sel="${HQ.id}">
        <span class="hq-t"><b>${esc(HQ.name)}</b><small>${esc(HQ.tag)}</small></span></button>
      <button class="hq-help" type="button" data-sel="help-desk"><i>?</i>Super Steve Help Desk</button>
    </div>`, { id: HQ.id, cls: "hq", z: 1000, pri: 100 });

  const byId = {};
  byId[HQ.id] = Object.assign({ _t: "hq" }, HQ);
  D.hotel.forEach((p) => { byId[p.id] = Object.assign({ _t: "hotel" }, p); });

  (D.places || []).filter((p) => p.show !== false).forEach((p) => {
    byId[p.id] = Object.assign({ _t: p.type }, p);
    let html;
    if (p.type === "airport") {
      html = `<button class="air" type="button" data-sel="${p.id}" aria-label="${esc(p.name)}">
          <span class="air-badge">${PLANE}</span>
          <span class="air-lbl"><b>Denver International Airport</b><small>${esc(p.short || "")}</small></span></button>`;
      addMarker([p.lat, p.lng], html, { id: p.id, cls: "airport", z: 800, pri: 90, label: true });
    } else if (p.type === "anchor") {
      html = `<button class="anc" type="button" data-sel="${p.id}" aria-label="${esc(p.name)}">
          <span class="anc-badge">${ROCKS}</span>
          <span class="anc-lbl"><b>${esc(p.name.replace(/ Amphitheatre$/, ""))}</b><small>${esc(p.short || "")}</small></span></button>`;
      addMarker([p.lat, p.lng], html, { id: p.id, cls: "anchor", z: 900, pri: 95 });
    } else if (p.type === "utility") {
      html = `<button class="util-btn" type="button" data-sel="${p.id}" aria-label="${esc(p.name)}"><span class="util-sq">${icon(p.icon)}</span></button>
        <span class="pin-lbl"><b>${esc(p.name)}</b></span>`;
      addMarker([p.lat, p.lng], html, { id: p.id, cls: "util", z: 300, pri: 50, minZoom: p.minZoom || 0, label: true });
    } else {
      html = `<button class="pin-btn" type="button" data-sel="${p.id}" aria-label="${esc(p.name)}">
          <svg class="pin-drop" viewBox="0 0 32 40"><path class="body" d="M16 38.5C16 38.5 3 25.5 3 15.5a13 13 0 0 1 26 0c0 10-13 23-13 23z"/><path class="body-ink" d="${sketch([[16, 38], [6, 26], [3.5, 15.5], [8, 6.5], [16, 3], [24, 6.5], [28.5, 15.5], [26, 26]], true, 0.55, p.id.length * 31)}"/><g class="ic" transform="translate(8.5 8) scale(.625)">${I[p.icon] || ""}</g></svg></button>
        <span class="pin-lbl"><b>${esc(p.name)}</b>${p.short ? `<small>${esc(p.short)}</small>` : ""}</span>`;
      addMarker([p.lat, p.lng], html, { id: p.id, cls: "pin", z: 500, pri: 70, minZoom: p.minZoom || 0, label: true });
    }
  });

  (D.landmarks || []).forEach((l) => {
    addMarker([l.lat, l.lng], `<div class="lm-in${l.art === "hills" ? " hills" : ""}">${ART[l.art] || ""}${l.name ? `<span class="lm-name">${esc(l.name)}</span>` : ""}</div>`,
      { id: l.id, cls: "lm" + (l.art === "hills" ? " lm-hills" : ""), static: true, pri: l.art === "hills" ? 5 : 30, minZoom: l.minZoom || 0, maxZoom: l.maxZoom || 99 });
  });

  /* ---------- Zoom-dependent layers and label culling ---------- */
  function refresh() {
    const z = map.getZoom();
    markers.forEach((it) => {
      const want = z >= it.minZoom && z <= (it.maxZoom == null ? 99 : it.maxZoom);
      if (want && !it.on) {
        it.m.addTo(map); it.on = true;
        const el = it.m.getElement();
        if (el && sel && it.id !== HQ.id) el.classList.toggle("is-on", it.id === sel);
      }
      if (!want && it.on) { it.m.remove(); it.on = false; }
    });
    if (z >= 15) { if (!map.hasLayer(foot)) foot.addTo(map); } else if (map.hasLayer(foot)) foot.remove();
    app.classList.toggle("z-regional", z < 12.5);
    app.classList.toggle("z-close", z >= 15);
    routes.forEach((rt) => { const el = rt.pill.getElement(); if (el) el.style.display = z < 14 ? "" : "none"; });
    requestAnimationFrame(cull);
  }

  function cull() {
    const rects = [];
    const hit = (r) => rects.some((q) => r.left < q.right && q.left < r.right && r.top < q.bottom && q.top < r.bottom);
    const pad = (r, p) => ({ left: r.left - p, top: r.top - p, right: r.right + p, bottom: r.bottom + p });
    [$("brand"), $("ctrl")].forEach((n) => n && rects.push(pad(n.getBoundingClientRect(), 4)));
    if (!card.hidden) rects.push(pad(card.getBoundingClientRect(), 0));
    const live = markers.filter((it) => it.on && it.m.getElement()).sort((a, b) => b.pri - a.pri);
    live.forEach((it) => it.m.getElement().classList.remove("culled", "nolabel"));
    live.forEach((it) => {
      const el = it.m.getElement();
      const core = el.querySelector(".hq-group, .anc-badge, .air-badge, .pin-drop, .util-sq, .lm-in");
      if (it.id === HQ.id) rects.push(pad(el.querySelector(".hq-badge").getBoundingClientRect(), 2));
      if (!core) return;
      const r = pad(core.getBoundingClientRect(), 2);
      if (it.pri < 90 && hit(r)) { el.classList.add("culled"); return; }
      rects.push(r);
    });
    live.forEach((it) => {
      const el = it.m.getElement();
      if (el.classList.contains("culled")) return;
      const lbl = el.querySelector(".pin-lbl, .anc-lbl, .air-lbl");
      if (!lbl) return;
      if (it.cls === "pin") {
        const pt = map.latLngToContainerPoint(it.latlng);
        el.classList.toggle("left", pt.x + 26 + lbl.offsetWidth > innerWidth - 12);
      }
      let r = pad(lbl.getBoundingClientRect(), 2);
      if (hit(r) && it.cls === "pin") {
        el.classList.toggle("left");
        r = pad(lbl.getBoundingClientRect(), 2);
        if (hit(r) || r.left < 4 || r.right > innerWidth - 4) el.classList.toggle("left");
        r = pad(lbl.getBoundingClientRect(), 2);
      }
      if (hit(r) && !el.classList.contains("is-on")) el.classList.add("nolabel"); else rects.push(r);
    });
    routes.forEach((rt) => {
      const pe = rt.pill.getElement(); if (!pe) return;
      const r = pad(pe.firstElementChild.getBoundingClientRect(), 4);
      if (hit(r)) pe.classList.add("culled"); else { pe.classList.remove("culled"); rects.push(r); }
    });
  }
  map.on("zoomend", refresh);
  map.on("moveend", () => requestAnimationFrame(cull));

  /* ---------- Views ---------- */
  function homeView(animate) {
    const pts = [HQLL, [byId["red-rocks"].lat, byId["red-rocks"].lng]];
    if (byId.airport) pts.push([byId.airport.lat, byId.airport.lng]);
    if (isDesk()) map.fitBounds(pts, { paddingTopLeft: [120, 130], paddingBottomRight: [200, 80], animate: !!animate, maxZoom: 13 });
    else {
      // Phones frame the Sheraton and Red Rocks. The airport sits just off to the east, one swipe away.
      const mp = [HQLL, [byId["red-rocks"].lat, byId["red-rocks"].lng]];
      if (byId["certified-tattoo"]) mp.push([byId["certified-tattoo"].lat, byId["certified-tattoo"].lng]);
      map.fitBounds(mp, { paddingTopLeft: [30, 150], paddingBottomRight: [60, 80], animate: !!animate, maxZoom: 13 });
    }
  }

  // Center a point in whatever part of the map the card leaves free.
  function focusOn(latlng, zoom) {
    const z = zoom == null ? map.getZoom() : zoom;
    const size = map.getSize();
    let fx = size.x / 2, fy = size.y / 2;
    if (!card.hidden) {
      if (isDesk()) fx = (size.x - 440) / 2 + 10;
      else fy = 74 + (size.y - card.getBoundingClientRect().height - 74) / 2;
    }
    const p = map.project(latlng, z).subtract([fx - size.x / 2, fy - size.y / 2]);
    map.flyTo(map.unproject(p, z), z, { duration: 0.6 });
  }

  function fitWithCard(latlngs) {
    const pad = isDesk() ? { paddingTopLeft: [70, 110], paddingBottomRight: [600, 60] }
      : { paddingTopLeft: [60, 130], paddingBottomRight: [90, card.getBoundingClientRect().height + 40] };
    map.flyToBounds(latlngs, Object.assign({ duration: 0.6, maxZoom: 13 }, pad));
  }

  /* ---------- Cards ---------- */
  const TBC = '<span class="tbc">TBC</span>';
  const val = (s) => (s === "TBC" ? '<span class="tbc solo">TBC</span>' : esc(s));
  const enc = encodeURIComponent;
  function maps(p, kind) {
    if (p.appleMapsUrl || p.googleMapsUrl) return { apple: p.appleMapsUrl, google: p.googleMapsUrl };
    const addr = p.address;
    if (!addr) return null;
    if (kind === "apple-directions") {
      const to = (p.cta && p.cta.to) || addr;
      return { apple: "https://maps.apple.com/?daddr=" + enc(to), google: "https://www.google.com/maps/dir/?api=1&destination=" + enc(to) };
    }
    const q = p.mapsQuery || p.name;
    return { apple: "https://maps.apple.com/?q=" + enc(q) + "&address=" + enc(addr), google: "https://www.google.com/maps/search/?api=1&query=" + enc(q + ", " + addr) };
  }
  function ctaHtml(p) {
    const c = p.cta || {};
    if (c.kind === "apple-place" || c.kind === "apple-directions") {
      const u = maps(p, c.kind);
      if (!u || !u.apple) return "";
      return `<a class="c-cta" href="${u.apple}" target="_blank" rel="noopener">${icon(c.kind === "apple-directions" ? "route" : "pin")}${esc(c.label)}</a>` +
        (u.google ? `<div class="c-alt"><a href="${u.google}" target="_blank" rel="noopener">or open in Google Maps</a></div>` : "");
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
    const dot = p._t === "anchor" ? "anchor" : p._t === "utility" ? "util" : "";
    const where = p.address ? esc(p.address) : (p.where ? tbcTail(p.where) : '<span class="tbc solo">Address TBC</span>');
    cardBody.innerHTML = `
      <div class="c-kind"><i class="${dot}"></i>${esc(p.kind || "")}</div>
      <h2 class="c-name">${esc(p.name)}</h2>
      ${p.subtitle ? `<p class="c-sub">${esc(p.subtitle)}</p>` : ""}
      <p class="c-where">${where}</p>
      ${whenHtml(p)}
      <p class="c-desc">${esc(p.description)}</p>
      ${accessHtml(p)}
      ${p.qr ? `<div class="c-qr">${qrSvg(p.id.length * 17)}<div class="c-qr-t"><b>${esc(p.qrLabel || "Scan for " + p.name)}</b><small>QR placeholder, design reference</small></div></div>` : ""}
      ${ctaHtml(p)}`;
  }
  function renderHQ() {
    const help = D.hotel.find((h) => h.help);
    const lobby = D.hotel.filter((h) => !h.help && h.spots.some((s) => s.level === "lobby"));
    const up = D.hotel.filter((h) => h.spots.every((s) => s.level === "level2"));
    const row = (h, cls) => `<li class="${cls || ""}"><button type="button" data-sel="${h.id}">
        <span class="dot${h.help ? " help" : ""}">${icon(h.icon)}</span>
        <span><b>${esc(h.name)}</b><small>${esc(h.row || h.level)}</small></span>
        <svg class="chev" viewBox="0 0 24 24">${I.chev}</svg></button></li>`;
    cardBody.innerHTML = `
      <div class="c-kind"><i></i>${esc(HQ.tag)}</div>
      <h2 class="c-name">${esc(HQ.name)}</h2>
      <p class="c-where">${esc(HQ.address)}</p>
      <p class="c-desc">${esc(HQ.description)}</p>
      <div class="hd">${diagram(null)}</div>
      <ul class="hl">${help ? row(help, "help-row") : ""}</ul>
      <p class="hl-h">Lobby level</p><ul class="hl">${lobby.map((h) => row(h)).join("")}</ul>
      <p class="hl-h">Level 2</p><ul class="hl">${up.map((h) => row(h)).join("")}</ul>
      ${ctaHtml(HQ)}`;
  }
  function renderHotelItem(p) {
    cardBody.innerHTML = `
      <button class="c-back" type="button" data-sel="${HQ.id}">${icon("back")}Inside the Sheraton</button>
      <div class="c-kind"><i class="${p.help ? "help" : ""}"></i>${esc(p.level)}</div>
      <h2 class="c-name">${esc(p.name)}</h2>
      ${p.subtitle ? `<p class="c-sub">${esc(p.subtitle)}</p>` : ""}
      ${p.where ? `<p class="c-where">${tbcTail(p.where)}</p>` : ""}
      <div class="hd compact">${diagram(p.id)}</div>
      ${whenHtml(p)}
      <p class="c-desc">${esc(p.description)}</p>
      ${accessHtml(p)}
      ${ctaHtml(p)}
      ${p.help ? `<p class="c-foot">Name of the online help desk ${TBC}</p>` : ""}`;
  }

  /* Hotel guide: the two SR Weekend levels as stacked, labeled plates.
     With a focus id, only the levels that place is on are drawn. */
  function diagram(focus) {
    const s = focus ? 1.62 : 1.9, th = 8, gap = focus ? 26 : 34;
    const plates = { level2: [0, 0, 70, 40], lobby: [0, 0, 100, 40] };
    const f = focus && byId[focus];
    const levels = ["level2", "lobby"].filter((lv) => !f || f.spots.some((sp) => sp.level === lv));
    const H = (lv) => (plates[lv][2] + plates[lv][3]) * 0.5 * s + th;
    let y0 = 62, out = "", tops = {};
    levels.forEach((lv) => { tops[lv] = y0; y0 += H(lv) + gap + (lv === "lobby" ? 64 : 52); });
    const iso = (u, v, lv) => [(u - v) * 0.866 * s, (u + v) * 0.5 * s + tops[lv]];
    const P = (a) => a[0].toFixed(1) + " " + a[1].toFixed(1);
    levels.forEach((lv) => {
      const [u0, v0, u1, v1] = plates[lv];
      const A = iso(u0, v0, lv), B = iso(u1, v0, lv), C = iso(u1, v1, lv), Dd = iso(u0, v1, lv);
      out += `<text class="lvl" x="${(Dd[0]).toFixed(1)}" y="${(A[1] - 40).toFixed(1)}">${lv === "lobby" ? "Lobby level" : "Level 2, event level"}</text>`;
      out += `<path class="side" d="${sketch([B, C, [C[0], C[1] + th], [B[0], B[1] + th]], true, 0.5, 3)}"/>`;
      out += `<path class="side2" d="${sketch([Dd, C, [C[0], C[1] + th], [Dd[0], Dd[1] + th]], true, 0.5, 4)}"/>`;
      out += `<path class="plate" d="${sketch([A, B, C, Dd], true, 0.6, lv === "lobby" ? 5 : 6)}"/>`;
      D.rooms.filter((r) => r.level === lv).forEach((r) => {
        const a = iso(r.u0, r.v0, lv), b = iso(r.u1, r.v0, lv), c = iso(r.u1, r.v1, lv), d = iso(r.u0, r.v1, lv);
        out += `<path class="room" d="${sketch([a, b, c, d], true, 0.5, r.u0 + 9)}"/>`;
        const rm = iso(r.u0 + 4, r.v1 + 2, lv);
        out += `<text class="room-n" x="${rm[0].toFixed(1)}" y="${(rm[1] + 4).toFixed(1)}">${esc(r.name)}</text>`;
      });
      if (lv === "lobby") {
        const a = iso(90, 6, lv), b = iso(95, 6, lv), c = iso(95, 30, lv), d = iso(90, 30, lv);
        out += `<path class="desk" d="M${P(a)} L${P(b)} L${P(c)} L${P(d)}Z"/>`;
        const e = iso(96, 18, lv);
        out += `<text class="hint" x="${(e[0] + 10).toFixed(1)}" y="${(e[1] + 4).toFixed(1)}">Front desk</text>`;
        const me = iso(70, 40, lv), se = iso(0, 20, lv);
        out += `<path class="door" d="M${(me[0]).toFixed(1)} ${(me[1] + th + 22).toFixed(1)} L${me[0].toFixed(1)} ${(me[1] + th + 4).toFixed(1)}"/><text class="hint" x="${me[0].toFixed(1)}" y="${(me[1] + th + 34).toFixed(1)}" text-anchor="middle">Main entrance</text>`;
        out += `<path class="door" d="M${(se[0] - 26).toFixed(1)} ${(se[1] - 13).toFixed(1)} L${(se[0] - 6).toFixed(1)} ${(se[1] - 3).toFixed(1)}"/><text class="hint" x="${(se[0] - 30).toFixed(1)}" y="${(se[1] - 18).toFixed(1)}" text-anchor="end">Street entrance</text>`;
      }
    });
    if (levels.length === 2) {
      const a = iso(68, 20, "level2"), b = iso(68, 20, "lobby");
      out += `<path class="esc" d="M${P([a[0], a[1] + th])} L${P(b)}"/>`;
      out += `<text class="hint" x="${(a[0] + 8).toFixed(1)}" y="${((a[1] + b[1]) / 2 + 14).toFixed(1)}">Escalators</text>`;
    }
    levels.forEach((lv) => D.hotel.forEach((h) => h.spots.forEach((sp) => {
      if (sp.level !== lv) return;
      const [x, y] = iso(sp.u, sp.v, lv);
      const r = h.help ? 13 : 11.5, st = 13, cy = y - st - r + 2;
      const on = focus === h.id, dim = focus && !on;
      const cls = "hp" + (h.help ? " help" : "") + (on ? " on" : "") + (dim ? " dim" : "");
      out += `<g class="${cls}" data-sel="${h.id}" role="button" aria-label="${esc(h.name)}">
        <ellipse class="shadow" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="5.5" ry="2.6"/>
        <path class="stem" d="M${x.toFixed(1)} ${y.toFixed(1)} V${(y - st).toFixed(1)}"/>
        <circle class="head" cx="${x.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}"/>
        <g class="ic" transform="translate(${(x - r * 0.62).toFixed(1)} ${(cy - r * 0.62).toFixed(1)}) scale(${(r * 1.24 / 24).toFixed(3)})">${I[h.icon]}</g>
        ${dim ? "" : `<text class="hp-lbl" x="${(x + r + 5).toFixed(1)}" y="${(cy + 4.5).toFixed(1)}">${esc(h.short || h.name)}</text>`}
        <circle cx="${x.toFixed(1)}" cy="${cy.toFixed(1)}" r="22" fill="transparent"/>
      </g>`;
    })));
    const minX = -40 * 0.866 * s - 98, maxX = 100 * 0.866 * s + 70;
    return `<svg viewBox="${minX.toFixed(0)} 0 ${(maxX - minX).toFixed(0)} ${(y0 - gap - 30).toFixed(0)}" role="img" aria-label="Sheraton levels">${out}</svg>`;
  }

  cardBody.addEventListener("click", (e) => {
    const b = e.target.closest("[data-sel]");
    if (b) { e.preventDefault(); select(b.dataset.sel); }
  });

  /* ---------- Selection ---------- */
  function select(id, opts) {
    const p = byId[id];
    if (!p) return;
    sel = id;
    if (p._t === "hq") renderHQ(); else if (p._t === "hotel") renderHotelItem(p); else renderPlace(p);
    app.classList.add("has-sel");
    const inHotel = p._t === "hq" || p._t === "hotel";
    const hqEl = hqIt.m.getElement();
    if (hqEl) { hqEl.classList.toggle("is-on", inHotel && !p.help); hqEl.classList.toggle("help-on", !!p.help); }
    markers.forEach((it) => { const el = it.m.getElement(); if (el && it.id !== HQ.id) el.classList.toggle("is-on", it.id === id); });
    routes.forEach((rt) => { const on = rt.def.to === id || rt.def.from === id || (id === "shuttle" && rt.def.primary); [rt.kase, rt.line, rt.pill].forEach((l) => { const el = l.getElement ? l.getElement() : null; if (el) el.classList.toggle("is-on", on); }); });
    app.classList.toggle("route-on", !!routeFor(id) || id === "shuttle");
    card.hidden = false;
    cardScroll.scrollTop = 0;
    setParam(id);
    const instant = opts && opts.instant;
    requestAnimationFrame(() => {
      if (inHotel) focusOn(HQLL, Math.max(map.getZoom(), CFG.zoom.hotel));
      else if (routeFor(id) && id !== "sheraton") fitWithCard(routeFor(id).line.getLatLngs());
      else focusOn([p.lat, p.lng], Math.max(map.getZoom(), p.type === "utility" ? 16 : CFG.zoom.place - (p.minZoom ? 0 : 1)));
      if (instant) map.stop();
    });
  }
  function clearSel() {
    if (!sel) return;
    sel = null;
    app.classList.remove("has-sel", "route-on");
    routes.forEach((rt) => [rt.kase, rt.line, rt.pill].forEach((l) => { const el = l.getElement ? l.getElement() : null; if (el) el.classList.remove("is-on"); }));
    markers.forEach((it) => { const el = it.m.getElement(); if (el) el.classList.remove("is-on", "help-on"); });
    card.hidden = true;
    card.style.transform = "";
    setParam(null);
    requestAnimationFrame(cull);
  }
  function setParam(id) {
    const q = new URLSearchParams(location.search);
    if (id) q.set("loc", id); else q.delete("loc");
    const s = q.toString();
    history.replaceState(null, "", location.pathname + (s ? "?" + s : ""));
  }

  map.on("click", clearSel);
  $("close").addEventListener("click", clearSel);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") clearSel(); });
  $("zin").addEventListener("click", () => map.zoomIn(1));
  $("zout").addEventListener("click", () => map.zoomOut(1));
  $("home").addEventListener("click", () => { clearSel(); homeView(true); });

  // Swipe the sheet down to close it.
  (function () {
    let y0 = null, dy = 0;
    const start = (e) => {
      if (isDesk()) return;
      if (cardScroll.scrollTop > 0 && !e.target.closest(".grab")) return;
      if (e.target.closest("a, button:not(.grab), .hp")) return;
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
    const v = params.get("view");
    if (v === "downtown") map.setView([39.7455, -104.9935], CFG.zoom.downtown);
    else homeView(false);
    refresh();
    const start = params.get("loc");
    if (start && byId[start]) select(start);
  }
  addEventListener("resize", () => requestAnimationFrame(cull));
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(boot);
})();
