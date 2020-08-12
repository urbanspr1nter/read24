import { DbConnector } from "./db_connector";
import { DataRow } from "./types";
import { SelectOption, DeleteOption, AggregateType } from "./connector";
import { TableMapping } from "./tables";
import { isValue } from "../util/util";

class _MemoryDb extends DbConnector {
    private _db = {};

    constructor() {
        super();

        for(const k in TableMapping)
            this._db[TableMapping[k]] = {
                lastId: 0,
                data: []
            };
    }

    public dump() {
        return this._db;
    }

    public initialize(db: any) {
        this._db = db;
    }

    public insert(tableName: string, data: Partial<DataRow>): Promise<number> {
        const table = this._db[TableMapping[tableName]];
        const tableData = table.data;

        const newData = {...data};
        for(const k in newData) {
            if (typeof newData[k] === 'boolean')
                newData[k] = newData[k].toString() === 'true' ? 1 : 0;
        }

        tableData.push({...newData, id: table.lastId + 1});
        table.lastId++;

        return Promise.resolve(table.lastId);
    }

    public update(tableName: string, data: Partial<DataRow>): Promise<number> {
        const toUpdate = {...data};
        if (!toUpdate.id)
            return Promise.resolve(0);
        
        for(const col in toUpdate) {
            if (typeof toUpdate[col] === 'boolean')
                toUpdate[col] = toUpdate[col].toString() === 'true' ? 1 : 0;
        }

        const ref = this._db[TableMapping[tableName]].data.find(r => r.id === toUpdate.id);
        for(const k in ref)
            ref[k] = toUpdate[k];

        return Promise.resolve(1);
    }

    public find(tableName: string, id: number): Promise<Partial<DataRow>> {
        const ref = this._db[TableMapping[tableName]].data.find(r => r.id === id);

        return Promise.resolve(ref);
    }

    public select(tableName: string, opts: SelectOption): Promise<Partial<DataRow>[]> {
        const allData = [];
        
        if(!opts.includeDeleted)
            allData.push(...this._db[TableMapping[tableName]].data);
        else
            allData.push(...this._db[TableMapping[tableName]].data.filter(r => r.dateDeleted === 0));

        let filteredData = [];
        if (opts.filters) {
            const result = [...allData].filter(r => {
                let condition = undefined;
                opts.filters.forEach(filter => {
                    condition = !condition
                        ? (r[filter.column] === filter.value) 
                        : condition && (r[filter.column] === filter.value);

                    return filter;
                });

            });

            filteredData = [...result]
        } else {
            filteredData = [...allData];
        }


        if (opts.fullTextMatch && opts.fullTextMatch.length > 0) {
            for(const filter of opts.fullTextMatch) {
                filteredData = filteredData.filter(r => {
                    let result = false;
                    for(const col of filter.columns)
                        result = result || (r[col].toLowerCase().indexOf(filter.value) > -1);

                    return result;
                });
            }
        }

        if (opts.orderBy) {
            filteredData.sort((x, y) => {
                const a = x[opts.orderBy.column];
                const b = y[opts.orderBy.column];

                if(typeof a === 'number') {
                    if (opts.orderBy.ascending)
                        return a - b;
                    else
                        return b - a;
                } else {
                    if (opts.orderBy.ascending)
                        if (a <= b)
                            return -1;
                        else
                            return 0;
                    else
                        return 1;
                }
            })
        }

        if (opts.limit) {
            const offset = opts.offset ? opts.offset : 0;
            const limit = offset + opts.limit;
            filteredData = filteredData.slice(offset, limit);
        }

        if ((opts.columns && opts.columns.length > 0) && opts.aggregate)
            return Promise.reject('Can only select with either columns, or aggregate function, but not both');

        // This is like a SELECT * 
        if ((!opts.columns || opts.columns.length === 0) && !opts.aggregate)
            return Promise.resolve(filteredData);

        // If it is a SELECT by columns, or aggregate
        const results = [];
        if ((opts.columns && opts.columns.length > 0) && !opts.aggregate)
            for(const f of filteredData) {
                const row = {};
                for(const c  of opts.columns) {
                    row[c] = f[c];
                }

                results.push(row);
            }
        else if((!opts.columns || opts.columns.length === 0) && opts.aggregate) {
            if (opts.aggregate.type === AggregateType.Count) {
                results.push({
                    [opts.aggregate.alias]: filteredData.filter(r => !!r[opts.aggregate.column]).length
                })
            }
        }

        return Promise.resolve(results);
    }

    public delete(tableName: string, opts: DeleteOption): Promise<number> {
        // There needs to be some filtering
        if (opts.filters.length === 0 && !opts.in && !isValue(opts.in.column) && !isValue(opts.in.value))
            return Promise.resolve(0);

        const combined = [];
        const allData = [...this._db[TableMapping[tableName]].data];

        if (opts.filters.length > 0) {
            const deletedFilteredEntries = [...allData].filter(r => {
                let condition = undefined;
                opts.filters.forEach(filter => {
                    condition = !condition
                        ? (r[filter.column] === filter.value) 
                        : condition && (r[filter.column] === filter.value);

                    return filter;
                });
            });

            combined.push(...deletedFilteredEntries);
        }
    
        if (opts.in) {
            let deletedInEntries = [...allData];
            for (const v of opts.in.value) {
                deletedInEntries = deletedInEntries.filter(r => r[opts.in.column] === v);
            }
            
            combined.push(...deletedInEntries);
        }

        this._db[TableMapping[tableName]].data = this._db[TableMapping[tableName]].data.filter(r => !combined.find(d => d.id === r.id));

        return Promise.resolve(Array.from((new Set(combined)).values()).length);
    }
}

export const MemoryDb = new _MemoryDb();