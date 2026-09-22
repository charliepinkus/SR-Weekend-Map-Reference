# SR Weekend Map, design reference

A design and UX reference for the map on the SR Weekend site (Sheraton Denver Downtown, Nov 13 to 15, 2026). It's static HTML, CSS and JavaScript, with no build step and no API keys, so it runs as is on GitHub Pages.

## What it shows

- A real map of downtown Denver built from OpenStreetMap data (streets, blocks, building footprints, parks, rivers), styled in the SR palette and rotated so the downtown grid runs square.
- The Sheraton as SR Weekend HQ, with its real footprint in crimson and the Super Steve Help Desk attached.
- Tapping the Sheraton opens a guide to the spots inside, across Lobby level and Level 2.
- City pins for Whiskey Row and Flyhi, a shuttle pickup marker, and off-map chips for Red Rocks, Certified Tattoo and Denver Improv that point the real direction.
- City cards hand off to Apple Maps, with Google Maps as a secondary link.

## Screenshot links

Add `&clean=1` to hide the Design reference tag.

- Default: `/`
- Sheraton: `/?loc=sheraton`
- Help desk: `/?loc=help-desk`
- Parlur: `/?loc=parlur`
- Whiskey Row: `/?loc=whiskey-row`
- Flyhi: `/?loc=flyhi`
- Certified Tattoo: `/?loc=certified-tattoo`
- Red Rocks: `/?loc=red-rocks`

## Files

- `index.html`, `styles.css`, `app.js` are the page, styling and behavior
- `locations.js` holds every place, all copy and settings. Edit this file
- `data/basemap.js` is the processed Denver map data
- `vendor/d3.min.js` handles pan and zoom
- `fonts/`, `assets/` hold the stand-in fonts and SR monogram
- `tools/prep.py` is the script that built `data/basemap.js`, for reference

## Editing places

City and off-map places use real `lat` and `lng`. Places inside the Sheraton use `spots`, a position on the hotel diagram. Every place has a `name`, `address` or `where`, `hours`, a one or two sentence `description`, an optional `access` tag and one `cta`. Any text set to exactly `"TBC"` shows as a TBC chip. An `address` of `null` shows Address TBC.

## Notes for the production build

- The bundled street data covers downtown and stops at Broadway, so the Capitol Hill side is drawn with only Colfax, Broadway and the Capitol. For production, a styled vector-tile map (MapLibre with OpenFreeMap, Protomaps or Mapbox) using these same colors gives full coverage.
- The rotated grid is a design choice. A north-up map works too if the team prefers it to match Apple Maps.
- Flyhi's position comes from its address at 16th and Tremont. The offer and hours are TBC.
- Certified's Nov 9 to 30 dates come from the deal terms. The pin is the East Colfax studio.
- Map data © OpenStreetMap contributors, ODbL. The attribution stays visible on the map.
