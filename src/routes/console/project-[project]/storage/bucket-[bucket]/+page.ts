import { Query } from '@aw-labs/appwrite-console';
import { sdk } from '$lib/stores/sdk';
import { getLimit, getPage, getSearch, pageToOffset } from '$lib/helpers/load';
import { Dependencies, PAGE_LIMIT } from '$lib/constants';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, depends, url, route }) => {
    depends(Dependencies.FILES);
    const page = getPage(url);
    const search = getSearch(url);
    const limit = getLimit(url, route, PAGE_LIMIT);
    const offset = pageToOffset(page, limit);

    return {
        offset,
        limit,
        search,
        files: await sdk.forProject.storage.listFiles(
            params.bucket,
            [Query.limit(limit), Query.offset(offset), Query.orderDesc('$createdAt')],
            search
        )
    };
};
