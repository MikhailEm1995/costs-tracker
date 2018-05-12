import { Categories } from "../../../Categories/index";

const categories = new Categories();

async function deleteCategory(id: number): Promise<any> {
    try {
        categories.connect();
        return await categories.deleteCategory(id);
    } catch(err) {
        console.error(err);
        Promise.reject(err);
    }
}

export default (req: any, res: any): void => {
    const { id } = req.query;

    deleteCategory(id)
        .then(() => {
            res.status(200).send(JSON.stringify({ id }));
            categories.killConnection();
        })
        .catch((err: any) => {
            console.error(err);

            res.status(500).send('Internal server error');
            categories.killConnection();
        });
};
