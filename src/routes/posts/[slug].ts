import fs from 'fs/promises';
import { prod } from '$app/env';

export async function get({ params }) {
    const slug = params.slug;

    const page = prod
        ? await import(`../../content/${slug}.svx`)
        : await import(`../src/content/${slug}.svx`);
    const rawContent = await fs.readFile(`src/content/${slug}.svx`, 'utf8');
    return {
        body: {
            postInfo: page.metadata,
            rawContent: rawContent
        }
    };
}
