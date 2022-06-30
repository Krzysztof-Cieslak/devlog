<script lang="ts" context="module">
    import Nav from '$lib/Nav.svelte';
</script>

<body>
    <Nav />
    <main class="container">
        <slot />
    </main>
</body>
