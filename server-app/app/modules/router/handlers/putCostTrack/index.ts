import {TrackableData, Tracks} from "../../../Tracks/index";

let tracks = new Tracks();

async function putCostTrack(data: TrackableData, trackCategory: string): Promise<any> {
    try {
        tracks.connect();

        const trackID = await tracks.putTrackToTable('cost_tracks', data);
        await tracks.putCostCategoryTrack(trackID.insertId, data.user_id, trackCategory);
    } catch(err) {
        console.error(err);
        return Promise.reject(err);
    }
}

export default (req: any, res: any): void => {
    const { user_id, number, date, category } = req.body;

    putCostTrack({ user_id, number, date }, category)
        .then(() => {
            res.status(200).send('OK');
            tracks.killConnection();
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal server error');
            tracks.killConnection();
        });
};
