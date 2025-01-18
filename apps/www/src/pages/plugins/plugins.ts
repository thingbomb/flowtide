interface Plugin {
  title: string;
  description: string;
  url: string;
  author: {
    name: string;
    url: string;
  };
  shortDescription?: string;
}

const plugins: { [key: string]: Plugin } = {
  "blank-page": {
    title: "Blank Page",
    shortDescription: "It doesn't get more minimal than this.",
    author: {
      name: "George",
      url: "https://github.com/georg-stone",
    },
    description:
      "It doesn't get more minimal than this. If you need to go back to the default page, just uninstall the plugin.",
    url: "data:text/css;base64,Ym9keSB7CiAgb3BhY2l0eTogMDsKICBkaXNwbGF5OiBub25lOwp9Cg==",
  },
};

export default plugins;
