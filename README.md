# DevLog

Micro-blogging/note-sharing webpage build with Svelte.

## Why

This project has been created for three main reasons:

-   I wanted to create some space for
    micro-blogging/note-sharing - something more involved than writing a thread on [Twitter](https://twitter.com/k_cieslak), but
    without an expectation of creating a nicely redacted, "real" articles as in case of things I used
    to publish on the [blog](http://kcieslak.io)/[medium](https://medium.com/@k_cieslak)... for which I never have enough time.

-   I've always wanted to play with some of my ideas for improving the UX of the blogs focused on coding; I guess this is space as good as any other for experimenting with those ideas.

-   I wanted to play with a few technologies that I've never used before but which sounded interesting in theory:

            * [Svelte](https://svelte.dev/)
            * [SvelteKit](https://kit.svelte.dev/)
            * [MDX](https://mdxjs.com/)
            * [utterances](https://utteranc.es/)

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
