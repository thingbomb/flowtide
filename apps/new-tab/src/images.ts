interface Image {
  url: string;
  author: {
    name: string;
    url: string;
  };
  location?: string;
  directLink?: string;
}

const images: Image[] = [
  {
    url: "https://storage.flowtide.app/jonatan-pie-OPOg0fz5uIs-unsplash.jpg",
    author: {
      name: "Jonatan Pie",
      url: "https://unsplash.com/@r3dmax",
    },
    location: "Plitvice Lakes National Park, Plitvička Jezera, Croatia",
    directLink:
      "https://unsplash.com/photos/time-lapse-photography-of-flowing-multi-tier-waterfall-OPOg0fz5uIs",
  },
  {
    url: "https://storage.flowtide.app/frans-ruiter-b3ptpP5fmqQ-unsplash.jpg",
    author: {
      name: "Frans Ruiter",
      url: "https://unsplash.com/@frns",
    },
    directLink:
      "https://unsplash.com/photos/time-lapse-photography-of-waterfalls-b3ptpP5fmqQ",
    location: "Plitvice Lakes National Park, Plitvička Jezera, Croatia",
  },
  {
    url: "https://storage.flowtide.app/stephen-walker-onIXxjH56AA-unsplash.jpg",
    author: {
      name: "Stephen Walker",
      url: "https://unsplash.com/@stephenwalker",
    },
    directLink:
      "https://unsplash.com/photos/photo-of-waterfalls-rushing-into-the-sea-onIXxjH56AA",
    location: "Snoqualmie Falls, Snoqualmie, United States",
  },
  {
    url: "https://storage.flowtide.app/samuel-ferrara-npwjNTG_SQA-unsplash.jpg",
    author: {
      name: "Samuel Ferrara",
      url: "https://unsplash.com/@samferrara",
    },
    directLink:
      "https://unsplash.com/photos/waterfall-near-trees-at-daytime-timelapse-photo-npwjNTG_SQA",
  },
  {
    url: "https://storage.flowtide.app/willian-justen-de-vasconcellos-JuhxRDzAHok-unsplash.jpg",
    author: {
      name: "Willian Justen de Vasconcellos",
      url: "https://unsplash.com/@willianjusten",
    },
    directLink:
      "https://unsplash.com/photos/waterfalls-under-cloud-JuhxRDzAHok",
    location: "Skógafoss, Iceland",
  },
  {
    url: "https://storage.flowtide.app/khamkeo-LWjZTc3fA4c-unsplash.jpg",
    author: {
      name: "Khamkéo",
      url: "https://unsplash.com/@mahkeo",
    },
    location: "Skógafoss, Iceland",
    directLink:
      "https://unsplash.com/photos/waterfalls-on-rock-formation-under-cloudy-sky-during-daytime-LWjZTc3fA4c",
  },
  {
    url: "https://storage.flowtide.app/marie-rouilly-DA3_xqEqolc-unsplash.jpg",
    author: {
      name: "Marie Rouilly",
      url: "https://unsplash.com/@marie_rouilly",
    },
    location: "Reunion Island",
    directLink:
      "https://unsplash.com/photos/waterfalls-in-the-middle-of-the-forest-during-daytime-DA3_xqEqolc",
  },
  {
    url: "https://storage.flowtide.app/sebastian-unrau-sp-p7uuT0tw-unsplash.jpg",
    author: {
      name: "Sebastian Unrau",
      url: "https://unsplash.com/@sebastian_unrau",
    },
    location: "Bad Pyrmont, Deutschland",
    directLink:
      "https://unsplash.com/photos/trees-on-forest-with-sun-rays-sp-p7uuT0tw",
  },
  {
    url: "https://storage.flowtide.app/irina-iriser-2Y4dE8sdhlc-unsplash.jpg",
    author: {
      name: "Irina Iriser",
      url: "https://unsplash.com/@iriser",
    },
    directLink: "https://unsplash.com/photos/green-leafed-trees-2Y4dE8sdhlc",
  },
  {
    url: "https://storage.flowtide.app/juan-davila-P8PlK2nGwqA-unsplash.jpg",
    author: {
      name: "Juan Davila",
      url: "https://unsplash.com/@juanster",
    },
    directLink:
      "https://unsplash.com/photos/lake-under-blue-sky-during-daytime-P8PlK2nGwqA",
  },
  {
    url: "https://storage.flowtide.app/derek-thomson-TWoL-QCZubY-unsplash.jpg",
    author: {
      name: "Derek Thomson",
      url: "https://unsplash.com/@derekthomson",
    },
    directLink:
      "https://unsplash.com/photos/body-of-water-near-trees-and-mountain-cliff-during-daytime-TWoL-QCZubY",
    location: "McWay Falls, United States",
  },
  {
    url: "https://storage.flowtide.app/world-wanderer-lIM-S3NS1uk-unsplash.jpg",
    author: {
      name: "World Wanderer",
      url: "https://unsplash.com/@worldwanderer2024",
    },
    directLink:
      "https://unsplash.com/photos/a-beach-with-palm-trees-and-blue-water-lIM-S3NS1uk",
    location: "Maldives",
  },
  {
    url: "https://storage.flowtide.app/ryan-schroeder-Gg7uKdHFb_c-unsplash.jpg",
    author: {
      name: "Ryan Schroeder",
      url: "https://unsplash.com/@ryanschroeder",
    },
    directLink:
      "https://unsplash.com/photos/landscape-photography-mountain-range-with-snow-Gg7uKdHFb_c",
  },
  {
    url: "https://storage.flowtide.app/ex1213-iC90w8MCbAo-unsplash.jpg",
    author: {
      name: "kodex1213",
      url: "https://unsplash.com/@kodex1213",
    },
    directLink:
      "https://unsplash.com/photos/a-mountain-range-covered-in-snow-under-a-blue-sky-iC90w8MCbAo",
    location: "Engelberg, Switzerland",
  },
  {
    url: "https://storage.flowtide.app/pascal-debrunner-1WQ5RZuH9xo-unsplash.jpg",
    author: {
      name: "Pascal Debrunner",
      url: "https://unsplash.com/@debrupas",
    },
    directLink:
      "https://unsplash.com/photos/body-of-water-under-sunny-sky-1WQ5RZuH9xo",
    location: "Andenes, Norway",
  },
  {
    url: "https://storage.flowtide.app/kym-ellis-RPT3AjdXlZc-unsplash.jpg",
    author: {
      name: "Kym Ellis",
      url: "https://unsplash.com/@kymellis",
    },
    directLink:
      "https://unsplash.com/photos/landscape-photography-of-brown-mountain-across-water-RPT3AjdXlZc",
    location: "Ryten, Norway",
  },
  {
    url: "https://storage.flowtide.app/hendrik-cornelissen--qrcOR33ErA-unsplash.jpg",
    author: {
      name: "Hendrik Cornelissen",
      url: "https://unsplash.com/@the_bracketeer",
    },
    directLink:
      "https://unsplash.com/photos/time-lapse-photography-of-river--qrcOR33ErA",
    location: "Yoho National Park, Field, Canada",
  },
  {
    url: "https://storage.flowtide.app/jess-barnett-9O3_JJOT3As-unsplash.jpg",
    author: {
      name: "Jess Barnett",
      url: "https://unsplash.com/@jessbarnett_",
    },
    directLink:
      "https://unsplash.com/photos/green-pine-trees-beside-river-under-white-clouds-during-daytime-9O3_JJOT3As",
    location: "Yoho National Park, Field, BC, Canada",
  },
  {
    url: "https://storage.flowtide.app/peter-robbins-gQ5lVwz4RrY-unsplash.jpg",
    author: {
      name: "Peter Robbins",
      url: "https://unsplash.com/@prphotography262",
    },
    directLink:
      "https://unsplash.com/photos/a-road-with-a-mountain-in-the-background-gQ5lVwz4RrY",
    location: "Yoho National Park, Field, BC, Canada",
  },
  {
    url: "https://storage.flowtide.app/christian-joudrey-DuD5D3lWC3c-unsplash.jpg",
    author: {
      name: "Christian Joudrey",
      url: "https://unsplash.com/@cjoudrey",
    },
    directLink:
      "https://unsplash.com/photos/ocean-near-trees-and-rocks-DuD5D3lWC3c",
    location: "Kihei, United States",
  },
  {
    url: "https://storage.flowtide.app/ganapathy-kumar-7782WXBriyM-unsplash.jpg",
    author: {
      name: "Ganapathy Kumar",
      url: "https://unsplash.com/@gkumar2175",
    },
    directLink: "https://unsplash.com/photos/body-of-wate-r-7782WXBriyM",
    location: "Secret Cove Beach, Kihei, United States",
  },
  {
    url: "https://storage.flowtide.app/ales-krivec-okzxVsJNxXc-unsplash.jpg",
    author: {
      name: "Ales Krivec",
      url: "https://unsplash.com/@aleskrivec",
    },
    directLink:
      "https://unsplash.com/photos/brown-hut-surrounded-by-flowers-okzxVsJNxXc",
  },
  {
    url: "https://storage.flowtide.app/mohammad-alizade-uVfl6v3sjhc-unsplash.jpg",
    author: {
      name: "Mohammad Alizade",
      url: "https://unsplash.com/@mohamadaz",
    },
    directLink:
      "https://unsplash.com/photos/yellow-flower-field-near-green-mountain-under-white-clouds-during-daytime-uVfl6v3sjhc",
  },
  {
    url: "https://storage.flowtide.app/paul-summers-CqBjlUs6t50-unsplash.jpg",
    author: {
      name: "Paul Summers",
      url: "https://unsplash.com/@somonesummers",
    },
    directLink:
      "https://unsplash.com/photos/photo-of-tall-green-trees-within-mountain-range-CqBjlUs6t50",
    location: "Piute Lake, United States",
  },
  {
    url: "https://storage.flowtide.app/clarissa-bock-nqJwKcnfyqU-unsplash.jpg",
    author: {
      name: "Clarissa Bock",
      url: "https://unsplash.com/@clarissa_felicia",
    },
    directLink:
      "https://unsplash.com/photos/landscape-photo-of-river-between-mountains-nqJwKcnfyqU",
    location: "Lake Isabelle, United States",
  },
  {
    url: "https://storage.flowtide.app/derek-baumgartner-SRPi28IvPCM-unsplash.jpg",
    author: {
      name: "Derek Baumgartner",
      url: "https://unsplash.com/@dbaumgartner",
    },
    directLink:
      "https://unsplash.com/photos/trees-near-body-of-water-SRPi28IvPCM",
    location: "Lost Lake, United States",
  },
  {
    url: "https://storage.flowtide.app/a-c-63RnGWHVIXs-unsplash.jpg",
    author: {
      name: "A C",
      url: "https://unsplash.com/@achidu",
    },
    directLink:
      "https://unsplash.com/photos/white-and-blue-sea-waves-painting-63RnGWHVIXs",
    location: "Jenny Lake, United States",
  },
  {
    url: "https://storage.flowtide.app/cristina-thompson-wxKfyEzRjVs-unsplash.jpg",
    author: {
      name: "Cristina Thompson",
      url: "https://unsplash.com/@tinafaye12",
    },
    directLink:
      "https://unsplash.com/photos/a-body-of-water-surrounded-by-mountains-and-trees-wxKfyEzRjVs",
    location: "Jenny Lake, United States",
  },
  {
    url: "https://storage.flowtide.app/kyle-richards-qAWCH8w8jtc-unsplash.jpg",
    author: {
      name: "Kyle Richards",
      url: "https://unsplash.com/@kyleclaydotcom",
    },
    directLink:
      "https://unsplash.com/photos/a-view-of-a-snow-covered-mountain-through-some-trees-qAWCH8w8jtc",
    location: "Jenny Lake, United States",
  },
  {
    url: "https://storage.flowtide.app/bryn-gibson-qXUPDCo8-64-unsplash.jpg",
    author: {
      name: "Bryn Gibson",
      url: "https://unsplash.com/@nomadicnorthco",
    },
    directLink:
      "https://unsplash.com/photos/a-lake-with-trees-and-mountains-in-the-background-qXUPDCo8-64",
    location: "Grand Teton, Wyoming, USA",
  },
  {
    url: "https://storage.flowtide.app/aishwarya-gunde-U0i_By5IeG0-unsplash.jpg",
    author: {
      name: "Aishwarya Gunde",
      url: "https://unsplash.com/@aishwaryagunde",
    },
    directLink:
      "https://unsplash.com/photos/a-lake-surrounded-by-trees-and-mountains-U0i_By5IeG0",
    location: "Grand Teton National Park, Wyoming, USA",
  },
  {
    url: "https://storage.flowtide.app/ryan-hutton-Jztmx9yqjBw-unsplash.jpg",
    author: {
      name: "Ryan Hutton",
      url: "https://unsplash.com/@ryan_hutton_",
    },
    directLink:
      "https://unsplash.com/photos/worms-eye-view-of-trees-during-night-time-Jztmx9yqjBw",
  },
  {
    url: "https://storage.flowtide.app/benjamin-davies-Zm2n2O7Fph4-unsplash.jpg",
    author: {
      name: "Benjamin Davies",
      url: "https://unsplash.com/@bendavisual",
    },
    directLink:
      "https://unsplash.com/photos/landscape-photography-of-field-Zm2n2O7Fph4",
    location: "Wooburn Green, United Kingdom",
  },
  {
    url: "https://storage.flowtide.app/toan-chu-YKN_G9L9nMA-unsplash.jpg",
    author: {
      name: "Toan Chu",
      url: "https://unsplash.com/@toanchu",
    },
    directLink:
      "https://unsplash.com/photos/green-and-brown-mountains-under-white-clouds-and-blue-sky-during-daytime-YKN_G9L9nMA",
    location: "Mount Baker, Washington, USA",
  },
  {
    url: "https://storage.flowtide.app/thomas-ciszewski-VcpMPsf_Ex0-unsplash.jpg",
    author: {
      name: "Thomas Ciszewski",
      url: "https://unsplash.com/@coc6",
    },
    directLink:
      "https://unsplash.com/photos/aerial-photography-of-volcano-VcpMPsf_Ex0",
    location: "Mount Bromo, Indonesia",
  },
  {
    url: "https://storage.flowtide.app/marek-piwnicki-DgdJ_0us5SE-unsplash.jpg",
    author: {
      name: "Marek Piwnicki",
      url: "https://unsplash.com/@marekpiwnicki",
    },
    directLink:
      "https://unsplash.com/photos/snow-covered-mountain-under-blue-sky-during-daytime-DgdJ_0us5SE",
    location: "Lanzada, Prowincja Sondrio, Włochy",
  },
  {
    url: "https://storage.flowtide.app/christian-joudrey-mWRR1xj95hg-unsplash.jpg",
    author: {
      name: "Christian Joudrey",
      url: "https://unsplash.com/@cjoudrey",
    },
    directLink:
      "https://unsplash.com/photos/calm-body-of-water-surrounded-by-trees-near-cliff-mWRR1xj95hg",
    location: "Yosemite National Park, United States",
  },
  {
    url: "https://storage.flowtide.app/daniel-olah-5_eRcisHc2c-unsplash.jpg",
    author: {
      name: "Daniel Olah",
      url: "https://unsplash.com/@danesduet",
    },
    directLink:
      "https://unsplash.com/photos/photo-of-mountain-peak-5_eRcisHc2c",
    location: "Zion National Park, United States",
  },
  {
    url: "https://storage.flowtide.app/tevin-trinh-nNx3EVUcWMo-unsplash.jpg",
    author: {
      name: "Tevin Trinh",
      url: "https://unsplash.com/@tevintrinh",
    },
    directLink:
      "https://unsplash.com/photos/body-of-water-near-body-trees-and-mountain-nNx3EVUcWMo",
    location: "Glacier National Park, United States",
  },
  {
    url: "https://storage.flowtide.app/urban-vintage-oyrtK2hJqBY-unsplash.jpg",
    author: {
      name: "Urban Vintage",
      url: "https://unsplash.com/@urban_vintage",
    },
    directLink:
      "https://unsplash.com/photos/green-grass-field-near-sea-under-white-clouds-at-daytime-oyrtK2hJqBY",
  },
  {
    url: "https://storage.flowtide.app/kyle-cleveland-VDPFEyIrAn0-unsplash.jpg",
    author: {
      name: "Kyle Cleveland",
      url: "https://unsplash.com/@kyleclevelandphoto",
    },
    directLink:
      "https://unsplash.com/photos/green-plants-and-trees-near-water-falls-VDPFEyIrAn0",
  },
  {
    url: "https://storage.flowtide.app/tom-winckels-I7oLRdM9YIw-unsplash.jpg",
    author: {
      name: "Tom Winckels",
      url: "https://unsplash.com/@twinckels",
    },
    directLink: "https://unsplash.com/photos/green-trees-on-cliff-I7oLRdM9YIw",
    location: "Gulf of Thailand, Thailand",
  },
  {
    url: "https://storage.flowtide.app/fajruddin-mudzakkir-TG50QzQzZm0-unsplash.jpg",
    author: {
      name: "Fajruddin Mudzakkir",
      url: "https://unsplash.com/@fnhaven",
    },
    directLink:
      "https://unsplash.com/photos/green-and-brown-mountains-near-body-of-water-under-white-clouds-and-blue-sky-during-daytime-TG50QzQzZm0",
    location: "Padar Island",
  },
  {
    url: "https://storage.flowtide.app/kurt-cotoaga-CW6J55DqTWU-unsplash.jpg",
    author: {
      name: "Kurt Cotoaga",
      url: "https://unsplash.com/@kydroon",
    },
    directLink: "https://unsplash.com/photos/gray-and-green-island-CW6J55DqTWU",
  },
  {
    url: "https://storage.flowtide.app/jackie-dilorenzo-RyLsRzy9jIA-unsplash.jpg",
    author: {
      name: "Jackie Dilorenzo",
      url: "https://unsplash.com/@jcdilorenzo",
    },
    directLink:
      "https://unsplash.com/photos/green-and-white-leaf-plant-RyLsRzy9jIA",
  },
  {
    url: "https://storage.flowtide.app/johannes-plenio-RwHv7LgeC7s-unsplash.jpg",
    author: {
      name: "Johannes Plenio",
      url: "https://unsplash.com/@jplenio",
    },
    directLink:
      "https://unsplash.com/photos/yellow-lights-between-trees-hvrpOmuMrAI",
  },
  {
    url: "https://storage.flowtide.app/taylor-smith-it0Pkba02FM-unsplash.jpg",
    author: {
      name: "Taylor Smith",
      url: "https://unsplash.com/@taylor_smith",
    },
    directLink:
      "https://unsplash.com/photos/a-forest-filled-with-lots-of-trees-covered-in-fog-it0Pkba02FM",
    location: "Bald Rock Heritage Preserve",
  },
  {
    url: "https://storage.flowtide.app/aleksandr-eremin-QfHmrIUN9G0-unsplash.jpg",
    author: {
      name: "Aleksandr Eremin",
      url: "https://unsplash.com/@notevilbird",
    },
    directLink:
      "https://unsplash.com/photos/yellow-sunflowers-during-daytime-QfHmrIUN9G0",
    location: "Donetsk, Ukraine",
  },
  {
    url: "https://storage.flowtide.app/jon-flobrant-rB7-LCa_diU-unsplash.jpg",
    author: {
      name: "Jon Flobrant",
      url: "https://unsplash.com/@jonflobrant",
    },
    directLink:
      "https://unsplash.com/photos/body-of-water-between-trees-under-cloudy-sky-rB7-LCa_diU",
    location: "Gäddede, Sweden",
  },
  {
    url: "https://storage.flowtide.app/jeremy-bishop-iftBhUFfecE-unsplash.jpg",
    author: {
      name: "Jeremy Bishop",
      url: "https://unsplash.com/@jeremybishop",
    },
    directLink:
      "https://unsplash.com/photos/time-lapse-photography-of-ocean-waves-iftBhUFfecE",
    location: "Newport Beach, United States",
  },
  {
    url: "https://storage.flowtide.app/robert-zunikoff-ko7Tp_LyAt4-unsplash.jpg",
    author: {
      name: "Robert Zunikoff",
      url: "https://unsplash.com/@rzunikoff",
    },
    location: "Grand Marais, Michigan, United States",
    directLink:
      "https://unsplash.com/photos/macro-photography-of-water-and-stones-ko7Tp_LyAt4",
  },
  {
    url: "https://storage.flowtide.app/petr-vysohlid-9fqwGqGLUxc-unsplash.jpg",
    author: {
      name: "Petr Vyšohlíd",
      url: "https://unsplash.com/@pvysohlid",
    },
    directLink: "https://unsplash.com/photos/green-grass-field-9fqwGqGLUxc",
    location: "Port Waikato, Tuakau, Auckland, New Zealand",
  },
  {
    url: "https://storage.flowtide.app/tim-marshall-bh75y-7eYVo-unsplash.jpg",
    author: {
      name: "Tim Marshall",
      url: "https://unsplash.com/@timmarshall",
    },
    directLink:
      "https://unsplash.com/photos/black-rock-formation-on-sea-during-daytime-bh75y-7eYVo",
    location: "Kohimarama, Auckland, New Zealand",
  },
  {
    url: "https://storage.flowtide.app/spencer-watson-p0Yupww_SNM-unsplash.jpg",
    author: {
      name: "Spencer Watson",
      url: "https://unsplash.com/@thebrownspy",
    },
    directLink:
      "https://unsplash.com/photos/black-high-trees-under-white-and-black-sky-at-golden-hour-p0Yupww_SNM",
    location: "Princeton, Canada",
  },
  {
    url: "https://storage.flowtide.app/andy-sanchez-jDIuEh7aKqs-unsplash.jpg",
    author: {
      name: "Andy Sanchez",
      url: "https://unsplash.com/@andyasmarketing",
    },
    directLink:
      "https://unsplash.com/photos/a-tree-in-the-foreground-with-mountains-in-the-background-jDIuEh7aKqs",
    location: "Estes Park, CO, USA",
  },
  {
    url: "https://storage.flowtide.app/andy-sanchez-VyFu0Oc0pm0-unsplash.jpg",
    author: {
      name: "Andy Sanchez",
      url: "https://unsplash.com/@andyasmarketing",
    },
    directLink:
      "https://unsplash.com/photos/a-large-elk-standing-on-top-of-a-rocky-hillside-VyFu0Oc0pm0",
    location: "Bear Lake Trailhead",
  },
  {
    url: "https://storage.flowtide.app/andy-sanchez-POdt8Bfc7Ds-unsplash.jpg",
    author: {
      name: "Andy Sanchez",
      url: "https://unsplash.com/@andyasmarketing",
    },
    directLink: "https://unsplash.com/photos/POdt8Bfc7Ds",
    location: "Villanueva State Park",
  },
  {
    url: "https://storage.flowtide.app/andy-sanchez-mABWXpR_hpA-unsplash.jpg",
    author: {
      name: "Andy Sanchez",
      url: "https://unsplash.com/@andyasmarketing",
    },
    directLink: "https://unsplash.com/photos/mABWXpR_hpA",
  },
  {
    url: "https://storage.flowtide.app/thula-na-ddJ9PNYjric-unsplash.jpg",
    author: {
      name: "Thula Na",
      url: "https://unsplash.com/@thula25",
    },
    directLink:
      "https://unsplash.com/photos/full-moon-over-city-skyline-during-night-time-ddJ9PNYjric",
  },
  {
    url: "https://storage.flowtide.app/alin-andersen-f0SgAs27BYI-unsplash.jpg",
    author: {
      name: "Alin Andersen",
      url: "https://unsplash.com/@onixion",
    },
    directLink:
      "https://unsplash.com/photos/snow-covered-mountain-during-daytime-f0SgAs27BYI",
    location: "Saile, Austria",
  },
  {
    url: "https://storage.flowtide.app/colby-thomas-r6TLRDY4Ll0-unsplash.jpg",
    author: {
      name: "Colby Thomas",
      url: "https://unsplash.com/@jrnxf",
    },
    location: "Tibble Fork Reservoir, United States",
    directLink:
      "https://unsplash.com/photos/snow-covered-tree-near-body-of-water-r6TLRDY4Ll0",
  },
  {
    url: "https://storage.flowtide.app/artur-pokusin-9wociMvaquU-unsplash.jpg",
    author: {
      name: "Artur Pokusin",
      url: "https://unsplash.com/@arturpokusin",
    },
    directLink:
      "https://unsplash.com/photos/person-view-of-cliff-at-daytime-9wociMvaquU",
  },
  {
    url: "https://storage.flowtide.app/roman-kim-xQ60mA3lSRI-unsplash.jpg",
    author: {
      name: "Roman Kim",
      url: "https://unsplash.com/@eastern",
    },
    location: "Vladimir, Russia",
    directLink:
      "https://unsplash.com/photos/rocky-mountain-on-seashore-during-daytime-xQ60mA3lSRI",
  },
  {
    url: "https://storage.flowtide.app/krzysztof-kowalik-PkXThkFaGzo-unsplash.jpg",
    author: {
      name: "Krzysztof Kowalik",
      url: "https://unsplash.com/@kowalikus",
    },
    directLink:
      "https://unsplash.com/photos/landscape-photography-of-avalanche-PkXThkFaGzo",
    location: "Chamonix, France",
  },
  {
    url: "https://storage.flowtide.app/jean-woloszczyk-GEwFw1tU47w-unsplash.jpg",
    author: {
      name: "Jean Woloszczyk",
      url: "https://unsplash.com/@jeanwolo",
    },
    directLink:
      "https://unsplash.com/photos/snow-covered-mountain-under-blue-sky-during-daytime-GEwFw1tU47w",
    location: "Argentière, Chamonix-Mont-Blanc, France",
  },
  {
    url: "https://storage.flowtide.app/johannes-plenio-hvrpOmuMrAI-unsplash.jpg",
    author: {
      name: "Johannes Plenio",
      url: "https://unsplash.com/@jplenio",
    },
    directLink:
      "https://unsplash.com/photos/yellow-lights-between-trees-hvrpOmuMrAI",
  },
  {
    url: "https://storage.flowtide.app/ivars-utinans-vkQgb1lZZPQ-unsplash.jpg",
    author: {
      name: "Ivars Utināns",
      url: "https://unsplash.com/@ivoprod",
    },
    directLink:
      "https://unsplash.com/photos/aerial-view-of-green-trees-and-river-during-daytime-vkQgb1lZZPQ",
  },
  {
    url: "https://storage.flowtide.app/edan-cohen-IyjhDTTQitM-unsplash.jpg",
    author: {
      name: "Edan Cohen",
      url: "https://unsplash.com/@edan",
    },
    directLink:
      "https://unsplash.com/photos/mountains-covered-by-trees-at-under-gray-sky-during-daytime-IyjhDTTQitM",
  },
  {
    url: "https://storage.flowtide.app/daniel-ribar-50B9vMs8cr0-unsplash.jpg",
    author: {
      name: "Daniel Ribar",
      url: "https://unsplash.com/@bigdanribar",
    },
    directLink:
      "https://unsplash.com/photos/brown-mountain-under-blue-sky-50B9vMs8cr0",
    location: "Bear Mountain, United States",
  },
  {
    url: "https://storage.flowtide.app/josh-carter-v6bd9TEoAd8-unsplash.jpg",
    author: {
      name: "Josh Carter",
      url: "https://unsplash.com/@midwestiscool",
    },
    directLink:
      "https://unsplash.com/photos/landscape-photography-of-waterfalls-v6bd9TEoAd8",
    location: "Yosemite Valley, United States",
  },
  {
    url: "https://storage.flowtide.app/artak-petrosyan-5-ooQQ2LH10-unsplash.jpg",
    author: {
      name: "Artak Petrosyan",
      url: "https://unsplash.com/@artakpetrosyan",
    },
    directLink:
      "https://unsplash.com/photos/rock-formation-under-gray-sky-5-ooQQ2LH10",
    location: "Yosemite Valley, United States",
  },
  {
    url: "https://storage.flowtide.app/danny-froese-JXkCLZhhRJg-unsplash.jpg",
    author: {
      name: "Danny Froese",
      url: "https://unsplash.com/@dannyfroese",
    },
    directLink:
      "https://unsplash.com/photos/landscape-photography-of-mountain-JXkCLZhhRJg",
  },
  {
    url: "https://storage.flowtide.app/erik-ringsmuth-xd3y6RxXl_o-unsplash.jpg",
    author: {
      name: "Erik Ringsmuth",
      url: "https://unsplash.com/@erikringsmuth",
    },
    directLink:
      "https://unsplash.com/photos/lake-water-surrounded-by-mountains-xd3y6RxXl_o",
    location: "Pyramid Mountain, United States",
  },
  {
    url: "https://storage.flowtide.app/morgan-rovang-nKpoNQx2R5g-unsplash.jpg",
    author: {
      name: "Morgan Rovang",
      url: "https://unsplash.com/@morganrovang",
    },
    directLink:
      "https://unsplash.com/photos/waterfalls-in-brown-rocky-mountain-during-daytime-aQgIRIJQh_A",
    location: "Yellowstone National Park, United States",
  },
];

export default images;
