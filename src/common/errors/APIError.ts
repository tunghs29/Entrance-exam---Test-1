import { Request } from 'express'
import { BaseError, HttpStatusCode } from '.';

class APIError extends BaseError {
    constructor(
        code = 'E100',
        httpCode = HttpStatusCode.INTERNAL_SERVER,
        description = 'Internal Server Error',
        isOperational = true,
        req: Request
    ) {
        const {method, url, query, params, body} = req
        super('Internal Server Error', httpCode, description, code, isOperational, method, url, query, params, body);
    }
}

export default APIError;
