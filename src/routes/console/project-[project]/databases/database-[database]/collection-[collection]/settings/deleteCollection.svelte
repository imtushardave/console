<script lang="ts">
    import { goto, invalidate } from '$app/navigation';
    import { base } from '$app/paths';
    import { page } from '$app/stores';
    import { Submit, trackEvent, trackError } from '$lib/actions/analytics';
    import { Modal } from '$lib/components';
    import { Dependencies } from '$lib/constants';
    import { Button } from '$lib/elements/forms';
    import { addNotification } from '$lib/stores/notifications';
    import { sdk } from '$lib/stores/sdk';
    import { collection } from '../store';

    export let showDelete = false;

    const databaseId = $page.params.database;

    const handleDelete = async () => {
        try {
            await sdk.forProject.databases.deleteCollection(databaseId, $collection.$id);
            showDelete = false;
            addNotification({
                type: 'success',
                message: `${$collection.name} has been deleted`
            });
            trackEvent(Submit.CollectionDelete);
            await goto(
                `${base}/console/project-${$page.params.project}/databases/database-${$page.params.database}`
            );
            invalidate(Dependencies.DATABASE);
        } catch (error) {
            addNotification({
                type: 'error',
                message: error.message
            });
            trackError(error, Submit.CollectionDelete);
        }
    };
</script>

<Modal warning={true} bind:show={showDelete} onSubmit={handleDelete}>
    <svelte:fragment slot="header">Delete Collection</svelte:fragment>

    <p data-private>
        Are you sure you want to delete <b>{$collection.name}</b>?
    </p>
    <svelte:fragment slot="footer">
        <Button text on:click={() => (showDelete = false)}>Cancel</Button>
        <Button secondary submit>Delete</Button>
    </svelte:fragment>
</Modal>
