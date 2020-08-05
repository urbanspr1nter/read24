import * as mysql from 'mysql';
import { DbConnector } from './db_connector';
import { DataRow } from './types';
import { SelectOptions } from './connector';
import { isValue } from '../util/util';

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
    teacherClassrooms: 'teacher_classrooms',
    users: 'users'
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
                console.log('Last Insert ID', results.insertId);

                return resolve(results.insertId);
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
            const opts: SelectOptions = {
                includeDeleted: false
            };

            return this.select(tableName, (o: DataRow) => o.id === id, opts)
                .then(results => results.length === 0 ? reject(null) : resolve(results[0]))
                .catch(e => reject(e));
        });

        return promise;
    }

    public select(tableName: string, whereFunc?: (o: DataRow) => boolean, opts?: SelectOptions): Promise<DataRow[]> {
        const promise = new Promise<DataRow[]>((resolve, reject) => {
            let queryString = '';

            if (opts.columns && opts.columns.length > 0)
                queryString = `SELECT ${opts.columns.join(',')} FROM ${TableMapping[tableName]} `;
            else
                queryString = `SELECT * FROM ${TableMapping[tableName]} `;

            queryString += ' WHERE 1=1 '
            // By default, do not include rows where deletedAt is set. This is a virtual deletion.
            if (!opts || !opts.includeDeleted)
                queryString += ' AND dateDeleted = 0 ';

            if (opts && opts.filters && opts.filters.length > 0) {
                const filters = opts.filters.map(f => `${f.column} = ${f.value}`).join(' AND ');
                queryString += ` AND ${filters}`
            }

            if (opts && opts.orderBy)
                queryString += ` ORDER BY ${opts.orderBy.column} ${opts.orderBy.ascending ? 'ASC': 'DESC'}`;
            
            if (opts && opts.limit && isValue(opts.offset))
                queryString += ` LIMIT ${opts.offset}, ${opts.limit}`;

            const query = connection.query(queryString, (err, results) => {
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

    public delete(tableName: string, whereFunc: (o: DataRow) => boolean): Promise<number> {
        const promise = new Promise<number>(async (resolve, reject) => {
            const selected = await this.select(tableName, whereFunc);

            if (selected.length === 0)
                return resolve(0);

            const ids = selected.map((r: DataRow) => r.id);
            const idGroup = `(${ids.join(', ')})`;

            const query = connection.query(`DELETE FROM ${TableMapping[tableName]} WHERE id IN ${idGroup}`, (err, results) => {
                if (err)
                    return reject(err);

                console.log(query.sql);
                console.log(`DELETED IDS: ${idGroup} FROM ${tableName}`);

                return resolve(results.affectedRows);
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