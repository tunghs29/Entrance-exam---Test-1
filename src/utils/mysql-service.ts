import { knex, Knex } from 'knex';
import { BaseController } from '../common';
import { logger } from "../configs";

export class MySQLService extends BaseController {
    private readonly initialize: any;
    private readonly client: string = 'mysql'
    private readonly host = process.env.DB_HOST ? process.env.DB_HOST : '178.128.109.9';
    private readonly port: number = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
    private readonly username = process.env.DB_USERNAME ? process.env.DB_USERNAME : '';
    private readonly password = process.env.DB_PSW ? process.env.DB_PSW : '';
    private readonly database = process.env.DB_NAME ? process.env.DB_NAME : '';
    
    constructor() {
        super();
        try {
            this.initialize = knex({
                version: '5.7.33',
                client: this.client,
                connection: {
                    host: this.host,
                    port: this.port,
                    user: this.username,
                    password: this.password,
                    database: this.database
                },
                pool: {min: 0, max: 7},
                log: {
                    warn(message) {
                        logger.warn(message)
                    },
                    error(message) {
                        logger.error(message)
                    },
                    debug(message) {
                        logger.debug(message)
                    },
                    deprecate(message) {
                        logger.fatal(message)
                    }
                },
                debug: true
            })
        } catch (e) {
            console.log(e)
        }
    }
    
    get getInitialize() {
        return this.initialize;
    }
    
    //
    // public schemaBuilder(): Knex.SchemaBuilder {
    //     return this.initialize.schemaBuilder()
    // }
    //
    public closeConnection(): void {
        this.initialize.destroy;
    }
}
