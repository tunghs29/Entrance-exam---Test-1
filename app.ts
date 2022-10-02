import * as dotenv from 'dotenv';
dotenv.config();

import { App } from './src/appConfig';

const port = process.env.PORT ? process.env.PORT : '';

const startServer = () => {
    try {
        const app = new App();
        app.getApp.listen(port, () => {
            console.log(`[HTTP] Server listening in port ${port}.`);
        });
    } catch {
        process.exit(1);
    }
};

startServer();
