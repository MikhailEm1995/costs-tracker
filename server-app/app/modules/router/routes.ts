import * as express from 'express';
import * as path from 'path';

import cors from './middlewares/cors-headers'

export const commonMiddlewares: any = [express.static(path.resolve('../../', 'public'))];
export const routes: any = {
    get: {
        "/api/tracks/month": path.resolve(__dirname, './handlers/getMonthTracks'),
        "/api/tracks/year": path.resolve(__dirname, './handlers/getYearTracks'),
        "/api/categories": {
            handler: path.resolve(__dirname, './handlers/getUserCategories'),
            middlewares: [cors]
        }
    },
    put: {
        "/api/track/income": {
            handler: path.resolve(__dirname, './handlers/putIncomeTrack'),
            middlewares: [express.json(), cors]
        },
        "/api/track/cost": {
            handler: path.resolve(__dirname, './handlers/putCostTrack'),
            middlewares: [express.json(), cors]
        },
        "/api/category": {
            handler: path.resolve(__dirname, './handlers/putNewCategory'),
            middlewares: [express.json(), cors]
        }
    },
    "delete": {
        "/api/category": {
            handler: path.resolve(__dirname, './handlers/deleteCategory'),
            middlewares: [express.json(), cors]
        }
    }
};
