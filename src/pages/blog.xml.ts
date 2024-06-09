import rss, { type RSSFeedItem } from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '@config/config.json';
import { plainify } from '@lib/utils/textConverter';

export async function GET(context: any) {
  const blog = await getCollection('posts');
  const items: RSSFeedItem[] = await Promise.all(
    blog.map(async (post):Promise<RSSFeedItem> => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/${post.slug}/`,
      content: await Promise.resolve(plainify(post.body)),
    }))
  )

  return rss({
    title: site.title,
    description: site.description,
    stylesheet: false,
    site: context.site,
    items,
    customData: '<language>en-US</language>'
  });
}
