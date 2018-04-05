import * as mysql from 'mysql';
import * as moment from 'moment';

import { host, username, password, tracksDatabase } from '../../constants/db';

const { escape } = mysql;

export class TrackableData {
    user_id: number;
    number: number;
    date: string;
}

export class Tracks {
    private db: string;
    private connection: any;

    public connect(): Tracks {
        this.db = tracksDatabase;
        this.connection = mysql.createConnection({ host, user: username, password, database: tracksDatabase });

        return this;
    }

    public killConnection(): Tracks {
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
                income_categories: income_categories.map((elem: any) => elem.category),
                cost_categories: cost_categories.map((elem: any) => elem.category)
            };
        } catch (err) {
            console.error(err);
            Promise.reject(err);
        }
    }

    private getCategoriesFrom(table: string, userID: number): Promise<any> {
        const query = `SELECT category FROM ${this.db}.${table} WHERE user_id=${escape(userID)}`;

        return new Promise((resolve, reject) => {
            this.connection.query(query, (err: Error, result: any) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    public getMonthFromTable(id: string, table: string): Promise<any> {
        const now = moment();
        const monthStart = escape(now.startOf('month').format('YYYY-MM-DD'));
        const monthEnd = escape(now.endOf('month').format('YYYY-MM-DD'));
        const query = `SELECT number, \`date\` FROM ${this.db}.${table} WHERE user_id=${escape(id)} AND \`date\` BETWEEN ${monthStart} AND ${monthEnd}`;
        
        return new Promise<any>((resolve, reject) => {
            this.connection.query(query, (err: Error, result: JSON) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    public getYearFromTable(id: string, table: string): Promise<any> {
        const now = moment();
        const yearStart = escape(now.startOf('year').format('YYYY-MM-DD'));
        const yearEnd = escape(now.endOf('year').format('YYYY-MM-DD'));
        const query = `SELECT number, \`date\` FROM ${this.db}.${table} WHERE user_id=${escape(id)} AND \`date\` BETWEEN ${yearStart} AND ${yearEnd}`;

        return new Promise<any>((resolve, reject) => {
            this.connection.query(query, (err: Error, result: JSON) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    public putTrackToTable(table: string, data: TrackableData): Promise<any> {
        const { user_id, number, date } = data;
        const query = `INSERT INTO ${this.db}.${table} (user_id, number, \`date\`) VALUES (${escape(user_id)}, ${escape(number)}, ${escape(date)})`;

        return new Promise<any>((resolve, reject) => {
            this.connection.query(query, (err: Error, result: JSON) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    public async putIncomeCategoryTrack(trackID: number, userID: number, category: string): Promise<any> {
        try {
            const isCategoryExist: boolean = await this.isExistIn('income_categories', `category='${category}' AND user_id='${userID}'`);

            let categoryID: number;

            if (!isCategoryExist) {
                categoryID = await this.putNewCategoryToTable('income_categories', userID, category);
            } else {
                categoryID = await this.getRecordIdFrom('income_categories', `user_id='${userID}' AND category='${category}'`);
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

    public async putCostCategoryTrack(trackID: number, userID: number, category: string): Promise<any> {
        try {
            const isCategoryExist: boolean = await this.isExistIn('cost_categories', `category='${category}' AND user_id='${userID}'`);

            let categoryID: number;

            if (!isCategoryExist) {
                categoryID = await this.putNewCategoryToTable('cost_categories', userID, category);
            } else {
                categoryID = await this.getRecordIdFrom('cost_categories', `user_id='${userID}' AND category='${category}'`);
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

    private putNewCategoryToTable(table: string, user_id: number, category: string): Promise<any> {
        const query = `INSERT INTO ${this.db}.${table} (user_id, category) VALUES (?, ?)`;

        return new Promise<any>((resolve, reject) => {
            this.connection.query(query, [user_id, category], (err: Error, result: any) => {
                if (err) reject(err);
                resolve(result.insertId);
            })
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
