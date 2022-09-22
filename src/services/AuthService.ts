import { User } from "../models/User";
import { execute, getFirst } from "../utils/mysql.connector";
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

export const createUser = async(username: string, fullname: string, password: string): Promise<string | User | undefined> => {
    if(await isUsernameExists(username))
        return "username tidak tersedia";
    let salt = bcrypt.genSaltSync(10);
    let encryptedPassword = bcrypt.hashSync(password, salt);
    let data = [
        username,
        fullname,
        encryptedPassword,
    ]
    let query = `INSERT INTO users (username, fullname, password) VALUES (?, ?, ?);`;
     await execute<any>(query, data);
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

export const getUser = async (username: String) : Promise<User | undefined> => {
    let query = "Select * from users where username = ?";
    // let user: User
    return await getFirst<User>(query, [username]);
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
