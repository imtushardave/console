<script context="module" lang="ts">
    export type Column = {
        id: string;
        title: string;
        show: boolean;
        width?: number;
    };
</script>

<script lang="ts">
    import { Button, InputChoice } from '$lib/elements/forms';
    import { DropList } from '.';
    import { page } from '$app/stores';
    import type { Writable } from 'svelte/store';
    import { preferences } from '$lib/stores/preferences';
    import { onMount } from 'svelte';
    import { View } from '$lib/helpers/load';

    export let columns: Writable<Column[]>;
    export let view: View;
    export let isCustomCollection = false;
    export let hideView = false;
    export let hideColumns = false;

    let showSelectColumns = false;

    onMount(async () => {
        if (isCustomCollection) {
            const prefs = preferences.getCustomCollectionColumns($page.params.collection);
            columns.set(
                $columns.map((column) => {
                    column.show = prefs?.includes(column.id) ?? true;
                    return column;
                })
            );
        } else {
            const prefs = preferences.get($page.route);

            columns.set(
                $columns.map((column) => {
                    column.show = prefs.columns?.includes(column.id) ?? true;
                    return column;
                })
            );
        }

        return columns.subscribe((ctx) => {
            const columns = ctx.filter((n) => n.show).map((n) => n.id);

            if (isCustomCollection) {
                preferences.setCustomCollectionColumns(columns);
            } else {
                preferences.setColumns(columns);
            }
        });
    });

    function getViewLink(view: View): string {
        const url = new URL($page.url);
        url.searchParams.set('view', view);
        return url.toString();
    }

    function updateViewPreferences(view: View) {
        preferences.setView(view);
    }

    $: selectedColumnsNumber = $columns.reduce((acc, column) => {
        if (column.show) {
            acc++;
        }
        return acc;
    }, 0);
</script>

{#if !hideColumns && view === View.Table}
    {#if $columns?.length}
        <DropList bind:show={showSelectColumns} scrollable={true}>
            <Button secondary on:click={() => (showSelectColumns = !showSelectColumns)}>
                <span
                    class="icon-view-boards u-opacity-50"
                    aria-hidden="true"
                    aria-label="columns" />
                <span class="text">Columns</span>
                <span class="inline-tag">{selectedColumnsNumber}</span>
            </Button>
            <svelte:fragment slot="list">
                {#each $columns as column}
                    <InputChoice
                        id={column.id}
                        label={column.title}
                        bind:value={column.show}
                        disabled={selectedColumnsNumber <= 1 && column.show} />
                {/each}
            </svelte:fragment>
        </DropList>
    {/if}
{/if}

{#if !hideView}
    <div class="toggle-button">
        <ul class="toggle-button-list">
            {#key $page.url}
                <li class="toggle-button-item">
                    <a
                        href={getViewLink(View.Table)}
                        on:click={() => updateViewPreferences(View.Table)}
                        class="toggle-button-element"
                        aria-label="List View"
                        type="button"
                        class:is-selected={view === View.Table}>
                        <span class="icon-view-list" aria-hidden="true" />
                    </a>
                </li>
                <li class="toggle-button-item">
                    <a
                        href={getViewLink(View.Grid)}
                        on:click={() => updateViewPreferences(View.Grid)}
                        class="toggle-button-element"
                        aria-label="Grid View"
                        type="button"
                        class:is-selected={view === View.Grid}>
                        <span class="icon-view-grid" aria-hidden="true" />
                    </a>
                </li>
            {/key}
        </ul>
    </div>
{/if}
