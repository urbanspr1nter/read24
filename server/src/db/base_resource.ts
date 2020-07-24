import { DataType, DataRow } from "./types";
import { DatabaseConnector } from "./connector";

export abstract class BaseResource implements DataType {
    public id: number;
    public dateCreated: number;
    public dateUpdated: number;

    private _tableName: string;

    constructor(tableName: string) {
        this._tableName = tableName;

        this.dateCreated = 0;
        this.dateUpdated = 0;
    }

    public async load(id: number) {
        const found = await DatabaseConnector.find(this._tableName, id);

        if (!found)
            throw new Error(`Did not find a row with ID value: ${this.id}`);

        Object.assign(this, found);

        return Promise.resolve(this);
    }

    public async insert() {
        if (this.id > 0)
            throw new Error(`Cannot insert this row because it already has an ID value: ${this.id}.`);

        this.dateCreated = Date.now();

        const toSave = this.serializeForDb();

        const id = await DatabaseConnector.insert(this._tableName, toSave);

        this.id = id;

        return this;
    }

    public async update() {
        if (this.id === 0)
            return this;
        
        this.dateUpdated = Date.now();

        const toSave = this.serializeForDb();

        await DatabaseConnector.update(this._tableName, toSave);

        return this;
    }

    public async delete() {
        if (this.id === 0)
            return this;

        await DatabaseConnector.delete(this._tableName, (o: DataRow) => o.id === this.id);

        return this;
    }

    public serializeForDb(): Partial<DataRow> {
        const result = {};
        for (const prop in this) {
            if (typeof this[prop] === 'function' || prop === '_tableName')
                continue;

            result[prop.toString()] = this[prop];
        }

        console.log(`Serialized for DB`, result);

        return result;
    }

    public json() {
        const obj = this.serializeForDb();

        delete obj.dateCreated;
        delete obj.dateUpdated;

        return obj;
    }
}
