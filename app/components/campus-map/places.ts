export type PlaceCategory = "sports" | "food" | "essentials";
export type CampusPlace = {
  id: string;
  name: string;
  shortName: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  mapsUrl: string;
  description: string;
  tags: string[];
  aliases: string[];
  geometryIds: string[];
};

// Coordinates are the destination pins (!3d / !4d), not the camera centers,
// resolved from the organizer's Google Maps links on 20 October 2026.
export const CAMPUS_PLACES: CampusPlace[] = [
  {
    id: "isc", name: "Indoor Sports Complex", shortName: "ISC", category: "sports",
    latitude: 28.521368, longitude: 77.570969, mapsUrl: "https://maps.app.goo.gl/5K7xFy6D1PdRtsZC9",
    description: "Your indoor arena. Find volleyball, basketball, table tennis, badminton and pool here.",
    tags: ["Volleyball", "Basketball", "Table tennis", "Badminton", "Pool"],
    aliases: ["isc", "indoor", "indoor courts", "sports complex", "tt", "table tennis", "badminton", "pool", "basketball", "volleyball", "squash"],
    geometryIds: ["454615138"],
  },
  {
    id: "cricket", name: "Cricket Stadium", shortName: "Cricket", category: "sports",
    latitude: 28.5260497, longitude: 77.5732257, mapsUrl: "https://maps.app.goo.gl/rdqYanbvgL3zhDBJ8",
    description: "The campus cricket ground. Find the action out on the field.",
    tags: ["Cricket", "Outdoor"], aliases: ["cricket ground", "cricket field", "stadium", "pitch"], geometryIds: ["1330195547"],
  },
  {
    id: "athletics", name: "Athletics Ground", shortName: "Athletics", category: "sports",
    latitude: 28.5192614, longitude: 77.5748904, mapsUrl: "https://maps.app.goo.gl/EbAjpUR8buyRgh2YA",
    description: "Find the SURGE athletics events at this campus ground.",
    tags: ["Athletics", "Track & field", "Outdoor"], aliases: ["athletics field", "athletic", "running", "track and field", "races", "sprint", "relay"], geometryIds: ["724033015"],
  },
  {
    id: "football-futsal", name: "Football & Futsal Ground", shortName: "Football / Futsal", category: "sports",
    latitude: 28.5230542, longitude: 77.5718497, mapsUrl: "https://maps.app.goo.gl/XjqG1xPYf1sEpTZD8",
    description: "One ground, two playing areas for football and futsal. Food stalls are also planned at the futsal area.",
    tags: ["Football", "Futsal", "Food stalls"], aliases: ["football", "futsal", "soccer", "women futsal", "food", "stalls"], geometryIds: ["1473676596"],
  },
  {
    id: "volleyball", name: "Volleyball Courts", shortName: "Volleyball", category: "sports",
    latitude: 28.5244324, longitude: 77.5717481, mapsUrl: "https://maps.app.goo.gl/VcDB39t8kh3aaQgu9",
    description: "The outdoor volleyball courts. Indoor volleyball is at the ISC.",
    tags: ["Volleyball", "Outdoor"], aliases: ["volley", "volleyball court", "outdoor volleyball"], geometryIds: ["454615140"],
  },
  {
    id: "basketball", name: "Basketball Courts", shortName: "Basketball", category: "sports",
    latitude: 28.5241774, longitude: 77.5710535, mapsUrl: "https://maps.app.goo.gl/ksQqDz37YbnTSHGk8",
    description: "The outdoor basketball courts. Indoor basketball is at the ISC.",
    tags: ["Basketball", "Outdoor"], aliases: ["basketball court", "outdoor basketball", "hoops"], geometryIds: ["547215952"],
  },
  {
    id: "tennis", name: "Tennis Courts", shortName: "Tennis", category: "sports",
    latitude: 28.5240104, longitude: 77.5715651, mapsUrl: "https://maps.app.goo.gl/xQuKdcS1jdDM9fT79",
    description: "Find the campus outdoor tennis courts here.",
    tags: ["Tennis", "Outdoor"], aliases: ["lawn tennis", "tennis court"], geometryIds: ["547215905"],
  },
  {
    id: "dh1", name: "Dining Hall 1", shortName: "DH1", category: "food",
    latitude: 28.5237884, longitude: 77.5736399, mapsUrl: "https://maps.app.goo.gl/GYNqayRBwCrKuhoA6",
    description: "Dining Hall 1. A familiar campus stop for meals.",
    tags: ["Dining hall", "Meals"], aliases: ["dh1", "dh 1", "dining hall one", "mess", "canteen", "lunch", "dinner", "breakfast"], geometryIds: ["369149872"],
  },
  {
    id: "dh2", name: "Dining Hall 2", shortName: "DH2", category: "food",
    latitude: 28.5244711, longitude: 77.5702258, mapsUrl: "https://maps.app.goo.gl/WSHW7Hj2eojisCEr6",
    description: "Dining Hall 2. Find your way here for meals on campus.",
    tags: ["Dining hall", "Meals"], aliases: ["dh2", "dh 2", "dining hall two", "mess", "canteen", "lunch", "dinner", "breakfast"], geometryIds: ["394600733"],
  },
  {
    id: "sarc", name: "SARC Food Court", shortName: "SARC", category: "food",
    latitude: 28.5235504, longitude: 77.5744971, mapsUrl: "https://maps.app.goo.gl/6VxxEMQ3aETCcRfJA",
    description: "Known on campus as SARC, this food court has a selection of food shops.",
    tags: ["Food court", "Food shops"], aliases: ["sarc", "food court", "food shops", "fat guys kitchen", "snacks", "restaurant"], geometryIds: [],
  },
  {
    id: "grub", name: "Grub by Greenox", shortName: "Grub", category: "food",
    latitude: 28.5279515, longitude: 77.5743838, mapsUrl: "https://maps.app.goo.gl/7HcUhPesT5GhHpUo8",
    description: "A sit-down restaurant on campus, by Greenox.",
    tags: ["Restaurant", "Greenox"], aliases: ["grub", "greenox", "restaurant", "lunch", "dinner"], geometryIds: [],
  },
  {
    id: "cnd", name: "CND", shortName: "CND", category: "food",
    latitude: 28.525422, longitude: 77.576308, mapsUrl: "https://maps.app.goo.gl/iKLVbfru87hhxJRV9",
    description: "Between the academic blocks: tea, shakes, snacks and a mix of stalls.",
    tags: ["Tea", "Shakes", "Snacks"], aliases: ["cnd", "c and d", "c & d", "tea", "chai", "shakes", "snacks", "stalls", "academic blocks"], geometryIds: [],
  },
  {
    id: "nescafe", name: "Nescafé", shortName: "Nescafé", category: "food",
    latitude: 28.524852, longitude: 77.5746087, mapsUrl: "https://maps.app.goo.gl/nzBAjfj684ZyaFJb6",
    description: "The campus Nescafé stop. Grab a coffee between games.",
    tags: ["Coffee", "Café"], aliases: ["nescafe", "cafe", "coffee", "snacks"], geometryIds: [],
  },
  {
    id: "chess-garden", name: "Chess Garden Food Stalls", shortName: "Chess Garden", category: "food",
    latitude: 28.5238204, longitude: 77.5720714, mapsUrl: "https://maps.app.goo.gl/DQTjvxYB4UGE5CAa6",
    description: "Find SURGE food stalls at the Chess Garden.",
    tags: ["Food stalls", "Chess Garden"], aliases: ["chess", "garden", "food stalls", "honorable spot"], geometryIds: ["904404333"],
  },
  {
    id: "gate1", name: "Gate 1 · Visitor Entry", shortName: "Gate 1", category: "essentials",
    latitude: 28.533558, longitude: 77.576563, mapsUrl: "https://maps.app.goo.gl/7NGQ1xcf4bQPLS1u7",
    description: "Arriving for SURGE? Use Gate 1, the designated visitor entrance.",
    tags: ["Visitor entrance", "Arrival"], aliases: ["gate1", "gate 1", "gate one", "entry", "entrance", "visitor", "arrival", "directions", "main gate"], geometryIds: [],
  },
];

export const CATEGORY_LABELS: Record<PlaceCategory, string> = {
  sports: "Sports", food: "Food & dining", essentials: "Essentials",
};
