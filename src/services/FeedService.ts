import { Feed } from "../models/Feed";
import { QueryBuilder } from "../utils/queryBuilder";


export const createNewFeed = async (username: string, image_url: string, caption: string) => {
    await new QueryBuilder("feeds").insert({
        username: username,
        image_url: image_url,
        caption: caption
    });
}

export const getFeedsPagination = async (page: number) => {
    return await new QueryBuilder("feeds")
        .select([
            'feeds.*',
            'users.fullname',
            '(SELECT COUNT(*) FROM feed_comments WHERE feed_comments.feed_id = feeds.id) AS total_comments'
        ])
        .join('users', 'users.username', 'feeds.username')
        .orderBy("feeds.created_at", "DESC")
        .paginate<Feed>(page);
}
