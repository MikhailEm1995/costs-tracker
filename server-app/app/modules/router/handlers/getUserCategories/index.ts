import {Categories} from "../../../Categories/index";

let categories = new Categories();

export default (req: any, res: any): void => {
    categories.connect();

    categories.getUserCategories(req.query.id)
        .then((result) => {
            res.status(200).send(JSON.stringify(result));
            categories.killConnection();
        })
        .catch((err) => {
            console.error(err);
            res.statuc(500).send('Internal server error');
        });
};
