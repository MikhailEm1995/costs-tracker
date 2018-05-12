import { Tracks } from "../../../Tracks/index";

let tracks = new Tracks();

async function getMonthTracks(user_id: number): Promise<any> {
    try {
        tracks.connect();

        return {
            user_id,
            costs: await tracks.getYear(user_id),
            income: await tracks.getYear(user_id)
        };
    } catch(err) {
        console.error(err);
        return Promise.reject(err);
    }
}

export default (req: any, res: any): void => {
    const { id } = req.query;

    if (!id) {
        res.status(400).send('Empty id');
        return;
    }

    getMonthTracks(id)
        .then((result) => {
            res.status(200).send(JSON.stringify(result));
            tracks.killConnection();
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal server error');
            tracks.killConnection();
        });
};
