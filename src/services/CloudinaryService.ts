import { v2 as cloudinary } from 'cloudinary'
import { UploadedFile } from 'express-fileupload';
import { isSingleFile } from '../utils/fileUtils';
import { unlink } from 'node:fs/promises';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const basePath = __dirname.replace("src/services", "uploads");

export const cloudinaryUpload = async (file: UploadedFile): Promise<string | undefined> => {
    if (isSingleFile(file)) {
        let filePath = `${basePath}/${file.name}`;
        console.log("filePath", filePath);
        file.mv(filePath, err => {
            if (err) {
                console.log('Error while copying file to target location ' + filePath);
            }
        });
        let result = await uploadFile(filePath);
        unlink(filePath);
        return result;
    }
    return;
}

const uploadFile = async (filePath: string): Promise<string | undefined> => {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        console.log("result", result);
        return result.url;
    } catch (error) {
        console.error('error upload', error);
        return await uploadFile(filePath);
    }
}

