import { Request, Response, NextFunction } from 'express';
import { BaseResponse } from '../models/BaseResponse';
import { User } from '../models/User';
import { createUser, generateToken, loginUser, verifyToken } from '../services/AuthService';

const register =  async (req: Request, res: Response, next: NextFunction) => {
    console.log("req", req.body)
    let username: string = req.body.username;
    let fullname: string = req.body.fullname;
    let password: string = req.body.password;
    let response: string | User | undefined =  await createUser(username, fullname, password);
    if(typeof response == 'string')
        return res.status(422).json({
            message: response
        });
    if(!!response) {

        return res.status(200).json(new BaseResponse(await generateToken(response)));
    }
    return res.status(500).json({
        message: 'Internal server error'
    });

};

const login =  async (req: Request, res: Response, next: NextFunction) => {
    console.log("req", req.body)
    let username: string = req.body.username;
    let password: string = req.body.password;
    let user:  User | undefined =  await loginUser(username, password);
    if(!!user) {
        let token = await generateToken(user);
        return res.status(200).json(new BaseResponse({
            token: token,
            user: user
        }));
    }
    return res.status(401).json({
        message: 'Invalid username or password'
    });

};

const verify =  async (req: Request, res: Response, next: NextFunction) => {
    let userId = verifyToken(req.headers.authorization+"");
    if(userId!!)
        return res.status(200).json(new BaseResponse(userId));
    return res.status(401).json({
        message: 'Invalid token'
    });

}

export default {register, login, verify};