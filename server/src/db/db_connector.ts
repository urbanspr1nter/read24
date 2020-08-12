import { DataRow } from "./types";
import { SelectOption, DeleteOption } from "./connector";

export abstract class DbConnector {
    public abstract insert(tableName: string, data: Partial<DataRow>): Promise<number>;
    public abstract update(tablename: string, data: Partial<DataRow>): Promise<number>;
    public abstract find(tableName: string, id: number): Promise<Partial<DataRow>>;
    public abstract select(tablename: string, opts: SelectOption): Promise<Partial<DataRow>[]>;
    public abstract delete(tableName: string, opts: DeleteOption): Promise<number>;
}
