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
                rawContent: data.rawContent,
                highlightedContent: data.highlightedContent
            }
        };
    }
</script>

<script lang="ts">
    import Switch from '$lib/Switch.svelte';
    import '$lib/styles/codeblock.css';
    export let page, highlightedContent;
    let showRaw = false;
</script>

<article style="padding: 30px; margin-top: 0">
    <div style="float: right;">
        <Switch bind:checked={showRaw} />
    </div>
    {#if showRaw}
        <div style="margin-right: 30px; padding-right: 30px">
            {@html highlightedContent}
        </div>
    {/if}
    {#if !showRaw}
        <svelte:component this={page} />
    {/if}
</article>
