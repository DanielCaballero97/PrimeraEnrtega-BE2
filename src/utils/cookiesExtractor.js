import { request } from "express";

export const cookieExtractor = (req = request) => {
    let token = null;
    if(req && req.cookies){
        token = req.cookies.token;
    } 

    return token
}