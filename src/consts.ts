// This is your config file, place any global data here.
// You can import this data from anywhere in your site by using the `import` keyword.

type Config = {
  title: string;
  description: string;
  lang: string;
  profile: {
    author: string;
    description?: string;
  };
  settings: {
    paginationSize: number;
  };
};

type SocialLink = {
  icon: string;
  friendlyName: string; // for accessibility
  link: string;
};

export const siteConfig: Config = {
  title: "nickminor.bio",
  description: "An web experiment at the interface of biology and computing.",
  lang: "en",
  profile: {
    author: "Nicholas R. Minor",
    description: "your bio description",
  },
  settings: {
    paginationSize: 10,
  },
};

/**
  These are you social media links.
  It uses https://github.com/natemoo-re/astro-icon#readme
  You can find icons @ https://icones.js.org/
*/
export const SOCIAL_LINKS: Array<SocialLink> = [
  {
    icon: "mdi:github",
    friendlyName: "Github",
    link: "https://github.com/nrminor",
  },
  {
    icon: "mdi:linkedin",
    friendlyName: "LinkedIn",
    link: "#",
  },
  {
    icon: "mdi:email",
    friendlyName: "email",
    link: "mailto:",
  },
  {
    icon: "mdi:rss",
    friendlyName: "rss",
    link: "/rss.xml",
  },
];
