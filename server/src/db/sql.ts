import * as mysql from 'mysql';
import { DbConnector } from './db_connector';
import { DataRow } from './types';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'read24_dev',
    password: 'password',
    database: 'read24_dev',
    insecureAuth: true
});

const TableMapping = {
    books: 'books',
    choices: 'choices',
    classrooms: 'classrooms',
    questions: 'questions',
    quizQuestions: 'quiz_questions',
    quizTokens: 'quiz_tokens',
    ratings: 'ratings',
    students: 'students',
    studentAnswers: 'student_answers',
    teachers: 'teachers',
    teacherClassrooms: 'teacher_classrooms'
};

connection.connect();

export class _MySqlDb extends DbConnector {
    private _buildList(data: DataRow) {
        const columns = [];
        for(const col in data) {
            columns.push(`${col.toString()} = ?`);
        }
        const list = columns.join(", ");

        return list;
    }

    public insert(tableName: string, data: DataRow): Promise<number> {
        const list = this._buildList(data);
        const values = [];
        for(const col in data) {
            values.push(data[col.toString()]);
        }

        const formatted = mysql.format(`INSERT INTO ${TableMapping[tableName]} SET ${list}`, values);

        const promise = new Promise<number>((resolve, reject) => {
            const query = connection.query(formatted, (err, results) => {
                if (err)
                    return reject(err);

                console.log(query.sql);
                console.log('INSERT results', results);

                return resolve(1);
            });
        });

        return promise;
    }

    public update(tableName: string, data: DataRow): Promise<number> {
        const list = this._buildList(data);
        const values = [];
        for(const col in data) {
            values.push(data[col.toString()]);
        }

        const formatted = mysql.format(`UPDATE ${TableMapping[tableName]} SET ${list} WHERE id = ${data.id}`, values);

        const promise = new Promise<number>((resolve, reject) =>{
            const query = connection.query(formatted, (err, results) => {
                if (err)
                    return reject(err);
    
                console.log(query.sql);
                console.log('UPDATE Rows affected', results.affectedRows);

                return resolve(results.affectedRows);
            });

        });

        return promise;
    }

    public find(tableName: string, id: number): Promise<DataRow> {
        const promise = new Promise<DataRow>((resolve, reject) => {
            const query = connection.query(mysql.format(`SELECT * FROM ${TableMapping[tableName]} WHERE id = ?`, [id]), (err, results) => {
                if (err)
                    return reject(err);

                console.log(query.sql);
                console.log('SELECT by ID results', results);

                const result = Object.assign({}, results[0]);

                return resolve(result as DataRow);
            });
        });

        return promise;
    }

    public select(tableName: string, whereFunc?: (o: DataRow) => boolean): Promise<DataRow[]> {
        const promise = new Promise<DataRow[]>((resolve, reject) => {
            const query = connection.query(`SELECT * FROM ${TableMapping[tableName]}`, (err, results) => {
                if (err)
                    return reject(err);

                console.log(query.sql);
                console.log('SELECT results', results);

                const resultRows = results.map(r => Object.assign({}, r));

                return resolve(resultRows.filter(whereFunc) as DataRow[]);
            });
        });


        return promise;
    }
}

process.on("SIGINT", () => {
    console.log('terminating sql connection');
    connection.end((err) => 
        err
            ? process.exit(1) 
            : process.exit());
});

export const MySqlDb = new _MySqlDb();