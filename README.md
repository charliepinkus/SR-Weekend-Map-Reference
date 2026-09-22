# SR Weekend Map, design reference

An interactive design and UX reference for the map on the SR Weekend site (Sheraton Denver Downtown, Nov 13 to 15, 2026). It is a communication prototype for the site's developers. There is no backend and no mapping API. Everything is static HTML, CSS and JavaScript, so it runs on GitHub Pages with no build step.

## Files

- `index.html` page shell
- `styles.css` all styling. Colors are CSS variables at the top of the file
- `app.js` draws the map, markers and cards. You should not need to edit it
- `locations.js` every location, room and setting. Edit this file
- `fonts/` self-hosted stand-in fonts
- `assets/sr-mark.svg` SR monogram

## Screenshot states

Add `&clean=1` to any of these to hide the small "Design reference" tag.

1. Mobile default: `/`
2. Mobile, hotel spot: `/?loc=parlur`
3. Mobile, city spot with Apple Maps: `/?loc=whiskey-row` (or `/?loc=red-rocks`)
4. Mobile, help desk: `/?loc=help-desk`
5. Desktop, a spot selected: `/?loc=grand-ballroom`

`?debug=1` outlines every label and marker and flags any overlap in red.

## Editing locations

Open `locations.js`. Each entry has:

- `id` used in the `?loc=` link
- `enabled` set to `false` to hide it
- `type` one of `help`, `hotel`, `city`, `edge` (edge means off the map, shown as a chip)
- `minor: true` for small unlabeled hotel markers
- `name`, `subtitle`, `label` (the short map label, `\n` for a line break)
- `where` level and area for hotel spots, `address` for city spots (`null` shows Address TBC)
- `hours` a list of `{ day, time, note, tbc }`. Or `hoursFrom: "parlur"` to reuse another spot's hours
- `description` one or two sentences
- `access` the tag, like Ticketed or Sold out. `accessTbc: true` adds a TBC chip
- `cta` the one button. `kind` is `apple-place`, `apple-directions`, `help`, `itinerary`, `location` (opens another card) or a plain `url`
- `map` one or more positions `{ x, y, label, icon, tag, tagBelow }`. Edge chips use `{ x, y, anchor, arrow }`

Map positions are in map units on a 390 by 686 canvas, the size of a phone. They are only for drawing. The Apple Maps link is built from `address`, never from the position. Rooms and the two level plates are in the `plates` and `areas` lists in the same file.

Any value set to exactly `"TBC"` renders as a TBC chip.

Settings live in `config`. `showToggle: true` turns on the Hotel and Denver control. It is off by default.

## Run locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy to GitHub Pages

1. Create a public repo named `SR-Weekend-Map-Reference`
2. Upload every file in this folder to the root of the repo, keeping the `fonts` and `assets` folders
3. Settings, Pages, Source: Deploy from a branch, Branch: `main`, folder `/ (root)`, Save
4. The site goes live at `https://<username>.github.io/SR-Weekend-Map-Reference/` within a minute or two

## Decisions and assumptions

- One map. The hotel is drawn as two stacked plates, Level 2 on top and the Lobby level below, joined by the escalators. Downtown is compressed around it and is not to scale. The toggle wasn't needed but is built and off.
- Hotel layout is schematic. The Level 2 plate sits over the Parlur side, per the freight elevator note. The Parlur is on the left with its street entrance, the front desk and fireplace wall are on the right.
- Denver Improv is at 8246 Northfield Blvd, well outside downtown, so it is an edge chip.
- Certified Tattoo runs the flash collection across its Denver studios. The chip points to the East Colfax studio (3216 E Colfax Ave), the closest to downtown. Hours shown are Certified's standard hours and should be confirmed.
- Whiskey Row address is 1946 Market St. Red Rocks is 18300 W Alameda Pkwy, Morrison.
- Shuttle pickup address and times are TBC, so its button routes to the help desk.
- The café card does not say whether coffee is sold or sampled.
- Hotel cards without a place to navigate to link to the itinerary as a placeholder anchor. The help desk button links to a placeholder anchor until the online help desk exists.
- Fonts are stand-ins for the SR system. Bricolage Grotesque for names, Instrument Sans for body, Courier Prime in place of American Typewriter for small labels and times.
- The one orange on the map is the help desk, to match the Super Steve shirts.
