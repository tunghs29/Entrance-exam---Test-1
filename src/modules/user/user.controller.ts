import { NextFunction, Request, Response } from 'express'
import { expressjwt as jwt } from 'express-jwt'
import { BadRequestException, BaseController, HttpStatusCode } from "../../common";
import { UserService } from "./user.service";
import { USER_ERROR_CODE, USER_ERROR_MESSAGE } from "./user.message";
import { jwtSecret } from "../../appConfig";

export class UserController extends BaseController {
    private readonly userService: UserService
    
    constructor() {
        super();
        this.userService = new UserService()
    }
    
    private _getToken(req: Request): string {
        if (!req.headers || !req.headers.authorization) throw new BadRequestException(USER_ERROR_CODE.U_004, USER_ERROR_MESSAGE[USER_ERROR_CODE.U_004])
        const token = req.headers.authorization.split(" ")[1]
        if (!token) throw new BadRequestException(USER_ERROR_CODE.U_004, USER_ERROR_MESSAGE[USER_ERROR_CODE.U_004])
        return token
    }
    
    async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const {email} = req.body
            const checkEmailExisted = await this.userService.findByEmail(email);
            if (checkEmailExisted) {
                throw new BadRequestException(USER_ERROR_CODE.U_001, USER_ERROR_MESSAGE[USER_ERROR_CODE.U_001], HttpStatusCode.BAD_REQUEST)
            }
            const createAccount = await this.userService.createAccount({...req.body})
            if (!createAccount) {
                throw new BadRequestException(USER_ERROR_CODE.U_001, USER_ERROR_MESSAGE[USER_ERROR_CODE.U_001], HttpStatusCode.BAD_REQUEST)
            }
            return res.status(201).json(createAccount)
        } catch (e) {
            next(e)
        }
    }
    
    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, password} = req.body
            const checkEmailExisted = await this.userService.findByEmail(email);
            if (!checkEmailExisted) {
                throw new BadRequestException(USER_ERROR_CODE.U_003, USER_ERROR_MESSAGE[USER_ERROR_CODE.U_003], HttpStatusCode.BAD_REQUEST)
            }
            const hash = checkEmailExisted.password
            const isValidUser = await this.userService.comparePassword(password, hash)
            if (!isValidUser) {
                throw new BadRequestException(USER_ERROR_CODE.U_003, USER_ERROR_MESSAGE[USER_ERROR_CODE.U_003], HttpStatusCode.BAD_REQUEST)
            }
            
            const accessToken = this.userService.createAccessToken(email)
            const refreshToken = await this.userService.createRefreshToken(checkEmailExisted.id, email)
            const {password: removeProp, ...response} = checkEmailExisted
            return res.status(200).json({
                ...response,
                token: accessToken,
                refreshToken
            })
        } catch (e) {
            next(e)
        }
    }
    
    async signOut(req: Request, res: Response, next: NextFunction) {
        try {
            if (
                req.headers.authorization &&
                req.headers.authorization.split(" ")[0] === "Bearer"
            ) {
                const getToken = this._getToken(req)
                const email = await this.userService.validateToken(getToken)
                if (!email) {
                    throw new BadRequestException(USER_ERROR_CODE.U_004, USER_ERROR_MESSAGE[USER_ERROR_CODE.U_004])
                }
                const checkEmailExisted = await this.userService.findByEmail(email);
                if (!checkEmailExisted) {
                    throw new BadRequestException(USER_ERROR_CODE.U_004, USER_ERROR_MESSAGE[USER_ERROR_CODE.U_004])
                }
                
                const deleteRefreshToken = await this.userService.deleteRefreshToken(checkEmailExisted.id)
                if (!deleteRefreshToken) {
                    throw new BadRequestException(USER_ERROR_CODE.U_004, USER_ERROR_MESSAGE[USER_ERROR_CODE.U_004])
                }
                return res.status(204).json()
            }
            throw new BadRequestException(USER_ERROR_CODE.U_004, USER_ERROR_MESSAGE[USER_ERROR_CODE.U_004])
        } catch (e) {
            next(e)
        }
    }
    
    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            if (
                req.headers.authorization &&
                req.headers.authorization.split(" ")[0] === "Bearer"
            ) {
                const getToken = this._getToken(req)
                const checkRefreshTokenExisted = await this.userService.checkRefreshToken(getToken)
                if (!checkRefreshTokenExisted) {
                    throw new BadRequestException(USER_ERROR_CODE.U_004, USER_ERROR_MESSAGE[USER_ERROR_CODE.U_004])
                }
                
                const email = await this.userService.validateToken(getToken)
                if (!email) {
                    throw new BadRequestException(USER_ERROR_CODE.U_004, USER_ERROR_MESSAGE[USER_ERROR_CODE.U_004])
                }
                const checkEmailExisted = await this.userService.findByEmail(email);
                if (!checkEmailExisted) {
                    throw new BadRequestException(USER_ERROR_CODE.U_004, USER_ERROR_MESSAGE[USER_ERROR_CODE.U_004])
                }
                
                const accessToken = this.userService.createAccessToken(email)
                const refreshToken = await this.userService.updateRefreshToken(checkEmailExisted.id, email)
                return res.status(200).json({
                    token: accessToken,
                    refreshToken
                })
            }
            throw new BadRequestException(USER_ERROR_CODE.U_004, USER_ERROR_MESSAGE[USER_ERROR_CODE.U_004])
        } catch (e) {
            next(e)
        }
    }
}