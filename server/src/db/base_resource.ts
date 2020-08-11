import { DataType, DataRow } from "./types";
import { DatabaseConnector, DeleteOptions } from "./connector";

export abstract class BaseResource implements DataType {
    public id: number;
    public dateCreated: number;
    public dateUpdated: number;
    public dateDeleted: number;

    private _tableName: string;

    constructor(tableName: string) {
        this._tableName = tableName;

        this.dateCreated = 0;
        this.dateUpdated = 0;
        this.dateDeleted = 0;
    }

    public async load(id: number) {

        try {
            const found = await DatabaseConnector.find(this._tableName, id);

            Object.assign(this, found);

            return Promise.resolve(this);
        } catch (e) {
            return Promise.reject({status: 'not_found', message: `Did not find a resource with ID value: ${id}`});
        }
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

    public async delete(opts?: DeleteOptions) {
        if (this.id === 0)
            return this;

        this.dateDeleted = Date.now();

        const toSave = this.serializeForDb();

        console.log(`Resource delete. opts: ${opts}, id: ${this.id}`);

        if (opts && opts.hardDelete)
            await DatabaseConnector.delete(this._tableName, {
                hardDelete: opts && opts.hardDelete,
                filters: [{
                    column: 'id',
                    value: this.id
                }]
            });
        else
            await DatabaseConnector.update(this._tableName, toSave);

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
        delete obj.dateDeleted;

        return obj;
    }
}
