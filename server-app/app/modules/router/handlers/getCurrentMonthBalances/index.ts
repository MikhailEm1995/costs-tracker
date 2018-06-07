import {Balances} from "../../../Balances/index.js";

let balances = new Balances();

export default (req: any, res: any): void => {
    balances.connect();

    balances.getCurrentMonthBalances(req.query.id)
        .then((result) => {
            res.status(200).send(JSON.stringify(result));
            balances.killConnection();
        })
        .catch((err) => {
            console.error(err);
            balances.killConnection();
            res.statuc(500).send('Internal server error');
        });
};
