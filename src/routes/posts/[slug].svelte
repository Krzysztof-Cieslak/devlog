<script lang="ts" context="module">
    export const prerender = true;

    export async function load({ params, fetch, url }) {
        const { pathname } = url;
        const { slug } = params;
        const res = await fetch(`${pathname}/__data.json`);
        const data = await res.json();
        const page = (await import(`../../content/${slug}.svx`)).default;
        return {
            props: {
                page,
                rawContent: data.rawContent
            }
        };
    }
</script>

<script lang="ts">
    import Switch from '$lib/Switch.svelte';
    export let page, rawContent;
    let showRaw = false;
</script>

<Switch bind:checked={showRaw} />
{#if showRaw}
    <pre>{rawContent}</pre>
{/if}
{#if !showRaw}
    <svelte:component this={page} />
{/if}
