import * as mysql from 'mysql';
import * as moment from 'moment';

import { host, username, password, tracksDatabase } from '../../constants/db';

export class Balances {
    private db: string;
    private connection: any;

    private now = moment();

    public connect(): Balances {
        this.db = tracksDatabase;
        this.connection = mysql.createConnection({ host, user: username, password, database: tracksDatabase });

        return this;
    }

    public killConnection(): Balances {
        this.connection.end();
        this.connection = null;

        return this;
    }

    public addToBalance(user_id: number, num: number): Promise<any> {
        const setVarQuery = `SET @balance := (SELECT balance FROM costs_tracker.balances WHERE user_id=? ORDER BY \`datetime\` DESC LIMIT 1);`;
        const insertQuery = `INSERT INTO costs_tracker.balances (user_id, \`datetime\`, balance) VALUES (?, ?, IF(@balance is null, ?, @balance+?))`;
        const date = moment().format('YYYY-MM-DD HH:MM:SS');

        return new Promise((resolve, reject) => {
            this.connection.query(setVarQuery + insertQuery, [user_id, user_id, date, num, num], (err: Error, result: any) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    public subtractFromBalance(user_id: number, num: number): Promise<any> {
        const setVarQuery = `SET @balance := (SELECT balance FROM costs_tracker.balances WHERE user_id=? ORDER BY \`datetime\` DESC LIMIT 1);`;
        const insertQuery = `INSERT INTO costs_tracker.balances (user_id, \`datetime\`, balance) VALUES (?, ?, IF(@balance is null, ?, @balance-?))`;
        const date = moment().format('YYYY-MM-DD HH:MM:SS');

        return new Promise((resolve, reject) => {
            this.connection.query(setVarQuery + insertQuery, [user_id, user_id, date, num, num], (err: Error, result: any) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    public getCurrentBalance(user_id: number): Promise<any> {
        const query = `SELECT (balance) FROM ${this.db}.balances WHERE user_id=? ORDER BY \`datetime\` DESC LIMIT 1`;

        return new Promise((resolve, reject) => {
            this.connection.query(query, [user_id], (err: Error, result: any) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    public getCurrentMonthBalances(user_id: number): Promise<any> {
        const query = `SELECT * FROM ${this.db}.balances WHERE user_id=? AND MONTH(\`datetime\`)=MONTH(?) GROUP BY DAY(\`datetime\`) ORDER BY id ASC`;

        return new Promise((resolve, reject) => {
            this.connection.query(query, [user_id, this.now.format('YYYY-MM-DD HH:MM:SS')], (err: Error, result: any) => {
                if (err) reject(err);
                resolve(result);
            })
        });
    }

    public getCurrentYearBalances(user_id: number): Promise<any> {
        const query = `SELECT SUM(balance), \`datetime\` FROM ${this.db}.balances WHERE user_id=? AND YEAR(\`datetime\`)=YEAR(?) GROUP BY MONTH(\`datetime\`) ORDER BY \`datetime\` ASC`;

        return new Promise((resolve, reject) => {
            this.connection.query(query, [user_id, this.now.format('YYYY-MM-DD HH:MM:SS')], (err: Error, result: any) => {
                if (err) reject(err);
                resolve(result);
            })
        });
    }

    public getPreviousMonthBalances(user_id: number): Promise<any> {
        const previousMonth = moment().set('month', this.now.get('month') - 1).format('YYYY-MM-DD HH:MM:SS');
        const query = `SELECT * FROM ${this.db}.balances WHERE user_id=? AND MONTH(\`datetime\`)=MONTH(?) GROUP BY DAY(\`datetime\`) ORDER BY \`datetime\` ASC`;

        return new Promise((resolve, reject) => {
            this.connection.query(query, [user_id, previousMonth], (err: Error, result: any) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    public getPreviousYearBalances(user_id: number): Promise<any> {
        const previousYear = moment().set('year', this.now.get('year') - 1).format('YYYY-MM-DD HH:MM:SS');
        const query = `SELECT SUM(balance), \`datetime\` FROM ${this.db}.balances WHERE user_id=? AND YEAR(\`datetime\`)=YEAR(?) GROUP BY MONTH(\`datetime\`) ORDER BY \`datetime\` ASC`;

        return new Promise((resolve, reject) => {
            this.connection.query(query, [user_id, previousYear], (err: Error, result: any) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    public getBalances(user_id: number, limit?: number): Promise<any> {
        let query = `SELECT SUM(balance), \`datetime\` FROM ${this.db}.balances WHERE user_id=? GROUP BY MONTH(\`datetime\`) ORDER BY \`datetime\` ASC`;
        const vars = [user_id];

        if (limit) {
            query += ' LIMIT ?';
            vars.push(limit);
        }

        return new Promise((resolve, reject) => {
            this.connection.query(query, vars, (err: Error, result: any) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}
