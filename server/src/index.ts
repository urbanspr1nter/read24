import * as express from 'express';

const app = express();

app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

app.listen(3000, () => {
    console.log('It works!');
});
