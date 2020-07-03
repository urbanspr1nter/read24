import * as express from 'express';
import * as bodyParser from 'body-parser';
import {mountBook} from './routes/book';
import { mountQuiz } from './routes/quiz';
import { mountStudent } from './routes/student';
import { mountLogin } from './routes/login';

const app = express();

app.use(bodyParser.json());

app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

mountLogin(app);
mountBook(app);
mountQuiz(app);
mountStudent(app);

app.listen(3000, () => {
    console.log('It works!');
});
