import { Categories } from "../../../Categories/index";

const categories = new Categories();

let isServerError = true;

async function deleteCategory(type: string, id: number): Promise<any> {
    try {
        categories.connect();

        const table = getTable(type);

        return await categories.deleteCategoryFromTable(table, id);
    } catch(err) {
        console.error(err);
        Promise.reject(err);
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
    const { type, id } = req.body;

    deleteCategory(type, id)
        .then((result: any) => {
            res.status(200).send(JSON.stringify({ type, id }));
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
