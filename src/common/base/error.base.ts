import cloneDeep from 'lodash/cloneDeep'

export enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500
}

export abstract class BaseError extends Error {
    public readonly name: string;
    public readonly httpCode: HttpStatusCode;
    public readonly isOperational: boolean;
    public readonly code: string;
    public readonly method: string | undefined;
    public readonly url: string | undefined;
    public readonly query: object | undefined
    public readonly params: object | undefined
    public readonly body: object | undefined
    
    protected constructor(
        name: string,
        httpCode: HttpStatusCode,
        description: string,
        code: string,
        isOperational: boolean,
        method?: string,
        url?: string,
        query?: object,
        params?: object,
        body?: object
    ) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);
        
        this.name = name;
        this.httpCode = httpCode;
        this.isOperational = isOperational;
        this.code = code;
        this.url = url;
        this.method = method;
        this.query = cloneDeep(query || {});
        this.params = cloneDeep(params || {});
        this.body = cloneDeep(body || {});
        
        Error.captureStackTrace(this, this.constructor);
    }
}
