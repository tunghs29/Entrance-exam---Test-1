import { expressjwt as jwt } from 'express-jwt'
import { Application, Router } from 'express';
import { BaseRoutesConfig } from '../common';
import { UserController } from '../modules';
import { jwtSecret } from "../appConfig";
import { validator, validateSignUp, validateSignIn } from "../middleware";

export class AuthRoutes extends BaseRoutesConfig {
    private readonly userController: UserController;
    
    constructor(app: Application) {
        super(app, 'user-routes', '/users');
        this.userController = new UserController();
        this.configureRoutes();
    }
    
    configureRoutes(): Router {
        this.getAppRouter.post('/sign-up', validator.validateBody(validateSignUp), this.userController.signUp);
    
        this.getAppRouter.post('/sign-in', validator.validateBody(validateSignIn), this.userController.signIn);
        
        this.getAppRouter.post('/sign-out', jwt({
            secret: jwtSecret,
            algorithms: ['HS256'],
        }), this.userController.signOut);
        
        this.getAppRouter.post('/refresh-token', jwt({
            secret: jwtSecret,
            algorithms: ['HS256'],
        }), this.userController.refreshToken);
        
        return this.getAppRouter;
    }
}
