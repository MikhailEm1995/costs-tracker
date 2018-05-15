import { Categories } from '../../../Categories/index'

const categories = new Categories();

async function putNewCategory(user_id: number, type: number, name: string, color: string): Promise<any> {
    try {
        if (!color || !name) throw new Error();

        categories.connect();
        return await categories.putNewCategory(user_id, name, color, type);
    } catch(err) {
        console.error(err);
        return Promise.reject(err);
    }
}

export default (req: any, res: any): void => {
    const { user_id, type, name, color } = req.body;

    putNewCategory(user_id, type, name, color)
        .then((id: number) => {
            res.status(200).send(JSON.stringify({
                id, name, color, type
            }));
            categories.killConnection();
        })
        .catch((err: any) => {
            console.error(err);

            res.status(500).send('Internal server error');

            categories.killConnection();
        });
};
