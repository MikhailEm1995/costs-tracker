import * as mysql from 'mysql';
import * as moment from 'moment';

import { host, username, password, tracksDatabase } from '../../constants/db';

export class Balances {
    private db: string;
    private connection: any;

    private now = moment();

    public connect(): Balances {
        this.db = tracksDatabase;
        this.connection = mysql.createConnection({ host, user: username, password, database: tracksDatabase, multipleStatements: true });

        return this;
    }

    public killConnection(): Balances {
        this.connection.end();
        this.connection = null;

        return this;
    }

    public addToBalance(user_id: number, num: number): Promise<any> {
        const setVarQuery = `SET @balance := (SELECT balance FROM ${this.db}.balances WHERE user_id=? AND MONTH(\`datetime\`)=MONTH(NOW()) ORDER BY \`datetime\` DESC LIMIT 1);`;
        const insertQuery = `INSERT INTO ${this.db}.balances (user_id, \`datetime\`, balance) VALUES (?, ?, (IF(@balance is null, ?, @balance+?)));`;
        const selectQuery = `SELECT * FROM ${this.db}.balances WHERE user_id=? AND MONTH(\`datetime\`)=MONTH(?) GROUP BY DAY(\`datetime\`) ORDER BY \`datetime\` ASC LIMIT 30`;
        const datetime = moment().format('YYYY-MM-DD HH:mm:ss');

        const query = setVarQuery + insertQuery + selectQuery;
        const vars = [user_id, user_id, datetime, num, num, user_id, datetime];

        return new Promise((resolve, reject) => {
            this.connection.query(query, vars, (err: Error, result: JSON) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    public subtractFromBalance(user_id: number, num: number): Promise<any> {
        const setVarQuery = `SET @balance := (SELECT balance FROM ${this.db}.balances WHERE user_id=? AND MONTH(\`datetime\`)=MONTH(NOW()) ORDER BY \`datetime\` DESC LIMIT 1);`;
        const insertQuery = `INSERT INTO ${this.db}.balances (user_id, \`datetime\`, balance) VALUES (?, ?, (IF(@balance is null, ?, @balance-?)));`;
        const selectQuery = `SELECT * FROM ${this.db}.balances WHERE user_id=? AND MONTH(\`datetime\`)=MONTH(?) GROUP BY DAY(\`datetime\`) ORDER BY \`datetime\` ASC LIMIT 30`;
        const datetime = moment().format('YYYY-MM-DD HH:mm:ss');

        const query = setVarQuery + insertQuery + selectQuery;
        const vars = [user_id, user_id, datetime, num, num, user_id, datetime];

        return new Promise((resolve, reject) => {
            this.connection.query(query, vars, (err: Error, result: JSON) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    public updateBalancesAdd(user_id: number, num: number, date: string): Promise<any> {
        const updateOneRowQuery = `UPDATE ${this.db}.balances SET balance=(balance+?) WHERE user_id=? AND DATE(\`datetime\`)<=DATE(?) ORDER BY id DESC LIMIT 1;`;
        const updateDependingRowsQuery = `UPDATE ${this.db}.balances SET balance=(balance+?) WHERE user_id=? AND DATE(\`datetime\`)>DATE(?);`;
        const selectQuery = `SELECT * FROM ${this.db}.balances WHERE user_id=? AND MONTH(\`datetime\`)=MONTH(?) GROUP BY DAY(\`datetime\`) ORDER BY \`datetime\` LIMIT 30`;
        const datetime = moment(date).format('YYYY-MM-DD HH:mm:ss');

        return new Promise((resolve, reject) => {
            this.connection.query(
                updateOneRowQuery + updateDependingRowsQuery + selectQuery,
                [num, user_id, datetime, num, user_id, datetime, user_id, datetime],
                (err: Error, result: JSON) => {
                    if (err) reject(err);
                    resolve(result);
                });
        });
    }

    public updateBalancesSubtract(user_id: number, num: number, date: string): Promise<any> {
        const updateOneRowQuery = `UPDATE ${this.db}.balances SET balance=(balance-?) WHERE user_id=? AND DATE(\`datetime\`)<=DATE(?) ORDER BY id DESC LIMIT 1;`;
        const updateDependingRowsQuery = `UPDATE ${this.db}.balances SET balance=(balance-?) WHERE user_id=? AND DATE(\`datetime\`)>DATE(?);`;
        const selectQuery = `SELECT * FROM ${this.db}.balances WHERE user_id=? AND MONTH(\`datetime\`)=MONTH(?) GROUP BY DAY(\`datetime\`) ORDER BY \`datetime\` LIMIT 30`;
        const datetime = moment(date).format('YYYY-MM-DD HH:mm:ss');

        return new Promise((resolve, reject) => {
            this.connection.query(
                updateOneRowQuery + updateDependingRowsQuery + selectQuery,
                [num, user_id, datetime, num, user_id, datetime, user_id, datetime],
                (err: Error, result: JSON) => {
                    if (err) reject(err);
                    resolve(result);
                });
        });
    }

    public getCurrentBalance(user_id: number): Promise<any> {
        const query = `SELECT (balance) FROM ${this.db}.balances WHERE user_id=? ORDER BY \`datetime\` DESC LIMIT 1`;

        return new Promise((resolve, reject) => {
            this.connection.query(query, [user_id], (err: Error, result: JSON) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    public getCurrentMonthBalances(user_id: number): Promise<any> {
        const query = `SELECT * FROM ${this.db}.balances WHERE user_id=? AND MONTH(\`datetime\`)=MONTH(?) GROUP BY DAY(\`datetime\`) ORDER BY id ASC`;

        return new Promise((resolve, reject) => {
            this.connection.query(query, [user_id, this.now.format('YYYY-MM-DD HH:mm:ss')], (err: Error, result: JSON) => {
                if (err) reject(err);
                resolve(result);
            })
        });
    }

    public getCurrentYearBalances(user_id: number): Promise<any> {
        const query = `SELECT SUM(balance), \`datetime\` FROM ${this.db}.balances WHERE user_id=? AND YEAR(\`datetime\`)=YEAR(?) GROUP BY MONTH(\`datetime\`) ORDER BY \`datetime\` ASC`;

        return new Promise((resolve, reject) => {
            this.connection.query(query, [user_id, this.now.format('YYYY-MM-DD HH:mm:ss')], (err: Error, result: JSON) => {
                if (err) reject(err);
                resolve(result);
            })
        });
    }

    public getPreviousMonthBalances(user_id: number): Promise<any> {
        const previousMonth = moment().set('month', this.now.get('month') - 1).format('YYYY-MM-DD HH:mm:SS');
        const query = `SELECT * FROM ${this.db}.balances WHERE user_id=? AND MONTH(\`datetime\`)=MONTH(?) GROUP BY DAY(\`datetime\`) ORDER BY \`datetime\` ASC`;

        return new Promise((resolve, reject) => {
            this.connection.query(query, [user_id, previousMonth], (err: Error, result: JSON) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    public getPreviousYearBalances(user_id: number): Promise<any> {
        const previousYear = moment().set('year', this.now.get('year') - 1).format('YYYY-MM-DD HH:mm:SS');
        const query = `SELECT SUM(balance), \`datetime\` FROM ${this.db}.balances WHERE user_id=? AND YEAR(\`datetime\`)=YEAR(?) GROUP BY MONTH(\`datetime\`) ORDER BY \`datetime\` ASC`;

        return new Promise((resolve, reject) => {
            this.connection.query(query, [user_id, previousYear], (err: Error, result: JSON) => {
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
            this.connection.query(query, vars, (err: Error, result: JSON) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}
