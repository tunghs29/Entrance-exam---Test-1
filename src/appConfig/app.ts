import express, { Application, NextFunction, Request, Response } from 'express';
import jwt from 'express-jwt'

import { ERROR_CODE } from '../constants';
import { RootRoutes } from '../root.routes';
import { morganMiddleware } from '../configs';
import {
    APIError,
    BaseController,
    BaseError,
    ErrorHandler,
    HttpStatusCode,
} from '../common';

export class App extends BaseController {
    private readonly app: Application;
    private readonly rootRoute: RootRoutes;
    
    constructor() {
        super();
        this.app = express();
        this.configureApp();
        this.getHealthCheck();
        
        this.rootRoute = new RootRoutes(this.app);
        this.getRoutes();
        
        this.catch404();
        this.catchError();
    }
    
    private configureApp() {
        this.app.set('trust proxy', true);
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(morganMiddleware);
        this.app.disable('x-powered-by');
    }
    
    private getHealthCheck() {
        this.app.get('/health-check', (req: Request, res: Response) => {
            res.send('ok');
        });
    }
    
    private getRoutes() {
        return this.rootRoute;
    }
    
    private catch404() {
        this.app.use((req: Request) => {
            throw new APIError(ERROR_CODE.E404, HttpStatusCode.NOT_FOUND, 'NOT_FOUND_ROUTE', true, req);
        });
    }
    
    private catchError() {
        this.app.use((error: BaseError, req: Request, res: Response, next: NextFunction) => {
            if (!ErrorHandler.isTrustedError(error)) {
                next(error);
            }
            ErrorHandler.handleError(error, res);
        });
    }
    
    get getApp() {
        return this.app;
    }
}
