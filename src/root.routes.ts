import express from 'express';
import { BaseController, BaseRoutesConfig } from './common';
import { AuthRoutes } from './routes'

export class RootRoutes extends BaseController {
    private readonly routes: Array<BaseRoutesConfig> = [];
    
    constructor(app: express.Application) {
        super();
        this.routes.push(new AuthRoutes(app));
    }
    
    get getRoutes(): BaseRoutesConfig[] {
        return this.routes;
    }
}
