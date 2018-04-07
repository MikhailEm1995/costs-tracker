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
}
