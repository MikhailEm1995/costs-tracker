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

    public async putIncomeCategoryTrack(trackID: number, categoryID: number): Promise<any> {
        try {
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

    public async putCostCategoryTrack(trackID: number, categoryID: number): Promise<any> {
        try {
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
}
