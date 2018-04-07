import {Tracks} from "../../../Tracks/index";

let tracks = new Tracks();

export default (req: any, res: any): void => {
    tracks.connect();

    tracks.getUserCategories(req.query.id)
        .then((result) => {
            res.status(200).send(JSON.stringify(result));
            tracks.killConnection();
        })
        .catch((err) => {
            console.error(err);
            res.statuc(500).send('Internal server error');
        });
};
