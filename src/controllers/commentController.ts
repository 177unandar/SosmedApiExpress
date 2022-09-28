import { Request, Response, NextFunction } from 'express';
import { BaseResponse } from '../models/BaseResponse';
import { verifyToken } from "../services/AuthService";
import { createNewComment, getCommentsPagination } from '../services/CommentService';


const createComment  =  async (req: Request, res: Response, next: NextFunction) => {
    let username: string | undefined = verifyToken(req.headers.authorization+"");
    if(username) {
        let feed_id: string = req.params.feed_id;
        if(feed_id!!) {
            await createNewComment(feed_id, username, req.body.comment);
            return res.status(200).json(new BaseResponse("create a new comment has been successful"));
        }
    }
    return res.status(401).json({
        message: 'Invalid session'
    });
};

const getComments  =  async (req: Request, res: Response, next: NextFunction) => {
    let feed_id: string = req.params.feed_id;
    if(feed_id!!) {
        let page = req.query.page!! ? parseInt(`${req.query.page}`) : 1;
        return res.status(200).json(new BaseResponse(await getCommentsPagination(feed_id, page)));
    }
    return res.status(404).json({
        message: 'not found'
    });}


export default {createComment, getComments};