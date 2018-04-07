import {TrackableData, Tracks} from "../../../Tracks/index";

let tracks = new Tracks();

async function putIncomeTrack(data: TrackableData, trackCategory: string, categoryColor: string): Promise<any> {
    try {
        tracks.connect();

        const trackID = await tracks.putTrackToTable('income_tracks', data);
        await tracks.putIncomeCategoryTrack(trackID.insertId, data.user_id, trackCategory, categoryColor);
    } catch(err) {
        console.error(err);
        return Promise.reject(err);
    }
}

export default (req: any, res: any): void => {
    const { user_id, number, date, categoryName, categoryColor } = req.body;

    putIncomeTrack({ user_id, number, date }, categoryName, categoryColor)
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
