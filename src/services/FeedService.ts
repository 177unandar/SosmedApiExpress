import { query } from "express";
import { execute } from "../utils/mysql.connector";
import { cloudinaryUpload } from "./CloudinaryService"


export const createNewFeed = async (username: string, image_url: string, caption: string) => {
    // let image_url = await cloudinaryUpload(image_path);
    let query = `INSERT INTO feeds (username, image_url, caption) VALUES (?, ?, ?);`;
    await execute<any>(query, [
        username, image_url, caption
    ]);
}
