<script lang="ts">
    import { Empty, Heading, Limit, Pagination, ViewSelector } from '$lib/components';
    import { Button } from '$lib/elements/forms';
    import { Container } from '$lib/layout';
    import { columns, showCreate } from './store';
    import Table from './table.svelte';
    import Grid from './grid.svelte';
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<Container>
    <div class="u-flex u-gap-12 common-section u-main-space-between">
        <Heading tag="h2" size="5">Collections</Heading>
        <div class="u-flex u-gap-16">
            <ViewSelector view={data.view} {columns} />

            <Button on:click={() => ($showCreate = true)} event="create_collection">
                <span class="icon-plus" aria-hidden="true" />
                <span class="text">Create collection</span>
            </Button>
        </div>
    </div>

    {#if data.collections.total}
        {#if data.view === 'grid'}
            <Grid {data} />
        {:else}
            <Table {data} />
        {/if}

        <div class="u-flex u-margin-block-start-32 u-main-space-between">
            <Limit limit={data.limit} sum={data.collections.total} name="Collections" />
            <Pagination limit={data.limit} offset={data.offset} sum={data.collections.total} />
        </div>
    {:else}
        <Empty
            single
            href="https://appwrite.io/docs/databases#collection"
            target="collection"
            on:click={() => ($showCreate = true)} />
    {/if}
</Container>
