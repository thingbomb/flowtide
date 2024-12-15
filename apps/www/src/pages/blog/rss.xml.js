import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../../consts";
import showdown from "showdown";

let converter = new showdown.Converter();

export async function GET(context) {
  const posts = await getCollection("blog");
  return rss({
    title: `Blog - ${SITE_TITLE}`,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: await Promise.all(
      posts.map(async (post) => ({
        ...post.data,
        link: `/blog/${post.slug}/`,
        content: converter.makeHtml(post.body),
        pubDate: post.data.pubDate,
      }))
    ),
  });
}
