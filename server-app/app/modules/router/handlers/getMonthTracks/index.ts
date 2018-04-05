import { Tracks } from "../../../Tracks/index";

let tracks = new Tracks();

async function getMonthTracks(user_id: string): Promise<any> {
    try {
        tracks.connect();

        return {
            user_id,
            costs: await tracks.getMonthFromTable(user_id, 'cost_tracks'),
            income: await tracks.getMonthFromTable(user_id, 'income_tracks')
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
        .then((tracks) => {
            console.log(tracks);
            res.status(200).send(JSON.stringify(tracks));
            tracks.killConnection();
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal server error');
            tracks.killConnection();
        });
};
