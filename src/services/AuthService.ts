import { User } from "../models/User";
import { QueryBuilder } from "../utils/queryBuilder";
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

export const createUser = async(username: string, fullname: string, password: string): Promise<string | User | undefined> => {
    if(await isUsernameExists(username))
        return "username tidak tersedia";
    let salt = bcrypt.genSaltSync(10);
    let encryptedPassword = bcrypt.hashSync(password, salt);
    await new QueryBuilder("users").insert({
        username: username,
        fullname: fullname,
        password: encryptedPassword,
    });
     return await getUser(username);
}

export const loginUser = async(username: string, password: string): Promise<User | undefined> => {
    let user : User | undefined = await getUser(username);
    if(user!!) {
        if(bcrypt.compareSync(password, user.password)) {
            return user;
        }
    }
    return;
}

export const getUser = async (username: string) : Promise<User | undefined> => {
    return await new QueryBuilder("users").where('username', username).first<User>();
};

export const isUsernameExists = async(username: string) : Promise<boolean> => {
    let user: User|undefined = await getUser(username);
    return !!user;
}

export const generateToken = async (user: User) : Promise<string> => {
    return await jwt.sign({
        username: user.username,
    }, SECRET_KEY);
}

export const verifyToken = (token: string) : string | undefined => {
    try {
        let decoded = jwt.verify(token, SECRET_KEY);
        return decoded.username;
      } catch(err) {
        // err
      }
    return ;
};
