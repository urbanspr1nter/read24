import * as express from 'express';
import * as bodyParser from 'body-parser';
import {mountBook} from './routes/book';
import { mountQuiz } from './routes/quiz';
import { mountStudent } from './routes/student';
import { mountLogin } from './routes/login';
import { MemoryDb } from './db/memory';
import { mountAdmin } from './routes/admin';

const app = express();

app.use(bodyParser.json());

app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

app.get('/debug/db', (req, res) => {
    return res.status(200).json(MemoryDb.dump());
});

mountLogin(app);
mountAdmin(app);
mountBook(app);
mountQuiz(app);
mountStudent(app);

app.listen(3000, () => {
    console.log(`Running on: ${__dirname}`);
    console.log('It works!');
});
