import { Categories } from '../../../Categories/index'

const categories = new Categories();

let isServerError = true;

async function putNewCategory(user_id: number, type: string, category: string, color: string): Promise<any> {
    try {
        categories.connect();

        const table = getTable(type);

        return await categories.putNewCategoryToTable(table, user_id, category, color);
    } catch(err) {
        console.error(err);
        return Promise.reject(err);
    }
}

export function getTable(type: string): string {
    switch (type) {
        case 'income': return 'income_categories';
        case 'cost': return 'cost_categories';
        default: {
            isServerError = false;
            throw new Error();
        }
    }
}

export default (req: any, res: any): void => {
    const { user_id, type, category, color } = req.body;

    putNewCategory(user_id, type, category, color)
        .then((id: number) => {
            res.status(200).send(JSON.stringify({
                id, category, color
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
