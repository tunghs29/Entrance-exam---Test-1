import { Response } from 'express';
import { BaseError } from '.';
import { ERROR_CODE } from '../../constants';

export class ErrorHandler {
    public static handleError(err: BaseError, res: Response): Response<any, Record<string, any>> {
        console.error('ERROR_MESSAGE', err);
        return res.status(err.httpCode || 400).json({
            status: 'error',
            message: err.message ? err.message : 'Unknown error',
            code: err.code || ERROR_CODE.E111
        });
    }
    
    public static isTrustedError(error: Error): boolean {
        if (error instanceof BaseError) {
            return error.isOperational;
        }
        return false;
    }
}
