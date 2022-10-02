import jwt from "jsonwebtoken";
import { BaseController } from "../../common";
import { ICreateUser, IRespCreateUser, IRespFindByEmail } from "./user.interface";
import { UserRepository } from "./user.repository";
import { jwtSecret } from "../../appConfig";
import bcrypt from "bcrypt";

export class UserService extends BaseController {
    private readonly userRepository: UserRepository
    
    constructor() {
        super();
        this.userRepository = new UserRepository()
    }
    
    public createAccessToken(email: string) {
        return jwt.sign({email}, jwtSecret, {
            algorithm: 'HS256',
            expiresIn: 60 * 60, // 1 hour
        })
    }
    
    public async createRefreshToken(userId: number, email: string): Promise<string | false> {
        const refreshToken = jwt.sign({email}, jwtSecret, {
            algorithm: 'HS256',
            expiresIn: 60 * 60 * 24 * 30, // 1 month
        })
        // @ts-ignore
        const {exp} = jwt.decode(refreshToken)
        if (!exp) return false
        const response = await this.userRepository.createRefreshToken(userId, refreshToken, new Date(exp).toString())
        return response !== 0 ? refreshToken : false
    }
    
    public async updateRefreshToken(userId: number, email: string): Promise<string | false> {
        const refreshToken = jwt.sign({email}, jwtSecret, {
            algorithm: 'HS256',
            expiresIn: 60 * 60 * 24 * 30, // 1 month
        })
        // @ts-ignore
        const {exp} = jwt.decode(refreshToken)
        if (!exp) return false
        const response = await this.userRepository.updateRefreshToken(userId, refreshToken, new Date(exp).toString())
        return response !== 0 ? refreshToken : false
    }
    
    public validateToken(token: string): string | false {
        const isValid = jwt.verify(token, jwtSecret, {algorithms: ['HS256']})
        if (typeof isValid === 'string') return false
        const {email} = isValid
        return email
    }
    
    public async checkRefreshToken(token: string): Promise<{ user_id: string } | false> {
        const response = await this.userRepository.findRefreshToken(token)
        return !response ? false : response
    }
    
    public async deleteRefreshToken(userId: number) {
        const isDeletedToken = await this.userRepository.removeRefreshToken(userId)
        console.log(isDeletedToken)
        return isDeletedToken
    }
    
    public async findByEmail(email: string): Promise<IRespFindByEmail | false> {
        const response = await this.userRepository.findByEmail(email)
        return !response ? false : response
    }
    
    public async createAccount(data: ICreateUser): Promise<IRespCreateUser | false> {
        const id = await this.userRepository.createUser(data)
        if (!id) return false
        const {firstName, lastName, email} = data
        return {id, firstName, lastName, email, displayName: `${firstName} ${lastName}`}
    }
    
    public async comparePassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash)
    }
}