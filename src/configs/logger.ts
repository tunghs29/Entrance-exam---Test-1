import winston from 'winston';
import { BaseController } from '../common';
class Logger extends BaseController {
    private readonly logger: winston.Logger
    private readonly environment: string = process.env.NODE_ENV || 'development';
    private readonly levels: winston.config.AbstractConfigSetLevels = {
        trace: 5,
        debug: 4,
        info: 3,
        warn: 2,
        error: 1,
        fatal: 0
    };
    private readonly colors: winston.config.AbstractConfigSetColors = {
        trace: 'white',
        debug: 'green',
        info: 'green',
        warn: 'yellow',
        error: 'red',
        fatal: 'red'
    };
    private readonly formatter: winston.Logform.Format = winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.splat(),
        winston.format.printf(info => {
            const { timestamp, level, message, ...meta } = info;
            return `${timestamp} [${level}]: ${message} ${
                Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
            }`;
        })
    );

    constructor() {
        super();
        const transport = new winston.transports.Console({
            format: this.formatter
        });
        this.logger = winston.createLogger({
            level: this.environment ? 'trace' : 'error',
            levels: this.levels,
            transports: transport
        });
        winston.addColors(this.colors);
    }

    public trace(msg: string, meta?: any[]): void {
        this.logger.log('trace', msg, meta);
    }

    public debug(msg: string, meta?: any[]): void {
        this.logger.debug(msg, meta);
    }

    public info(msg: string, meta?: any[]): void {
        this.logger.info(msg, meta);
    }

    public warn(msg: string, meta?: any[]): void {
        this.logger.warn(msg, meta);
    }

    public error(msg: string, meta?: any[]): void {
        this.logger.error(msg, meta);
    }

    public fatal(msg: string, meta?: any[]): void {
        this.logger.log('fatal', msg, meta);
    }
}

export const logger = new Logger();
