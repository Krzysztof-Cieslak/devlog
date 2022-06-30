import fs from 'fs/promises';
import { prod } from '$app/env';
import * as shiki from 'shiki';

export async function get({ params }) {
    const slug = params.slug;

    const page = prod
        ? await import(`../../content/${slug}.svx`)
        : await import(`../src/content/${slug}.svx`);
    const rawContent = await fs.readFile(`src/content/${slug}.svx`, 'utf8');
    const highlighter = await shiki.getHighlighter({ theme: 'github-light' });
    const highlightedContent = highlighter.codeToHtml(rawContent, { lang: 'mdx' });
    return {
        body: {
            postInfo: page.metadata,
            rawContent: rawContent,
            highlightedContent: highlightedContent
        }
    };
}
