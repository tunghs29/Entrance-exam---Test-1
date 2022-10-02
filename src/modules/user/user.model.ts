import { MySQLService } from "../../utils";

export class UserModel {
    private readonly mySQLService: MySQLService
    constructor() {
        this.mySQLService = new MySQLService();
    }
    
    get getUserModel() {
        return this.mySQLService.getInitialize.queryBuilder().table('users')
    }
}

export class RefreshTokenModel {
    private readonly mySQLService: MySQLService
    constructor() {
        this.mySQLService = new MySQLService();
    }
    
    get getRefreshTokenModel() {
        return this.mySQLService.getInitialize.queryBuilder().table('tokens')
    }
}