import * as express from 'express';
import router from './modules/router';

const app = express();

const PORT = process.argv[2] || 3000;

app.use(router());

app.listen(PORT, () => {
    console.log('Server started on port: ', PORT);
});
