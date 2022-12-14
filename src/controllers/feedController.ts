import { Request, Response, NextFunction } from 'express';
import { BaseResponse } from '../models/BaseResponse';
import { verifyToken } from "../services/AuthService";
import { cloudinaryUpload } from '../services/CloudinaryService';
import { createNewFeed, getFeedsPagination } from '../services/FeedService';
import { isSingleFile } from '../utils/fileUtils';


const createFeed = async (req: Request, res: Response, next: NextFunction) => {
    let username: string | undefined = await verifyToken(req.headers.authorization + "");
    if (username) {
        const files = req.files
        if (files!!) {
            const image = files.image;
            if (isSingleFile(image)) {
                let image_url = await cloudinaryUpload(image);
                if (image_url!!) {
                    await createNewFeed(username, image_url, req.body.caption);
                    return res.status(200).json(new BaseResponse("create a new feed has been successful"));
                }
            }
        }
        return res.status(400).json(new BaseResponse('').setErrorMessage('Create feed failed, please try again!'));
    } else
        return res.status(401).json(new BaseResponse('Unauthorize').setErrorMessage('invalid session'));
};

const getFeeds = async (req: Request, res: Response, next: NextFunction) => {
    console.log("req.query", req.query)
    let page = req.query.page!! ? parseInt(`${req.query.page}`) : 1;
    return res.status(200).json(new BaseResponse(await getFeedsPagination(page)));
}


export default { createFeed, getFeeds };