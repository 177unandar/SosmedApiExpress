import { Feed } from "../models/Feed";
import { Pagination } from "../models/Pagination";
import { QueryBuilder } from "../utils/queryBuilder";


export const createNewFeed = async (username: string, image_url: string, caption: string) => {
    await new QueryBuilder("feeds").insert({
        username: username,
        image_url: image_url,
        caption: caption
    });
}

export const getFeedsPagination = async(page: number) =>  {
    return await new QueryBuilder("feeds").orderBy("created_at", "DESC").paginate<Feed>(page);
}
