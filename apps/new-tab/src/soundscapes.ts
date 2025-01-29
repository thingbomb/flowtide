type Category =
  | "water"
  | "nature"
  | "sleep"
  | "chill"
  | "ambience"
  | "focus"
  | "relax"
  | "appliance"
  | "favorites"
  | "natural";

interface Soundscape {
  name: string;
  emoji: string;
  url: string;
  volume: number;
  attribution: string[];
  image: string;
  index: number;
  categories: Category[];
}

let soundscapes = [
  {
    name: "Ocean",
    emoji: "🌊",
    url: "https://utfs.io/f/VU8He2t54NdYu8EVsK5tgWb3e9PanFUMzSxQm0HhV1XofujB",
    volume: 1,
    attribution: [
      "Seawash (calm)  by craiggroshek -- https://freesound.org/s/176617/ -- License: Creative Commons 0",
    ],
    image: "https://utfs.io/f/VU8He2t54NdYnavqSh6Uydx5HzbJtTENYqUwVaPOXZCnAiK2",
    index: 0,
    categories: ["water", "chill", "focus", "relax"],
  },
  {
    name: "Forest",
    emoji: "🌴",
    url: "https://utfs.io/f/VU8He2t54NdYuNACgha5tgWb3e9PanFUMzSxQm0HhV1Xofuj",
    volume: 1,
    attribution: [
      "Birds In Spring (Scotland) by BurghRecords -- https://freesound.org/s/463903/ -- License: Creative Commons 0",
    ],
    image: "https://utfs.io/f/VU8He2t54NdYpgBC9am76CiVAS4EwQty3arMPfHR1bxgdkZD",
    index: 1,
    categories: ["nature", "ambience"],
  },
  {
    name: "Rain",
    emoji: "💦",
    url: "https://utfs.io/f/VU8He2t54NdY9vI0WdS2OVPpzlUIsm50S3eRo4JLb68vxBYA",
    volume: 1,
    attribution: [
      "Rain.wav by idomusics -- https://freesound.org/s/518863/ -- License: Creative Commons 0",
    ],
    image: "https://utfs.io/f/VU8He2t54NdYOYYMxdZ45tUV7W1K4ESdzvZfN8Pr2yCwGuTi",
    index: 2,
    categories: ["favorites", "nature", "ambience", "sleep", "chill", "relax"],
  },
  {
    name: "River",
    emoji: "🪨",
    url: "https://utfs.io/f/VU8He2t54NdYd9CJeYhMOCr41owzn9sPYh5cNKJQFBEtaWu0",
    volume: 0.8,
    attribution: [
      "river small brook stream with rolling splashy good detail.flac by kyles -- https://freesound.org/s/454155/ -- License: Creative Commons 0",
    ],
    image: "https://utfs.io/f/VU8He2t54NdYK6sDVKYu2OlbUPXGzdjtJ5iT6AaRH0yZuqD8",
    index: 3,
    categories: ["favorites", "nature", "ambience", "sleep", "chill", "relax"],
  },
  {
    name: "Wind",
    emoji: "💨",
    url: "https://utfs.io/f/VU8He2t54NdYhES01SIQ6Taob8Wf0SXDOuUA1VKkE9IHx4qd",
    volume: 1,
    attribution: [
      "wind.ogg by sleepCircle -- https://freesound.org/s/22331/ -- License: Creative Commons 0",
    ],
    image: "https://utfs.io/f/VU8He2t54NdYvQshHTaHAWjPnCZrtxmV56SkaM3oO0qw4huf",
    index: 4,
    categories: ["nature", "ambience"],
  },
  {
    name: "Fire",
    emoji: "🔥",
    url: "https://utfs.io/f/VU8He2t54NdYGNe8h39BnItq9LXQlVPu4jNzU1xdaYCM0pF8",
    volume: 1,
    attribution: [
      "Bonfire by forfie -- https://freesound.org/s/364992/ -- License: Creative Commons 0",
    ],
    image: "https://utfs.io/f/VU8He2t54NdYpRQh5Mcm76CiVAS4EwQty3arMPfHR1bxgdkZ",
    index: 5,
    categories: ["natural", "ambience"],
  },
  {
    name: "Desert",
    emoji: "🌵",
    url: "https://utfs.io/f/VU8He2t54NdYHpvbBvYhmu5O2LJfYdtvzgw0s3nbQXlkZDFS",
    volume: 1,
    attribution: [
      "Desert Simple.wav by Proxima4 -- https://freesound.org/s/104320/ -- License: Creative Commons 0",
    ],
    image: "https://utfs.io/f/VU8He2t54NdYOYYMxdZ45tUV7W1K4ESdzvZfN8Pr2yCwGuTi",
    index: 6,
    categories: ["chill", "natural", "ambience"],
  },
  {
    name: "Arctic",
    emoji: "❄️",
    url: "https://utfs.io/f/VU8He2t54NdY6fCCfMVNjR9Nmtg7h50VGWKc8AQoryMUblvI",
    volume: 0.6,
    image: "https://utfs.io/f/VU8He2t54NdYxIBXaQ0DONIyCht8a6ZwdKgqEQSTLR51sMYB",
    attribution: [
      "Wind__Artic__Cold.wav by cobratronik -- https://freesound.org/s/117136/ -- License: Creative Commons 0",
    ],
    index: 7,
    categories: ["sleep", "chill", "ambience"],
  },
  {
    name: "Kettle",
    emoji: "☕️",
    url: "https://utfs.io/f/VU8He2t54NdY59NfzQ6fcCLQl6pk53zFgINtnv9PqHDjbRJy",
    volume: 1,
    image: "https://utfs.io/f/VU8He2t54NdYH7NV0ddYhmu5O2LJfYdtvzgw0s3nbQXlkZDF",
    attribution: [
      "water boil.wav by fryzu82 -- https://freesound.org/s/142333/ -- License: Creative Commons 0",
    ],
    index: 8,
    categories: ["chill", "appliance", "relax"],
  },
  {
    name: "Crickets",
    emoji: "🦗",
    url: "https://utfs.io/f/VU8He2t54NdYOGnYUk45tUV7W1K4ESdzvZfN8Pr2yCwGuTiB",
    volume: 0.2,
    image: "https://utfs.io/f/VU8He2t54NdYDAOUVo88fqOGlaboRgjxshLUcB5MT4ZS2iE1",
    attribution: [
      "crickets by FreethinkerAnon -- https://freesound.org/s/129678/ -- License: Creative Commons 0",
    ],
    index: 9,
    categories: ["natural", "nature"],
  },
  {
    name: "Underwater",
    emoji: "🐠",
    url: "https://utfs.io/f/VU8He2t54NdYrTIK1A7PtLG5Y82xDew0Ncpqo6IhCjBQRZOn",
    volume: 0.6,
    image: "https://utfs.io/f/VU8He2t54NdYI934tMkGS15s7ymktfMgw0zeF4dO2HlKZXbu",
    attribution: [
      "Underwater Ambience by Fission9 -- https://freesound.org/s/504641/ -- License: Creative Commons 0",
    ],
    index: 10,
    categories: ["sleep", "chill", "ambience", "relax"],
  },
  {
    name: "Groovy lofi",
    emoji: "🎸",
    url: "https://utfs.io/f/VU8He2t54NdYS6D4RpoJxr7Vi3jB5SWTGgQAwCZXEMptHhvn",
    volume: 1,
    image: "https://utfs.io/f/VU8He2t54NdYOyCeyq45tUV7W1K4ESdzvZfN8Pr2yCwGuTiB",
    attribution: [
      "lofi.wav by Seth_Makes_Sounds -- https://freesound.org/s/587897/ -- License: Creative Commons 0",
    ],
    index: 11,
    categories: ["focus"],
  },
  {
    name: "Upbeat lofi",
    emoji: "〰︎",
    url: "https://utfs.io/f/VU8He2t54NdYWxde6fRPgldB5noR0bZyKHC7642sSQYmDu9p",
    volume: 1,
    image: "https://utfs.io/f/VU8He2t54NdY0hdPQXceJ6f3Z4TpvBeOdMNrhcGIj8VYSotn",
    attribution: [
      "Lofi Guitar Beat 70bpm by Seth_Makes_Sounds -- https://freesound.org/s/659278/ -- License: Creative Commons 0",
    ],
    index: 12,
    categories: ["focus", "chill", "relax"],
  },
  {
    name: "Chill lofi",
    emoji: "🌌",
    url: "https://utfs.io/f/VU8He2t54NdYFwWRLZn976miCUOgPKZV5akqTMfu2ondGzWH",
    volume: 1,
    image: "https://utfs.io/f/VU8He2t54NdYrTIK1A7PtLG5Y82xDew0Ncpqo6IhCjBQRZOn",
    attribution: [
      "Lofi Chill by Seth_Makes_Sounds -- https://freesound.org/s/659278/ -- License: Creative Commons 0",
    ],
    index: 13,
    categories: ["focus", "chill", "relax"],
  },
];

export default soundscapes;
export type { Soundscape, Category };
