import { QueryBuilder } from "../utils/queryBuilder";


export const createNewFeed = async (username: string, image_url: string, caption: string) => {
    await new QueryBuilder("feeds").insert({
        username: username,
        image_url: image_url,
        caption: caption
    });
}
