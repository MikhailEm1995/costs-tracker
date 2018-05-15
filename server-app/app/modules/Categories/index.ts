import * as mysql from 'mysql';

import { host, username, password, tracksDatabase } from '../../constants/db';

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
            const income_categories = await this.getIncomeCategories(userID);
            const cost_categories = await this.getCostCategories(userID);

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

    private getIncomeCategories(userID: number): Promise<any> {
        const query = `SELECT id, name, color FROM ${this.db}.categories WHERE user_id=? AND type=2`;

        return new Promise((resolve, reject) => {
            this.connection.query(query, [userID], (err: Error, result: any) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    private getCostCategories(userID: number): Promise<any> {
        const query = `SELECT id, name, color FROM ${this.db}.categories WHERE user_id=? AND type=1`;

        return new Promise((resolve, reject) => {
            this.connection.query(query, [userID], (err: Error, result: any) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    public putNewCategory(user_id: number, category: string, color: string, type: number): Promise<any> {
        const query = `INSERT INTO ${this.db}.categories (user_id, type, name, color) VALUES (?, ?, ?, ?)`;

        return new Promise<any>((resolve, reject) => {
            this.connection.query(query, [user_id, type, category, color], (err: Error, result: any) => {
                if (err) reject(err);
                resolve(result.insertId);
            });
        });
    }

    public deleteCategory(id: number): Promise<any> {
        const query = `DELETE FROM ${this.db}.categories WHERE id=?`;

        return new Promise<any>((resolve, reject) => {
            this.connection.query(query, [id], (err: Error) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
}
