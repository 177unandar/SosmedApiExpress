import { FeedComment } from "../models/FeedComment";
import { QueryBuilder } from "../utils/queryBuilder";


export const createNewComment = async (feed_id: string,username: string,comment: string ) => {
    await new QueryBuilder("feed_comments").insert({
        feed_id: feed_id,
        username: username,
        comment: comment
    });
}

export const getCommentsPagination = async(feed_id: string, page: number) =>  {
    return await new QueryBuilder("feed_comments")
        .select([
            'feed_comments.*', 
            'users.fullname', 
        ])
        .join('users', 'users.username', 'feed_comments.username')
        .where('feed_comments.feed_id', feed_id)
        .orderBy("feed_comments.created_at", "DESC")
        .paginate<FeedComment>(page);
}