import { BaseError, HttpStatusCode } from '.';

class FieldErrorException extends BaseError {
    constructor(code: string, message: string = 'FieldErrorException') {
        super('FieldErrorException', HttpStatusCode.BAD_REQUEST, message, code, true);
    }
}

export default FieldErrorException;
