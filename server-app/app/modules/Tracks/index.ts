import * as mysql from 'mysql';
import * as moment from 'moment';

import { host, username, password, tracksDatabase } from '../../constants/db';

export class TrackableData {
    user_id: number;
    number: number;
    date: string;
    category_id: number;
    comment?: string;
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

    public getMonth(user_id: number): Promise<any> {
        const now = moment();
        const monthStart = now.startOf('month').format('YYYY-MM-DD');
        const monthEnd = now.endOf('month').format('YYYY-MM-DD');
        const query = `SELECT id, number, \`date\`, type, category_id FROM ${this.db}.tracks WHERE user_id=? AND \`date\` BETWEEN ? AND ?`;
        
        return new Promise<any>((resolve, reject) => {
            this.connection.query(query, [user_id, monthStart, monthEnd], (err: Error, result: JSON) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    public getYear(user_id: number): Promise<any> {
        const now = moment();
        const yearStart = now.startOf('year').format('YYYY-MM-DD');
        const yearEnd = now.endOf('year').format('YYYY-MM-DD');
        const query = `SELECT id, number, \`date\`, type, category_id FROM ${this.db}.tracks WHERE user_id=? AND \`date\` BETWEEN ? AND ?`;

        return new Promise<any>((resolve, reject) => {
            this.connection.query(query, [user_id, yearStart, yearEnd], (err: Error, result: JSON) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    public putTrack(type: number, data: TrackableData): Promise<any> {
        let { user_id, number, date, category_id, comment } = data;
        const query = `INSERT INTO ${this.db}.tracks (user_id, type, number, \`date\`, category_id, comment) VALUES (?, ?, ?, ?, ?, ?)`;

        if (comment === undefined) comment = 'nil';

        return new Promise<any>((resolve, reject) => {
            this.connection.query(query, [user_id, type, number, date, category_id, comment], (err: Error, result: JSON) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}
