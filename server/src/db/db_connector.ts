import { DataRow } from "./types";

export abstract class DbConnector {
    public abstract insert(tableName: string, data: Partial<DataRow>): Promise<number>;
    public abstract update(tablename: string, data: Partial<DataRow>): Promise<number>;
    public abstract find(tableName: string, id: number): Promise<Partial<DataRow>>;
    public abstract select(tablename: string, whereFunc?: (o: Partial<DataRow>) => boolean): Promise<Partial<DataRow>[]>;
}
