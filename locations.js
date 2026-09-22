/*
  SR Weekend map. All places, copy and settings live in this file.
  Edit here. You should never need to touch app.js or styles.css to
  add, remove or move a place.

  POSITIONS
  City places use real latitude and longitude (lat, lng).
  Off-map places also use real lat / lng. The map works out which edge
  of the screen to pin them to, so they always point the right way.
  Places inside the Sheraton use `spot`, a position on the illustrated
  hotel diagram: level "lobby" or "level2", u from 0 (back) to 100
  (front right), v from 0 (back) to 40 (front left).

  ADDRESSES
  `address` is what the card shows and what Apple Maps receives.
  It is separate from the drawing position. null shows "Address TBC".

  TBC
  Any text set to exactly "TBC" renders as a TBC chip.
  Hours rows can carry tbc: true to add a chip after the time.
*/

window.SR_MAP = {
  config: {
    eventName: "SR Weekend",
    dates: "Nov 13 to 15, 2026",
    city: "Denver",
    helpDeskUrl: "#steve-help-desk",   // placeholder until the online help desk exists
    itineraryUrl: "#itinerary"          // placeholder until the itinerary section exists
  },

  /* ---------------- HOME BASE ---------------- */
  hq: {
    id: "sheraton",
    name: "Sheraton Denver Downtown",
    tag: "SR Weekend HQ",
    address: "1550 Court Pl, Denver, CO 80202",
    lat: 39.742043, lng: -104.989296,
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
      spots: [{ level: "lobby", u: 80, v: 14 }]
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
      spots: [{ level: "lobby", u: 12, v: 8 }]
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
      spots: [{ level: "lobby", u: 30, v: 6 }]
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
      spots: [{ level: "level2", u: 58, v: 16, tag: "Fri" }, { level: "lobby", u: 22, v: 22, tag: "Sat, Sun" }]
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
      spots: [{ level: "lobby", u: 38, v: 20 }, { level: "lobby", u: 62, v: 28 }]
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
      spots: [{ level: "level2", u: 46, v: 6 }]
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
      spots: [{ level: "level2", u: 62, v: 30, tag: "Fri" }]
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
      spots: [{ level: "level2", u: 16, v: 12 }]
    }
  ],

  /* Rooms drawn on the hotel diagram. Purely visual. */
  rooms: [
    { level: "lobby",  name: "Parlur",         u0: 4,  v0: 3, u1: 44, v1: 37 },
    { level: "level2", name: "Grand Ballroom", u0: 4,  v0: 3, u1: 30, v1: 37 },
    { level: "level2", name: "Mezzanine",      u0: 34, v0: 3, u1: 66, v1: 37 }
  ],

  /* ---------------- AROUND DOWNTOWN ---------------- */
  city: [
    {
      id: "whiskey-row",
      name: "Whiskey Row",
      short: "Bar crawl start",
      icon: "glass",
      kind: "Around downtown",
      address: "1946 Market St, Denver, CO 80202",
      mapsQuery: "Dierks Bentley's Whiskey Row Denver",
      lat: 39.753564, lng: -104.993754,
      hours: [{ day: "Sun", time: "9:30am" }],
      description: "The Sunday morning bar crawl starts here, then heads to Tom's Watch Bar.",
      access: "Ticketed separately",
      cta: { label: "Open in Apple Maps", kind: "apple-place" }
    },
    {
      id: "flyhi",
      name: "Flyhi",
      short: "Partner stop",
      icon: "star",
      kind: "Around downtown",
      address: "401 16th St Mall, Denver, CO 80202",
      mapsQuery: "Flyhi Cannabis Dispensary",
      lat: 39.743496, lng: -104.989616,
      hours: [{ day: "", time: "Hours", tbc: true }],
      description: "SR Weekend partner stop on the 16th Street Mall, a block from the Sheraton. Offer TBC.",
      access: "21+ with valid ID",
      cta: { label: "Open in Apple Maps", kind: "apple-place" }
    },
    {
      id: "shuttle",
      utility: true,
      name: "Shuttle pickup",
      short: "Rides to Red Rocks",
      icon: "bus",
      kind: "Next to the Sheraton",
      address: null,
      where: "Outside the Sheraton, exact spot TBC",
      lat: 39.741639, lng: -104.990352,
      hours: [{ day: "Sat", time: "TBC" }, { day: "Sun", time: "TBC" }],
      description: "Rides to Red Rocks leave from here.",
      cta: { label: "Ask a Super Steve", kind: "goto", target: "help-desk" }
    }
  ],

  /* ---------------- OFF THE MAP ---------------- */
  edge: [
    {
      id: "red-rocks",
      name: "Red Rocks Amphitheatre",
      label: "Red Rocks",
      distance: "30 min west",
      icon: "rocks",
      address: "18300 W Alameda Pkwy, Morrison, CO 80465",
      mapsQuery: "Red Rocks Amphitheatre",
      lat: 39.6654, lng: -105.2057,
      hours: [{ day: "Sat", time: "Doors 6pm" }, { day: "Sun", time: "Doors 2pm" }],
      description: "Both nights are sold out. Plan your ride, it's about 30 minutes west.",
      access: "Sold out",
      cta: { label: "Directions in Apple Maps", kind: "apple-directions" }
    },
    {
      id: "certified-tattoo",
      name: "Certified Tattoo",
      subtitle: "East Colfax studio",
      label: "Certified Tattoo",
      distance: "10 min east",
      address: "3216 E Colfax Ave, Denver, CO 80206",
      mapsQuery: "Certified Tattoo Studios East Colfax",
      lat: 39.7403, lng: -104.9496,
      hours: [{ day: "Nov 9 to 30", time: "During studio hours" }],
      description: "An exclusive mike. flash collection, bookable at Certified's Denver studios.",
      cta: { label: "Open in Apple Maps", kind: "apple-place" }
    },
    {
      id: "denver-improv",
      name: "Denver Improv",
      label: "Denver Improv",
      distance: "20 min northeast",
      address: "8246 Northfield Blvd, Denver, CO 80238",
      mapsQuery: "Denver Improv",
      lat: 39.7837, lng: -104.8918,
      hours: [{ day: "Sun", time: "8:30pm" }],
      description: "Comedy night to close out the weekend.",
      cta: { label: "Open in Apple Maps", kind: "apple-place" }
    }
  ],

  /* Drawn landmarks for orientation. Not tappable. */
  landmarks: [
    { id: "union-station", name: "Union Station", art: "union-station", lat: 39.75314, lng: -105.00013 },
    { id: "capitol", name: "State Capitol", art: "capitol", lat: 39.73927, lng: -104.98484 }
  ]
};
