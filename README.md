# SR Weekend Map, design reference

A visual and interaction reference for the SR Weekend map (Sheraton Denver Downtown, Nov 13 to 15, 2026). It's a static site with no build step and no API keys, so it runs as is on GitHub Pages.

## How it works

- **One continuous map.** It opens on a real Denver-area map showing the Sheraton, Red Rocks, the drive between them, Certified Tattoo and Denver Improv. Zooming in reveals Whiskey Row, Flyhi and Union Station, and at street level the Sheraton's real building footprints appear in crimson.
- **Sheraton.** Tapping the Sheraton opens the hotel guide, a two-level illustrated view of every SR Weekend spot inside. Tapping any spot opens its card.
- **Other places.** Tapping any other place opens a short card with an Apple Maps button.
- **Red Rocks.** Tapping Red Rocks frames the whole drive from the Sheraton.

## Screenshot links

Add `&clean=1` to hide the Design reference tag.

- Default: `/`
- Downtown zoom: `/?view=downtown`
- Sheraton and hotel guide: `/?loc=sheraton`
- Help desk: `/?loc=help-desk`
- Parlur: `/?loc=parlur`
- Red Rocks and the route: `/?loc=red-rocks`
- Whiskey Row: `/?loc=whiskey-row`
- Flyhi: `/?loc=flyhi`
- Certified Tattoo: `/?loc=certified-tattoo`

## Files

- `index.html`, `styles.css`, `app.js` are the page, styling and behavior
- `locations.js` holds every place, the route, all copy and settings. Edit this file
- `data/geo.js` holds the Sheraton building footprints and an offline street fallback, from OpenStreetMap
- `vendor/leaflet.*` is the map library, Leaflet 1.9.4
- `fonts/` and `assets/` hold the stand-in fonts and the SR monogram

## Editing

Each place in `locations.js` has these fields:

- `show`, `type` (`anchor`, `city` or `utility`), `name` and `short`
- `lat` and `lng`, which set where the marker sits
- `address`, which is what the card shows and what Apple Maps receives
- `hours`, `description`, `access` and one `cta`
- optional `appleMapsUrl` or `googleMapsUrl` overrides
- optional `minZoom`, which hides a marker until the map is zoomed in

Hotel spots use `spots` positions on the diagram, plus a `short` label.

Any text set to exactly `"TBC"` shows as a TBC chip.

## Basemap and route

- **Basemap.** CARTO Voyager raster tiles, tinted warm with the `--tile-filter` CSS variable. They need no key but do require attribution, which stays visible. For production, a styled vector map (MapLibre with OpenFreeMap, Protomaps or Mapbox) using the same colors is the stronger option.
- **Route.** A hand-traced path sits in `locations.js`. On load, the page asks the public OSRM demo router for exact road geometry and swaps it in. The demo router isn't for production use, so the final build should store its own route or use a routing API.
- **Drive time.** The "about 30 min" copy comes from the original brief.
