import {TrackableData, Tracks} from "../../../Tracks/index";
import {Balances} from "../../../Balances/index.js";
import * as moment from "moment";

const tracks = new Tracks();
const balances = new Balances();

async function putIncomeTrack(data: TrackableData): Promise<any> {
    const isDateBefore = moment(data.date).isBefore(new Date().getTime());

    try {
        if (isDateBefore) {
            let isBalanceUpdated = false;

            balances.connect();
            balances.updateBalancesAdd(data.user_id, data.number, data.date)
                .then(() => {
                    isBalanceUpdated = true;
                    balances.killConnection();
                })
                .catch(err => console.log(err));

            if (!isBalanceUpdated) {
                return Promise.reject(new Error("Not updated"));
            }
        }

        tracks.connect();
        await tracks.putTrack(1, data);
    } catch(err) {
        console.error(err);
        return Promise.reject(err);
    }
}

export default (req: any, res: any): void => {
    const { user_id, number, date, category_id, comment } = req.body;

    putIncomeTrack({ user_id, number, date, category_id, comment })
        .then(() => {
            res.status(200).send(JSON.stringify({ status: 'OK' }));
            tracks.killConnection();
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal server error');
            tracks.killConnection();
        });
};
