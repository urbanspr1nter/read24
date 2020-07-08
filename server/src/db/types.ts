import { MemoryDb } from "./memory";

export interface DataRow {
    id: number;
    dateCreated?: number;
    dateUpdated?: number;
}

export abstract class BaseResource implements DataRow {
    public id: number;
    public dateCreated: number;
    public dateUpdated: number;

    private _tableName: string;

    constructor(tableName: string) {
        this._tableName = tableName;
    }

    public load(id: number) {
        const found = MemoryDb.find(this._tableName, id);

        if (!found)
            throw new Error(`Did not find a row with ID value: ${this.id}`);

        Object.assign(this, found);

        return this;
    }

    public insert() {
        if (this.id > 0)
            throw new Error(`Cannot insert this row because it already has an ID value: ${this.id}.`);

        this.dateCreated = Date.now();

        const toSave: DataRow = { id: 0 };

        for(const prop in this) {
            if (typeof this[prop] === 'function' || prop === '_tableName') {
                continue;
            }

            toSave[prop.toString()] = this[prop];
        }

        MemoryDb.insert(this._tableName, toSave);

        return this;
    }

    public update(whereFunc: (o: DataRow) => boolean) {
        if (this.id === 0)
            return this;
        
        this.dateUpdated = Date.now();

        const toSave: DataRow = { id: 0 };

        for(const prop in this) {
            if (typeof this[prop] === 'function' || prop === '_tableName') {
                continue;
            }

            toSave[prop.toString()] = this[prop];
        }

        MemoryDb.update(this._tableName, toSave, whereFunc);

        return this;
    }

    public json() {
        const obj = {};

        for(const prop in this) {
            if (typeof this[prop] === 'function'
                || prop === '_tableName'
                || prop === 'dateCreated'
                || prop === 'dateUpdated'
            ) {
                continue;
            }

            obj[prop.toString()] = this[prop];
        }

        return obj;
    }
}