import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';

export const commonMiddlewares: any = [
    express.static(path.resolve('../../', 'public')),
    cors({
        "origin": "*",
        "methods": "GET,DELETE,PUT",
        "credentials": true,
        "preflightContinue": false,
        "optionsSuccessStatus": 204
    })
];

export const routes: any = {
    get: {
        "/api/tracks/month": path.resolve(__dirname, './handlers/getMonthTracks'),
        "/api/tracks/year": path.resolve(__dirname, './handlers/getYearTracks'),
        "/api/categories": path.resolve(__dirname, './handlers/getUserCategories')
    },
    put: {
        "/api/track/income": {
            handler: path.resolve(__dirname, './handlers/putIncomeTrack'),
            middlewares: [express.json()]
        },
        "/api/track/cost": {
            handler: path.resolve(__dirname, './handlers/putCostTrack'),
            middlewares: [express.json()]
        },
        "/api/category": {
            handler: path.resolve(__dirname, './handlers/putNewCategory'),
            middlewares: [express.json()]
        }
    },
    "delete": {
        "/api/category": {
            handler: path.resolve(__dirname, './handlers/deleteCategory'),
            middlewares: [express.json()]
        }
    }
};
