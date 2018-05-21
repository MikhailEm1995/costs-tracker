import {TrackableData, Tracks} from "../../../Tracks/index";
const tracks = new Tracks();

async function putIncomeTrack(data: TrackableData): Promise<any> {
    try {
        tracks.connect();
        await tracks.putTrack(2, data);
    } catch(err) {
        console.error(err);
        return Promise.reject(err);
    }
}

export default (req: any, res: any): void => {
    const { user_id, number, date, category_id, comment } = req.body;

    putIncomeTrack({ user_id, number, date, category_id, comment })
        .then(() => {
            res.status(204).send(JSON.stringify({ status: 'OK' }));
            tracks.killConnection();
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal server error');
            tracks.killConnection();
        });
};
