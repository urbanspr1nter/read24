import * as mysql from 'mysql';
import { DbConnector } from './db_connector';
import { DataRow } from './types';
import { SelectOption, DeleteOption, AggregateType } from './connector';
import { isValue } from '../util/util';
import { TableMapping } from './tables';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'read24_dev',
    password: 'password',
    database: 'read24_dev',
    insecureAuth: true
});

export class MySqlDb extends DbConnector {
    private _buildList(data: DataRow) {
        const columns = [];
        for(const col in data) {
            columns.push(`${col.toString()} = ?`);
        }
        const list = columns.join(", ");

        return list;
    }

    constructor() {
        super();
        connection.connect();
    }

    public dump() {
        return;
    }

    public initialize(db: any) {
        return;
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
            if (typeof data[col.toString()] === 'boolean')
                values.push(data[col.toString()].toString() === 'true' ? 1 : 0);
            else
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
            const opts: SelectOption = {
                includeDeleted: false,
                filters: [
                    {
                        column: 'id',
                        value: id.toString()
                    }
                ]
            };

            return this.select(tableName, opts)
                .then(results => results.length === 0 ? reject(null) : resolve(results[0]))
                .catch(e => reject(e));
        });

        return promise;
    }

    public select(tableName: string, opts: SelectOption): Promise<DataRow[]> {
        const promise = new Promise<DataRow[]>((resolve, reject) => {
            let queryString = 'SELECT ';

            if (opts.aggregate && (opts.columns && opts.columns.length > 0))
                return reject('Can only select with either columns, or aggregrate function, but not both.');

            if (opts.columns && opts.columns.length > 0)
                queryString += `${opts.columns.join(',')} `;
            else if ((!opts.columns || opts.columns.length === 0) && !opts.aggregate)
                queryString += `* `;
            else if (opts.aggregate && (!opts.columns || opts.columns.length === 0)) {
                // Currently only support aggregate when no columns are provided for selection
                if (opts.aggregate.type === AggregateType.Count)
                    queryString += `count(${opts.aggregate.column}) as ${connection.escape(opts.aggregate.alias)}`;
            }

            queryString += `FROM ${TableMapping[tableName]}`;

            queryString += ' WHERE 1=1 '
            // By default, do not include rows where deletedAt is set. This is a virtual deletion.
            if (!opts || !opts.includeDeleted)
                queryString += ' AND dateDeleted = 0 ';

            if (opts && opts.filters && opts.filters.length > 0) {
                const filters = opts.filters
                    .map(f => `${f.column} = ${connection.escape(f.value)}`)
                    .join(' AND ');
                queryString += ` AND ${filters}`;
            }

            if (opts && opts.fullTextMatch && opts.fullTextMatch.length > 0) {
                const matchers = opts.fullTextMatch.map(f => 
                    ` MATCH(${f.columns.join(', ')}) AGAINST (${connection.escape('+"' + f.value + '"')} IN BOOLEAN MODE) `).join(' AND ');
                queryString += ` AND ${matchers}`;
            }

            if (opts && opts.orderBy)
                queryString += ` ORDER BY ${opts.orderBy.column} ${opts.orderBy.ascending ? 'ASC': 'DESC'}`;
            
            if (opts && opts.limit)
                queryString += ` LIMIT ${opts.offset ? opts.offset : '0'}, ${opts.limit}`;

            console.log('SELECT query', queryString);
            connection.query(queryString, (err, results) => {
                if (err)
                    return reject(err);

                console.log('SELECT results', results);

                const resultRows = results.map(r => Object.assign({}, r));

                return resolve(resultRows);
            });
        });

        return promise;
    }

    public delete(tableName: string, opts: DeleteOption): Promise<number> {
        const promise = new Promise<number>(async (resolve, reject) => {
            // There needs to be some filtering
            if (opts.filters.length === 0 && !opts.in && !isValue(opts.in.column) && !isValue(opts.in.value))
                return resolve(0);

            let queryString = `DELETE FROM ${TableMapping[tableName]} WHERE `;
            for(const f of opts.filters)
                queryString += ` ${f.column} = ${connection.escape(f.value)}`;
            
            if (opts.in) {
                const list = [];
                for(const l of opts.in.value)
                    list.push(connection.escape(l));

                queryString += `${opts.in.column} IN (${list.join(',')})`;
            }


            const query = connection.query(queryString, (err, results) => {
                if (err)
                    return reject(err);

                console.log(query.sql);

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
