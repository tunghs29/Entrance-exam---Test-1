import { BaseError, HttpStatusCode } from '.';

class UnauthorizedException extends BaseError {
    constructor(code: string, message: string = 'UnauthorizedException') {
        super('UnauthorizedException', HttpStatusCode.UNAUTHORIZED, message, code, true);
    }
}

export default UnauthorizedException;
