import { Request } from 'express'
import { BaseError, HttpStatusCode } from '.';

class UnauthorizedException extends BaseError {
    constructor(code: string, message: string = 'UnauthorizedException', req: Request) {
        const {method, url, query, params, body} = req
        super('UnauthorizedException', HttpStatusCode.UNAUTHORIZED, message, code, true, method, url, query, params, body);
    }
}

export default UnauthorizedException;
