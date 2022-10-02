import { Request } from "express";
import { BaseError, HttpStatusCode } from '.';

class FieldErrorException extends BaseError {
    constructor(code: string, message: string = 'FieldErrorException', req: Request) {
        const {method, url, query, params, body} = req
        super('FieldErrorException', HttpStatusCode.BAD_REQUEST, message, code, true, method, url, query, params, body);
    }
}

export default FieldErrorException;
