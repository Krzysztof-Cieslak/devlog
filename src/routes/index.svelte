<script lang="ts">
    export let posts;
</script>

<ul>
    {#each posts as item}
        <li><a href={'posts/' + item.slug}>{item.title}</a></li>
    {/each}
</ul>
