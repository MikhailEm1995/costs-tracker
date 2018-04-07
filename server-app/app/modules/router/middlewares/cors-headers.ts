export default (req: any, res: any, next: any) => {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST"
    });
    next();
};
