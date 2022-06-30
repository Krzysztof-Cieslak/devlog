<script lang="ts" context="module">
    import Nav from '$lib/Nav.svelte';
</script>

<body>
    <Nav />
    <main class="container workArea">
        <slot />
    </main>
</body>

<style>
    .workArea {
        width: 80%;
        max-width: 90%;
    }
</style>
