<script lang="ts" type="module">
    import { assets } from '$app/paths';
    const css = assets + '/style.css';
</script>

<svelte:head>
    <link rel="stylesheet" href={css} />
</svelte:head>

<div class="nav">
    <div class="nav-left" />
    <div class="nav-right">
        <a class="active" href="/"> Home </a>
        <a href="/news"> News </a>
        <a href="/contact"> Contact </a>
        <a href="/about"> About </a>
    </div>
</div>

<slot />
