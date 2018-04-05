import * as express from 'express';
import { routes, commonMiddlewares } from './routes';

declare function require(moduleName: string): any;

export default () => {
    const router: any = express.Router();

    commonMiddlewares.forEach((middleware: any) => router.use(middleware));

    Object.keys(routes).forEach((method: string) => {
        Object.keys(routes[method]).forEach((query: string) => {
            if (!router[method]) return;

            const route = routes[method][query];

            if (route.handler && route.middlewares) {
                if (route.handler && route.middlewares instanceof Array) {
                    router[method](query, route.middlewares, require(route.handler).default);
                }
            } else if (route.handler) {
                router[method](query, require(route.handler).default)
            } else {
                router[method](query, require(route).default);
            }
        });
    });

    return router;
};
