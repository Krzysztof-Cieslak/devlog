import fs from 'fs/promises';

export async function get() {
    const allFiles = await fs.readdir('src/content');
    const posts = allFiles.filter((post) => post.endsWith('.svx'));
    const readPosts = await Promise.all(
        posts.map(async (post) => {
            const rawContent = await fs.readFile(`src/content/${post}`, 'utf8');
            const metadata = rawContent.split('---')[1];
            const lines = metadata.split('\n');
            const title = lines
                .find((line) => line.startsWith('title:'))
                ?.split(':')[1]
                ?.trim();
            return {
                slug: post.replace('.svx', ''),
                title: title
            };
        })
    );
    return {
        body: {
            posts: readPosts
        }
    };
}
