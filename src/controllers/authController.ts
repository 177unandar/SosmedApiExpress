import { Request, Response, NextFunction } from 'express';
import { BaseResponse } from '../models/BaseResponse';
import { User } from '../models/User';
import { createUser, generateToken, isUsernameExists, loginUser, verifyToken } from '../services/AuthService';

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

const checkUsername =  async (req: Request, res: Response, next: NextFunction) => {
    console.log("req", req.body)
    let username: string = req.body.username;
    return res.status(200).json(new BaseResponse(!(await isUsernameExists(username))));
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
            user: userResponse(user)
        }));

    }
    return res.status(401).json(new BaseResponse(null).setErrorMessage('Invalid username or password'));
};

const userResponse = (user: User) => {
    return {
        username: user.username,
        fullname: user.fullname,
        created_at: user.created_at,
    }
}

const verify =  async (req: Request, res: Response, next: NextFunction) => {
    let userId = await verifyToken(req.headers.authorization+"");
    if(userId!!)
        return res.status(200).json(new BaseResponse(userId));
    return res.status(401).json(new BaseResponse('Unauthorize').setErrorMessage('invalid session'));
}

export default {register, checkUsername, login, verify};
