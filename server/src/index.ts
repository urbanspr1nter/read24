import {Config, DatabaseConnector} from './config';
import * as fs from 'fs';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import {mountBook} from './routes/book';
import { mountQuiz } from './routes/quiz';
import { mountStudent } from './routes/student';
import { mountLogin } from './routes/login';
import { mountAdmin } from './routes/admin';
import * as cors from 'cors';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

mountLogin(app);
mountAdmin(app);
mountBook(app);
mountQuiz(app);
mountStudent(app);

app.get('/debug/db', (req, res) => {
    if (process.env.DATA_SOURCE === 'mysql')
        return res.status(304);

    return res.status(200).json(DatabaseConnector.dump());
});

app.get('/debug/db/dump', (req, res) => {
    if (process.env.DATA_SOURCE === 'mysql')
        return res.status(304);

    fs.writeFileSync('db.json', JSON.stringify(DatabaseConnector.dump(), undefined, 4));

    return res.status(200).json({message: 'Dumped'});
});

app.listen(Config.port, () => {
    // Initialize the in-memory DB if exists
    if (Config.data_source === 'memory' 
            && Config.environment === 'development' 
            && fs.existsSync('db.json')) 
        DatabaseConnector.initialize(JSON.parse(fs.readFileSync('db.json', 'utf-8')));

    console.log(`Running on: ${__dirname}`);
    console.log('It works!');
});
