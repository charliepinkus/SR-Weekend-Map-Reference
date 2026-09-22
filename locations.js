/*
  SR Weekend map: every location, room and setting lives in this file.
  Edit here. You should never need to touch app.js or styles.css to add,
  remove or move a location.

  MAP UNITS
  The map canvas is 390 wide by 686 tall (a 390px phone at 1:1).
  All x / y values below are in those units. On bigger screens the
  whole canvas scales up, markers and labels stay the same size.

  TBC
  Any text value set to exactly "TBC" renders as a TBC chip.
  An address of null renders as "Address TBC".
  Hours rows can carry  tbc: true  to add a TBC chip after the time.
*/

window.SR_MAP = {
  config: {
    // Two-segment Hotel / Denver control. Off by default: one map first.
    showToggle: false,
    eventName: "SR Weekend",
    dates: "Nov 13 to 15, 2026",
    hotelName: "Sheraton Denver Downtown",
    hotelAddress: "1550 Court Pl, Denver, CO 80202",
    // Placeholder anchors until the real site sections exist.
    helpDeskUrl: "#steve-help-desk",
    itineraryUrl: "#itinerary"
  },

  /* Hotel levels, drawn as two stacked plates. */
  plates: [
    { id: "level-2", tab: "Level 2, event level", x: 16, y: 140, w: 324, h: 180 },
    { id: "lobby",   tab: "Lobby level",          x: 16, y: 372, w: 358, h: 220 }
  ],

  /* Named rooms inside the plates. `for` makes the room tappable. */
  areas: [
    { id: "ballroom",  for: "grand-ballroom", x: 28,  y: 152, w: 118, h: 156, note: "Listening party" },
    { id: "mezz",      for: "mezzanine",      x: 154, y: 152, w: 174, h: 156, note: "South Convention Lobby" },
    { id: "parlur",    for: "parlur",         x: 28,  y: 386, w: 142, h: 194, note: "Street entrance", doorLeft: 430, doorRight: 505 }
  ],

  locations: [
    /* ---------- HELP ---------- */
    {
      id: "help-desk",
      enabled: true,
      type: "help",
      name: "Super Steve Help Desk",
      label: "Super Steve\nHelp Desk",
      where: "Lobby level, near the front desk",
      hours: [
        { day: "Fri", time: "2pm to 10pm" },
        { day: "Sat", time: "9am to 5pm" },
        { day: "Sun", time: "9am to 1pm" }
      ],
      description: "Questions? Find the team in orange shirts and hats. A Super Steve is here all weekend to help.",
      access: null,
      cta: { label: "Message a Super Steve", kind: "help" },
      footnote: "Name of the online help desk TBC",
      map: [{ x: 300, y: 456, label: "left", icon: "help" }]
    },

    /* ---------- HOTEL ---------- */
    {
      id: "parlur",
      enabled: true,
      type: "hotel",
      name: "Parlur",
      label: "Parlur",
      where: "Lobby level. Street entrance plus a hotel entrance",
      hours: [
        { day: "Fri", time: "Afternoon", tbc: true, note: "Room key holders first, then the public" },
        { day: "Sat", time: "8am to 6pm" },
        { day: "Sun", time: "8am to noon" }
      ],
      description: "The SR Weekend store. The full assortment, plus coffee and a content station inside.",
      access: "Room key only, first window Friday",
      cta: { label: "Get directions", kind: "apple-directions", address: "1550 Court Pl, Denver, CO 80202" },
      map: [{ x: 46, y: 410, label: "right", icon: "bag" }]
    },
    {
      id: "cafe",
      enabled: true,
      type: "hotel",
      minor: true,
      name: "Café",
      where: "Lobby level, inside the Parlur at the bar",
      hoursFrom: "parlur",
      description: "Coffee inside the Parlur.",
      access: null,
      cta: { label: "Open the Parlur", kind: "location", target: "parlur" },
      map: [{ x: 146, y: 414, icon: "cup" }]
    },
    {
      id: "living-album",
      enabled: true,
      type: "hotel",
      name: "Living Album",
      label: "Living Album",
      where: "Friday on the mezzanine, Level 2. Saturday and Sunday in the Parlur lounge, Lobby level",
      hours: [
        { day: "Fri", time: "From about 5pm", note: "Mezzanine, Level 2" },
        { day: "Sat", time: "During Parlur hours", note: "Parlur lounge" },
        { day: "Sun", time: "During Parlur hours", note: "Parlur lounge" }
      ],
      description: "Step in, put on headphones and explore mike.'s album The In-Betweens through the Living Album.",
      access: null,
      cta: { label: "See it in the itinerary", kind: "itinerary" },
      map: [
        { x: 172, y: 232, label: "right", icon: "headphones", tag: "Fri" },
        { x: 46,  y: 540, label: "right", icon: "headphones", tag: "Sat, Sun", tagBelow: true }
      ]
    },
    {
      id: "content-station",
      enabled: true,
      type: "hotel",
      minor: true,
      name: "Content station",
      where: "Lobby level, inside the Parlur near the lounge",
      hoursFrom: "parlur",
      description: "Grab a photo.",
      access: null,
      cta: { label: "Open the Parlur", kind: "location", target: "parlur" },
      map: [{ x: 146, y: 472, icon: "camera" }]
    },
    {
      id: "photo-moment",
      enabled: true,
      type: "hotel",
      minor: true,
      name: "Photo moment",
      where: "Lobby level, in the main lobby",
      hours: [{ day: "All", time: "TBC" }],
      description: "Grab a photo.",
      access: null,
      cta: { label: "Ask a Super Steve", kind: "location", target: "help-desk" },
      map: [{ x: 262, y: 552, icon: "camera" }]
    },
    {
      id: "mezzanine",
      enabled: true,
      type: "hotel",
      name: "Mezzanine",
      label: "Mezzanine",
      where: "Level 2, top of the escalators",
      hours: [
        { day: "Fri", time: "From about 5:30pm", note: "Bars open at 6pm" }
      ],
      description: "Merch, bars and the Living Album booth on Friday night.",
      access: "Hotel key may be required",
      accessTbc: true,
      cta: { label: "See it in the itinerary", kind: "itinerary" },
      map: [{ x: 172, y: 176, label: "right", icon: "layers" }]
    },
    {
      id: "stevenson-mingle",
      enabled: true,
      type: "hotel",
      name: "Stevenson Mingle",
      label: "Stevenson Mingle",
      where: "Level 2, on the mezzanine. Exact spot TBC",
      hours: [{ day: "Fri", time: "Evening", tbc: true }],
      description: "A Friday night mingle for Steves on the mezzanine.",
      access: null,
      cta: { label: "See it in the itinerary", kind: "itinerary" },
      map: [{ x: 172, y: 284, label: "right", icon: "glass", tag: "Fri" }]
    },
    {
      id: "grand-ballroom",
      enabled: true,
      type: "hotel",
      name: "Grand Ballroom",
      subtitle: "The In-Betweens listening party",
      label: "Grand\nBallroom",
      where: "Level 2",
      hours: [
        { day: "Fri", time: "Doors 8pm" },
        { day: "", time: "9pm to 11pm", note: "Program and live Q&A with mike." },
        { day: "", time: "Until 2am", note: "After party" }
      ],
      description: "mike.'s first and last ever album listening party, followed by the after party.",
      access: "Ticketed",
      cta: { label: "See it in the itinerary", kind: "itinerary" },
      map: [{ x: 46, y: 176, label: "right", icon: "disc" }]
    },

    /* Optional, off by default. Flip enabled to true to show. */
    {
      id: "windows-room",
      enabled: false,
      type: "hotel",
      name: "Windows room",
      subtitle: "Meditation and breathwork",
      label: "Windows",
      where: "Level 2",
      hours: [{ day: "Sat", time: "9:30am and 11:30am" }],
      description: "Morning meditation and breathwork sessions.",
      access: "Sold out",
      cta: { label: "See it in the itinerary", kind: "itinerary" },
      map: [{ x: 306, y: 176, label: "below", icon: "wave" }]
    },
    {
      id: "speakeasy",
      enabled: false,
      type: "hotel",
      name: "Stevenson Speakeasy",
      label: "Speakeasy",
      where: "Lobby level, at the Bezel lobby bar",
      hours: [{ day: "All", time: "TBC" }],
      description: "The Stevenson Speakeasy at the Bezel bar.",
      access: null,
      cta: { label: "See it in the itinerary", kind: "itinerary" },
      map: [{ x: 262, y: 414, label: "right", icon: "glass" }]
    },

    /* ---------- CITY ---------- */
    {
      id: "shuttle",
      enabled: true,
      type: "city",
      name: "Shuttle pickup",
      label: "Shuttle pickup",
      where: "Near the Sheraton, exact spot TBC",
      address: null,
      hours: [{ day: "Sat", time: "TBC" }, { day: "Sun", time: "TBC" }],
      description: "Rides to Red Rocks leave from here.",
      access: null,
      cta: { label: "Ask a Super Steve", kind: "location", target: "help-desk" },
      map: [{ x: 110, y: 630, label: "right" }]
    },
    {
      id: "whiskey-row",
      enabled: true,
      type: "city",
      name: "Whiskey Row",
      subtitle: "Bar crawl start",
      label: "Whiskey Row",
      address: "1946 Market St, Denver, CO 80202",
      hours: [{ day: "Sun", time: "9:30am" }],
      description: "Sunday morning bar crawl, Whiskey Row into Tom's Watch Bar.",
      access: "Ticketed separately",
      cta: { label: "Open in Apple Maps", kind: "apple-place", query: "Whiskey Row Denver" },
      map: [{ x: 146, y: 70, label: "right" }]
    },
    {
      id: "red-rocks",
      enabled: true,
      type: "edge",
      name: "Red Rocks Amphitheatre",
      label: "Red Rocks",
      distance: "30 min west",
      address: "18300 W Alameda Pkwy, Morrison, CO 80465",
      hours: [{ day: "Sat", time: "Doors 6pm" }, { day: "Sun", time: "Doors 2pm" }],
      description: "Both nights are sold out. Plan your ride, it's about 30 minutes west.",
      access: "Sold out",
      cta: { label: "Open in Apple Maps", kind: "apple-place", query: "Red Rocks Amphitheatre" },
      map: [{ x: 14, y: 664, anchor: "left", arrow: "w", icon: "rocks" }]
    },
    {
      id: "certified-tattoo",
      enabled: true,
      type: "edge",
      name: "Certified Tattoo",
      subtitle: "East Colfax studio",
      label: "Certified Tattoo",
      distance: "10 min east",
      address: "3216 E Colfax Ave, Denver, CO 80206",
      hours: [
        { day: "Fri", time: "11am to 8pm" },
        { day: "Sat", time: "11am to 8pm" },
        { day: "Sun", time: "11am to 6pm" }
      ],
      description: "Flash collection available during SR Weekend.",
      access: null,
      cta: { label: "Open in Apple Maps", kind: "apple-place", query: "Certified Tattoo Studios East Colfax" },
      map: [{ x: 376, y: 664, anchor: "right", arrow: "e" }]
    },
    {
      id: "denver-improv",
      enabled: true,
      type: "edge",
      name: "Denver Improv",
      label: "Denver Improv",
      distance: "20 min northeast",
      address: "8246 Northfield Blvd, Denver, CO 80238",
      hours: [{ day: "Sun", time: "8:30pm" }],
      description: "Comedy night to close out the weekend.",
      access: null,
      cta: { label: "Open in Apple Maps", kind: "apple-place", query: "Denver Improv" },
      map: [{ x: 376, y: 24, anchor: "right", arrow: "ne" }]
    }
  ]
};
