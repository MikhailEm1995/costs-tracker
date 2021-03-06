import {Balances} from "../../../Balances/index.js";

const balances = new Balances();

async function putIncreasedBalance(user_id: number, num: number, date?: string) {
    try {
        balances.connect();

        let balancesList;

        if (date) {
            await balances.addToBalance(user_id, num);
            balancesList = await balances.updateBalancesAdd(user_id, num, date);
        } else {
            balancesList = await balances.addToBalance(user_id, num);
        }

        return {
            user_id,
            balances: balancesList[2]
        };
    } catch(err) {
        console.log(err);
        Promise.reject(err);
    }
}

export default (req: any, res: any): void => {
    const { user_id, num, date } = req.body;

    balances.connect();

    putIncreasedBalance(user_id, num, date)
        .then((result) => {
            res.status(200).send(JSON.stringify(result));
            balances.killConnection();
        })
        .catch((err: any) => {
            console.error(err);
            res.status(500).send('Internal server error');
            balances.killConnection();
        });
};
