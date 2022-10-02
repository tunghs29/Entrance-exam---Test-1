import { Application, Router } from 'express';
import { BaseController } from '.';

export abstract class BaseRoutesConfig extends BaseController {
    private readonly app: Application;
    private readonly name: string;
    private readonly router: Router;
    
    protected constructor(app: Application, name: string, prefixUrl: string) {
        super();
        this.app = app;
        this.name = name;
        this.router = Router();
        this.app.use(prefixUrl, this.router);
    }
    
    get getAppRouter() {
        return this.router;
    }
    
    abstract configureRoutes(): Router;
}
