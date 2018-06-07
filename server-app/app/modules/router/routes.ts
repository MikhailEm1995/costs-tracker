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
        "/api/categories": path.resolve(__dirname, './handlers/getUserCategories'),
        "/api/balance": path.resolve(__dirname, './handlers/getCurrentBalance'),
        "/api/balances/month/current": path.resolve(__dirname, './handlers/getCurrentMonthBalances'),
        "/api/balances/year/current": path.resolve(__dirname, './handlers/getCurrentYearBalances'),
        "/api/balances/month/previous": path.resolve(__dirname, './handlers/getPreviousMonthBalances'),
        "/api/balances/year/previous": path.resolve(__dirname, './handlers/getPreviousYearBalances'),
        "/api/balances": path.resolve(__dirname, './handlers/getBalances')
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
        },
        "/api/balance/add": {
            handler: path.resolve(__dirname, './handlers/putIncreasedBalance'),
            middlewares: [express.json()]
        },
        "/api/balance/subtract": {
            handler: path.resolve(__dirname, './handlers/putDecreasedBalance'),
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
