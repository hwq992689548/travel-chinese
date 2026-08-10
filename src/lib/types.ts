export type SceneId =
  | "airport"
  | "taxi"
  | "hotel"
  | "restaurant"
  | "shopping"
  | "emergency"
  | "smalltalk"
  | "money"
  | "directions"
  | "mobile"
  | "payment"
  | "train"
  | "sightseeing";

export type PracticeItem = {
  zh: string;
  pinyin: string;
  en: string;
};

export type Phrase = {
  id: string;
  scene: SceneId;
  zh: string;
  pinyin: string;
  en: string;
  order: number;
  free: boolean;
  /** Related word groups / short sentences under the head phrase */
  practice: PracticeItem[];
};

export type PhrasesFile = {
  phrases: Phrase[];
};

export const SCENES: {
  id: SceneId;
  title: string;
  blurb: string;
  emoji: string;
}[] = [
  {
    id: "airport",
    title: "Airport",
    blurb: "Passport, gates, baggage, and getting into the city.",
    emoji: "✈️",
  },
  {
    id: "taxi",
    title: "Taxi & Transit",
    blurb: "Taxis, subway, tickets, and directions on the move.",
    emoji: "🚇",
  },
  {
    id: "hotel",
    title: "Hotel",
    blurb: "Check-in, Wi‑Fi, room issues, and late checkout.",
    emoji: "🏨",
  },
  {
    id: "restaurant",
    title: "Restaurant",
    blurb: "Ordering, spice level, allergies, and the bill.",
    emoji: "🍜",
  },
  {
    id: "shopping",
    title: "Shopping",
    blurb: "Prices, sizes, bargaining, and checkout.",
    emoji: "🛍️",
  },
  {
    id: "money",
    title: "Numbers & Money",
    blurb: "Prices, change, big numbers, and counting cash.",
    emoji: "💴",
  },
  {
    id: "directions",
    title: "Directions",
    blurb: "Asking the way, left and right, near and far.",
    emoji: "🧭",
  },
  {
    id: "mobile",
    title: "Phone & Internet",
    blurb: "SIM cards, signal, hotspot, and verification codes.",
    emoji: "📱",
  },
  {
    id: "payment",
    title: "WeChat & Alipay",
    blurb: "QR codes, scan to pay, and cashless checkout.",
    emoji: "💳",
  },
  {
    id: "train",
    title: "Train & High-Speed Rail",
    blurb: "Tickets, platforms, delays, and seat numbers.",
    emoji: "🚄",
  },
  {
    id: "sightseeing",
    title: "Sightseeing & Tickets",
    blurb: "Attractions, entry tickets, hours, and photos.",
    emoji: "🎟️",
  },
  {
    id: "emergency",
    title: "Emergency",
    blurb: "Help, hospital, lost passport, and staying safe.",
    emoji: "🆘",
  },
  {
    id: "smalltalk",
    title: "Small Talk",
    blurb: "Greetings, weather, compliments, and goodbye.",
    emoji: "💬",
  },
];

export const COURSE_PRICE_DISPLAY = "$7.99";
export const FREE_PHRASE_TARGET = 104;
export const UNLOCK_STORAGE_KEY = "travel-chinese-unlocked";
export const PROGRESS_STORAGE_KEY = "travel-chinese-progress";
