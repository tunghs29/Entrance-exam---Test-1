import bcrypt from 'bcrypt'
import { ICreateUser, IRespFindByEmail } from "./user.interface";
import { MySQLService } from '../../utils'
import { RefreshTokenModel, UserModel } from "./user.model";
import { BaseController } from "../../common";

export class UserRepository extends BaseController {
    private readonly saltRound: number = 10
    private readonly mySQLService: MySQLService
    private readonly userModel: UserModel
    private readonly refreshTokenModel: RefreshTokenModel
    
    constructor() {
        super()
        this.mySQLService = new MySQLService()
        this.userModel = new UserModel()
        this.refreshTokenModel = new RefreshTokenModel()
    }
    
    public async findByEmail(email: string): Promise<IRespFindByEmail | undefined> {
        try {
            const response = await this.userModel.getUserModel.select('id', 'email', 'first_name', 'last_name', 'password').where('email', email)
            return response[0]
        } catch (err) {
            console.error(err);
        } finally {
            this.mySQLService.closeConnection()
        }
    }
    
    public async createUser(createData: ICreateUser): Promise<number | undefined> {
        try {
            const {firstName, lastName, email, password} = createData
            const salt = await bcrypt.genSalt(this.saltRound)
            const hashPass = await bcrypt.hash(password, salt)
            const response = await this.userModel.getUserModel.insert({
                'first_name': firstName,
                'last_name': lastName,
                'email': email,
                'password': hashPass
            })
            return parseInt(response[0], 10)
        } catch (err) {
            console.error(err);
        } finally {
            this.mySQLService.closeConnection()
        }
    }
    
    public async createRefreshToken(userId: number, token: string, expiresIn: string) {
        try {
            const response = await this.refreshTokenModel.getRefreshTokenModel.insert({
                'user_id': userId,
                'refresh_token': token,
                'expires_in': expiresIn,
            })
            return response[0]
        } catch (err) {
            console.error(err);
        } finally {
            this.mySQLService.closeConnection()
        }
    }
    
    public async updateRefreshToken(userId: number, token: string, expiresIn: string) {
        try {
            const response = await this.refreshTokenModel.getRefreshTokenModel.update({
                'user_id': userId,
                'refresh_token': token,
                'expires_in': expiresIn,
            }).where({'user_id': userId})
            return parseInt(response[0], 10)
        } catch (err) {
            console.error(err);
        } finally {
            this.mySQLService.closeConnection()
        }
    }
    
    public async findRefreshToken(token: string): Promise<{ user_id: string } | undefined> {
        try {
            const response = await this.refreshTokenModel.getRefreshTokenModel.select('user_id').where({'refresh_token': token})
            return response[0]
        } catch (err) {
            console.error(err);
        } finally {
            this.mySQLService.closeConnection()
        }
    }
    
    public async removeRefreshToken(userId: number): Promise<boolean | undefined> {
        try {
            const response = await this.refreshTokenModel.getRefreshTokenModel.del().where({'user_id': userId})
            return response !== 0
        } catch (err) {
            console.error(err);
        } finally {
            this.mySQLService.closeConnection()
        }
    }
}