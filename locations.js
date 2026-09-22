/*
  SR Weekend map. Every place, all copy and all settings live in this file.
  Edit here. You should never need to touch app.js or styles.css to add,
  remove or move a place.

  PLACES
  Every place outside the hotel has:
    id, show (true or false), type ("anchor", "city" or "utility"),
    name, short (one line under the name on the map), icon,
    lat and lng (where the marker sits), address (what the card shows),
    hours, description, access, cta.
    qr: true adds a placeholder QR graphic to the card, with qrLabel as its caption.
    icon picks the glyph in the pin: saloon, flash, leaf, glass, star, bus, mic, pen.
  Optional: appleMapsUrl and googleMapsUrl override the links the map builds
  from the address. minZoom hides a marker until the map is zoomed in that far.

  INSIDE THE SHERATON
  Hotel places use `spots`, a position on the hotel diagram:
  level "lobby" or "level2", u from 0 (back) to 100 (front right),
  v from 0 (back) to 40 (front left). `short` is the label on the diagram.

  TBC
  Any text set to exactly "TBC" renders as a TBC chip.
  Hours rows can carry tbc: true to add a chip after the time.
  An address of null shows "Address TBC".
*/

window.SR_MAP = {
  config: {
    eventName: "SR Weekend",
    dates: "Nov 13 to 15, 2026",
    city: "Denver",
    helpDeskUrl: "#steve-help-desk",   // placeholder until the online help desk exists
    itineraryUrl: "#itinerary",         // placeholder until the itinerary section exists

    // Basemap. CARTO Voyager tiles, using the same CARTO key as the Denver OOH
    // map. If CARTO refuses the tiles, the page switches to OpenStreetMap's
    // standard tiles (no key) so the map never loads blank.
    // The warm SR tint is applied in styles.css (--tile-filter).
    basemap: {
      base: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=cb1_2ka0_1_a41e46da6e6dddc06d5efeba",
      labels: null,
      fallback: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>'
    },

    // Zoom levels for the one continuous map
    zoom: { hotel: 16.5, downtown: 14.5, place: 15 }
  },

  /* ---------------- THE DRIVE TO RED ROCKS ----------------
     A hand-traced path along the real roads (Speer, 6th Ave, I-70, CO 26).
     When snapToRoads is true the page asks the public OSRM router for the
     exact road geometry and swaps it in. If that fails, this path stays. */
  route: {
    show: true,
    from: "sheraton",
    to: "red-rocks",
    label: "Sheraton to Red Rocks, about 30 min",
    snapToRoads: true,
    path: [
      [39.7421, -104.9899], [39.7395, -104.9938], [39.7380, -104.9985], [39.7356, -105.0100],
      [39.7350, -105.0250], [39.7340, -105.0400], [39.7330, -105.0520], [39.7290, -105.0680],
      [39.7250, -105.0810], [39.7200, -105.1000], [39.7180, -105.1100], [39.7190, -105.1400],
      [39.7220, -105.1650], [39.7100, -105.1860], [39.6900, -105.1960], [39.6750, -105.2010],
      [39.6654, -105.2057]
    ]
  },

  /* ---------------- HOME BASE ---------------- */
  hq: {
    id: "sheraton",
    name: "Sheraton Denver Downtown",
    tag: "SR Weekend Home Base",
    address: "1550 Court Pl, Denver, CO 80202",
    lat: 39.742375, lng: -104.98973,
    description: "Home base for the weekend. The store, the listening party and the help desk are all here.",
    cta: { label: "Get directions", kind: "apple-directions" }
  },

  /* ---------------- INSIDE THE SHERATON ---------------- */
  hotel: [
    {
      id: "help-desk",
      row: "Lobby, near the front desk",
      name: "Super Steve Help Desk",
      icon: "help",
      help: true,
      where: "Sheraton lobby, near the front desk",
      level: "Lobby level",
      hours: [
        { day: "Fri", time: "2pm to 10pm" },
        { day: "Sat", time: "9am to 5pm" },
        { day: "Sun", time: "9am to 1pm" }
      ],
      description: "Questions? Find the team in orange shirts and hats. A Super Steve will be here throughout the weekend to help.",
      cta: { label: "Message a Super Steve", kind: "help" },
      short: "Help desk",
      spots: [{ level: "lobby", u: 86, v: 12 }]
    },
    {
      id: "parlur",
      row: "The SR Weekend store",
      name: "Parlur",
      icon: "bag",
      where: "Street entrance plus a hotel entrance",
      level: "Lobby level",
      hours: [
        { day: "Fri", time: "Afternoon", tbc: true, note: "Room key holders first, then the public" },
        { day: "Sat", time: "8am to 6pm" },
        { day: "Sun", time: "8am to noon" }
      ],
      description: "The SR Weekend store. The full assortment, plus coffee and a content station inside.",
      access: "Room key only, first window Friday",
      cta: { label: "See it in the itinerary", kind: "itinerary" },
      short: "Parlur",
      spots: [{ level: "lobby", u: 8, v: 4 }]
    },
    {
      id: "cafe",
      row: "Coffee inside the Parlur",
      name: "Café",
      icon: "cup",
      where: "Inside the Parlur, at the bar",
      level: "Lobby level",
      hoursFrom: "parlur",
      description: "Coffee inside the Parlur.",
      cta: { label: "Open the Parlur", kind: "goto", target: "parlur" },
      short: "Café",
      spots: [{ level: "lobby", u: 46, v: 0 }]
    },
    {
      id: "living-album",
      row: "Fri on Level 2, Sat and Sun in the Parlur",
      name: "Living Album",
      icon: "headphones",
      where: "Friday on the mezzanine. Saturday and Sunday in the Parlur lounge",
      level: "Level 2 on Friday, Lobby level after",
      hours: [
        { day: "Fri", time: "From about 5pm", note: "Mezzanine, Level 2" },
        { day: "Sat", time: "During Parlur hours", note: "Parlur lounge" },
        { day: "Sun", time: "During Parlur hours", note: "Parlur lounge" }
      ],
      description: "Step in, put on headphones and explore mike.'s album The In-Betweens through the Living Album.",
      cta: { label: "See it in the itinerary", kind: "itinerary" },
      short: "Living Album",
      spots: [{ level: "level2", u: 40, v: 30, tag: "Fri" }, { level: "lobby", u: 6, v: 30, tag: "Sat, Sun" }]
    },
    {
      id: "content-stations",
      row: "In the Parlur and the main lobby",
      name: "Content stations",
      icon: "camera",
      where: "Inside the Parlur near the lounge, plus a photo moment in the lobby",
      level: "Lobby level",
      hours: [{ day: "", time: "Times", tbc: true }],
      description: "Grab a photo.",
      cta: { label: "Open the Parlur", kind: "goto", target: "parlur" },
      short: "Photos",
      spots: [{ level: "lobby", u: 26, v: 30 }, { level: "lobby", u: 60, v: 36 }]
    },
    {
      id: "mezzanine",
      row: "Top of the escalators, Fri night",
      name: "Mezzanine",
      subtitle: "South Convention Lobby",
      icon: "layers",
      where: "Top of the escalators",
      level: "Level 2",
      hours: [{ day: "Fri", time: "From about 5:30pm", note: "Bars open at 6pm" }],
      description: "Merch, bars and the Living Album booth on Friday night.",
      access: "Hotel key may be required",
      accessTbc: true,
      cta: { label: "See it in the itinerary", kind: "itinerary" },
      short: "Mezzanine",
      spots: [{ level: "level2", u: 48, v: 2 }]
    },
    {
      id: "stevenson-mingle",
      row: "Fri evening on the mezzanine",
      name: "Stevenson Mingle",
      icon: "glass",
      where: "On the mezzanine. Exact spot TBC",
      level: "Level 2",
      hours: [{ day: "Fri", time: "Evening", tbc: true }],
      description: "A Friday night mingle for Steves on the mezzanine.",
      cta: { label: "See it in the itinerary", kind: "itinerary" },
      short: "Mingle",
      spots: [{ level: "level2", u: 58, v: 34, tag: "Fri" }]
    },
    {
      id: "grand-ballroom",
      row: "Listening party, Fri doors 8pm",
      name: "Grand Ballroom",
      subtitle: "The In-Betweens listening party",
      icon: "disc",
      where: "",
      level: "Level 2",
      hours: [
        { day: "Fri", time: "Doors 8pm" },
        { day: "", time: "9pm to 11pm", note: "Program and live Q&A with mike." },
        { day: "", time: "Until 2am", note: "After party" }
      ],
      description: "mike.'s first and last ever album listening party, followed by the after party.",
      access: "Ticketed",
      cta: { label: "See it in the itinerary", kind: "itinerary" },
      short: "Ballroom",
      spots: [{ level: "level2", u: 10, v: 8 }]
    }
  ],

  /* Rooms drawn on the hotel diagram. Purely visual. */
  rooms: [
    { level: "lobby",  name: "Parlur",         u0: 4,  v0: 3, u1: 48, v1: 37 },
    { level: "level2", name: "Grand Ballroom", u0: 4,  v0: 3, u1: 30, v1: 37 },
    { level: "level2", name: "Mezzanine",      u0: 34, v0: 3, u1: 66, v1: 37 }
  ],

  /* ---------------- AROUND DENVER ---------------- */
  places: [
    {
      id: "red-rocks",
      show: true,
      type: "anchor",
      name: "Red Rocks Amphitheatre",
      short: "Sat and Sun, sold out",
      kind: "Show nights",
      address: "18300 W Alameda Pkwy, Morrison, CO 80465",
      mapsQuery: "Red Rocks Amphitheatre",
      lat: 39.6654, lng: -105.2057,
      hours: [{ day: "Sat", time: "Doors 6pm" }, { day: "Sun", time: "Doors 2pm" }],
      description: "Both nights are sold out. Plan your ride, it's about 30 minutes west of the Sheraton.",
      access: "Sold out",
      cta: { label: "Directions in Apple Maps", kind: "apple-directions" }
    },
    {
      id: "whiskey-row",
      show: true,
      type: "city",
      name: "Whiskey Row",
      short: "Bar crawl start",
      icon: "saloon",
      kind: "Downtown",
      address: "1946 Market St, Denver, CO 80202",
      mapsQuery: "Dierks Bentley's Whiskey Row Denver",
      lat: 39.753564, lng: -104.993754,
      minZoom: 12.5,
      hours: [{ day: "Sun", time: "9:30am" }],
      description: "SR Weekend stop. The Sunday morning bar crawl starts here, then heads to Tom's Watch Bar.",
      access: "Ticketed separately",
      cta: { label: "Open in Apple Maps", kind: "apple-place" }
    },
    {
      id: "flyhi",
      show: true,
      type: "city",
      name: "Flyhi Cannabis",
      short: "Partner stop",
      icon: "leaf",
      kind: "Downtown",
      address: "401 16th St Mall, Denver, CO 80202",
      mapsQuery: "Flyhi Cannabis Dispensary",
      lat: 39.743496, lng: -104.989616,
      minZoom: 14,
      hours: [{ day: "", time: "Hours", tbc: true }],
      description: "SR Weekend partner stop on the 16th Street Mall, a block from the Sheraton. Offer TBC.",
      access: "21+ with valid ID",
      cta: { label: "Open in Apple Maps", kind: "apple-place" }
    },
    {
      id: "certified-tattoo",
      show: true,
      type: "city",
      name: "Certified Tattoo",
      short: "mike. flash collection",
      icon: "flash",
      qr: true,
      qrLabel: "Scan for Certified Tattoo",
      kind: "East Colfax",
      address: "3216 E Colfax Ave, Denver, CO 80206",
      mapsQuery: "Certified Tattoo Studios East Colfax",
      lat: 39.7403, lng: -104.9496,
      hours: [{ day: "Nov 9 to 30", time: "During studio hours" }],
      description: "An exclusive mike. flash collection, bookable at Certified's Denver studios.",
      cta: { label: "Open in Apple Maps", kind: "apple-place" }
    },
    {
      id: "denver-improv",
      show: true,
      type: "city",
      name: "Denver Improv",
      short: "Sunday comedy",
      icon: "mic",
      kind: "Northfield",
      address: "8246 Northfield Blvd, Denver, CO 80238",
      mapsQuery: "Denver Improv",
      lat: 39.7837, lng: -104.8918,
      hours: [{ day: "Sun", time: "8:30pm" }],
      description: "Comedy night to close out the weekend.",
      cta: { label: "Open in Apple Maps", kind: "apple-place" }
    },
    {
      id: "shuttle",
      show: true,
      type: "utility",
      name: "Shuttle pickup",
      short: "Rides to Red Rocks",
      icon: "bus",
      kind: "Next to the Sheraton",
      address: null,
      where: "Outside the Sheraton, exact spot TBC",
      lat: 39.741639, lng: -104.990352,
      minZoom: 15,
      hours: [{ day: "Sat", time: "TBC" }, { day: "Sun", time: "TBC" }],
      description: "Rides to Red Rocks leave from here.",
      cta: { label: "Ask a Super Steve", kind: "goto", target: "help-desk" }
    }
  ],

  /* Drawn landmarks for orientation. Not tappable. */
  landmarks: [
    { id: "union-station", name: "Union Station", art: "union-station", lat: 39.7532, lng: -105.0001, minZoom: 14 },
    { id: "capitol", name: "State Capitol", art: "capitol", lat: 39.73927, lng: -104.98484, minZoom: 14 }
  ]
};
