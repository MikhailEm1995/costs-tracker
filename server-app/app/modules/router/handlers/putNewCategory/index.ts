import { Categories } from '../../../Categories/index'

const categories = new Categories();

let isServerError = true;

async function putNewCategory(user_id: number, type: number, category: string, color: string): Promise<any> {
    try {
        categories.connect();
        return await categories.putNewCategory(user_id, category, color, type);
    } catch(err) {
        console.error(err);
        return Promise.reject(err);
    }
}

export default (req: any, res: any): void => {
    const { user_id, type, category, color } = req.body;

    putNewCategory(user_id, type, category, color)
        .then((id: number) => {
            res.status(200).send(JSON.stringify({
                id, category, color, type
            }));
            categories.killConnection();
        })
        .catch((err: any) => {
            console.error(err);

            if (isServerError) {
                res.status(500).send('Internal server error');
            } else {
                res.status(400).send('Invalid type');
            }

            categories.killConnection();
        });
};
