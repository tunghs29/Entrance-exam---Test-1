import { Request, Response, NextFunction, RequestHandler } from 'express';
import Ajv, { Schema, ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import addError from 'ajv-errors';

import { BaseController, FieldErrorException } from '../common';
import { ERROR_CODE } from '../constants';
import { logger } from "../configs";

class Validator extends BaseController {
    private readonly ajv: Ajv;
    
    constructor() {
        super();
        this.ajv = new Ajv({
            allErrors: true,
            coerceTypes: true,
            useDefaults: true,
            removeAdditional: true,
            code: {es5: true},
            $data: true,
        });
        addFormats(this.ajv);
        addError(this.ajv, {keepErrors: false});
    }
    
    private _formatResponse = (error: ErrorObject<string, Record<string, any>, unknown>): string | undefined => {
        return error.message;
    };
    
    private _validateData(schema: Schema, data: any, req: Request, next: NextFunction, errorCode: ERROR_CODE) {
        const validate = this.ajv.compile(schema);
        const isValid = validate(data);
        if (isValid) {
            next();
        } else {
            if (validate.errors) {
                console.error(validate.errors[0].params);
                throw new FieldErrorException(errorCode, this._formatResponse(validate.errors[0]), req);
            }
            throw new FieldErrorException(errorCode, 'Có lỗi xảy ra', req);
        }
    }
    
    public validateBody(schema: Schema): RequestHandler {
        return (req: Request, res: Response, next: NextFunction): void => {
            const data = req.body;
            this._validateData(schema, data, req, next, ERROR_CODE.E200);
        };
    }
    
    public validateParam(schema: Schema): RequestHandler {
        return (req: Request, res: Response, next: NextFunction): void => {
            const data = req.params;
            this._validateData(schema, data, req, next, ERROR_CODE.E201);
        };
    }
    
    public validateQuery(schema: Schema): RequestHandler {
        return (req: Request, res: Response, next: NextFunction): void => {
            const data = req.query;
            this._validateData(schema, data, req, next, ERROR_CODE.E202);
        };
    }
}

export const validator = new Validator();
