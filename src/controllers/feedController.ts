import { Request, Response, NextFunction } from 'express';
import { BaseResponse } from '../models/BaseResponse';
import { verifyToken } from "../services/AuthService";
import { cloudinaryUpload } from '../services/CloudinaryService';
import { createNewFeed } from '../services/FeedService';
import { isSingleFile } from '../utils/fileUtils';


const createFeed  =  async (req: Request, res: Response, next: NextFunction) => {
    let username: string | undefined = verifyToken(req.headers.authorization+"");
    if(username) {
        const files = req.files
        if(files!!) {
            const image = files.image;
            if(isSingleFile(image)) {
                let image_url = await cloudinaryUpload(image);
                if(image_url!!) {
                    await createNewFeed(username, image_url, req.body.caption);
                    return res.status(200).json(new BaseResponse("ok"));
                }
            }
        }
    }
    return res.status(401).json({
        message: 'Invalid session'
    });
};


export default {createFeed};