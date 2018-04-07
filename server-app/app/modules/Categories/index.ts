import * as mysql from 'mysql';
import * as moment from 'moment';

import { host, username, password, tracksDatabase } from '../../constants/db';

const { escape } = mysql;

export class Categories {
    private db: string;
    private connection: any;

    public connect(): Categories {
        this.db = tracksDatabase;
        this.connection = mysql.createConnection({ host, user: username, password, database: tracksDatabase });

        return this;
    }

    public killConnection(): Categories {
        this.connection.end();
        this.connection = null;

        return this;
    }

    public async getUserCategories(userID: number): Promise<any> {
        try {
            const income_categories = await this.getCategoriesFrom('income_categories', userID);
            const cost_categories = await this.getCategoriesFrom('cost_categories', userID);

            return {
                user_id: userID,
                income_categories: income_categories,
                cost_categories: cost_categories
            };
        } catch (err) {
            console.error(err);
            Promise.reject(err);
        }
    }

    private getCategoriesFrom(table: string, userID: number): Promise<any> {
        const query = `SELECT id, category, color FROM ${this.db}.${table} WHERE user_id=${escape(userID)}`;

        return new Promise((resolve, reject) => {
            this.connection.query(query, (err: Error, result: any) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    public async putIncomeCategoryTrack(trackID: number, userID: number, category: string, color: string): Promise<any> {
        try {
            const escapedUserID = escape(userID);
            const escapedCat = escape(category);
            const escapedColor = escape(color);

            const isCategoryExist: boolean = await this.isExistIn(
                'income_categories',
                `category=${escapedCat} AND user_id=${escapedUserID} AND color=${escapedColor}`
            );

            let categoryID: number;

            if (!isCategoryExist) {
                categoryID = await this.putNewCategoryToTable('income_categories', userID, category, color);
            } else {
                categoryID = await this.getRecordIdFrom(
                    'income_categories',
                    `user_id=${escapedUserID} AND category=${escapedCat} AND color=${escapedColor}`);
            }

            return new Promise((resolve, reject) => {
                this.connection.query(
                    `INSERT INTO ${this.db}.tracks_categories (track_id, type, category_id) VALUES (?, ?, ?)`,
                    [trackID, 1, categoryID],
                    (err: Error, result: any) => {
                        if (err) reject(err);
                        resolve(result);
                    }
                );
            });
        } catch(err) {
            return Promise.reject(err);
        }
    }

    public async putCostCategoryTrack(trackID: number, userID: number, category: string, color: string): Promise<any> {
        try {
            const escapedUserID = escape(userID);
            const escapedCat = escape(category);
            const escapedColor = escape(color);

            const isCategoryExist: boolean = await this.isExistIn(
                'cost_categories',
                `category=${escapedCat} AND user_id=${escapedUserID} AND color=${escapedColor}`
            );

            let categoryID: number;

            if (!isCategoryExist) {
                categoryID = await this.putNewCategoryToTable('cost_categories', userID, category, color);
            } else {
                categoryID = await this.getRecordIdFrom(
                    'cost_categories',
                    `user_id=${escapedUserID} AND category=${escapedCat} AND color=${escapedColor}`);
            }

            return new Promise((resolve, reject) => {
                this.connection.query(
                    `INSERT INTO ${this.db}.tracks_categories (track_id, type, category_id) VALUES (?, ?, ?)`,
                    [trackID, 0, categoryID],
                    (err: Error, result: any) => {
                        if (err) reject(err);
                        resolve(result);
                    }
                );
            });
        } catch(err) {
            return Promise.reject(err);
        }
    }

    private isExistIn(table: string, condition: string): Promise<any> {
        const query = `SELECT EXISTS (SELECT * FROM ${this.db}.${table} WHERE ${condition})`;

        return new Promise<any>((resolve, reject) => {
            this.connection.query(query, (err: Error, result: any) => {
                if (err) reject(err);
                if (result[0][query.slice(7)] === 0) resolve(false);
                resolve(true);
            });
        });
    }

    public putNewCategoryToTable(table: string, user_id: number, category: string, color: string): Promise<any> {
        const query = `INSERT INTO ${this.db}.${table} (user_id, category, color) VALUES (?, ?, ?)`;

        return new Promise<any>((resolve, reject) => {
            this.connection.query(query, [user_id, category, color], (err: Error, result: any) => {
                if (err) reject(err);
                resolve(result.insertId);
            });
        });
    }

    public deleteCategoryFromTable(table: string, id: number): Promise<any> {
        const query = `DELETE FROM ${this.db}.${table} WHERE id=?`;

        return new Promise<any>((resolve, reject) => {
            this.connection.query(query, [id], (err: Error, result: any) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    private getRecordIdFrom(table: string, condition: string): Promise<any> {
        const query = `SELECT id FROM ${this.db}.${table} WHERE ${condition}`;

        return new Promise<any>((resolve, reject) => {
            this.connection.query(query, (err: Error, result: any) => {
                if (err) reject(err);
                resolve(result[0].id);
            });
        });
    }
}
