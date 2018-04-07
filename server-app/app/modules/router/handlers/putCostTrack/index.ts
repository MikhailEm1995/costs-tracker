import {TrackableData, Tracks} from "../../../Tracks/index";
import {Categories} from "../../../Categories/index";

let tracks = new Tracks();
const categories = new Categories();

async function putCostTrack(data: TrackableData, category_id: number): Promise<any> {
    try {
        tracks.connect();
        const trackID = await tracks.putTrackToTable('cost_tracks', data);

        categories.connect();
        await categories.putCostCategoryTrack(trackID.insertId, category_id);
    } catch(err) {
        console.error(err);
        return Promise.reject(err);
    }
}

export default (req: any, res: any): void => {
    const { user_id, number, date, category_id } = req.body;

    putCostTrack({ user_id, number, date }, category_id)
        .then(() => {
            res.status(200).send('OK');
            tracks.killConnection();
            categories.killConnection();
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal server error');
            tracks.killConnection();
            categories.killConnection();
        });
};
