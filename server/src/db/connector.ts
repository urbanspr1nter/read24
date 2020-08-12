import { DbConnector } from "./db_connector";
import { MySqlDb } from "./sql";
import { MemoryDb } from "./memory";

export let DatabaseConnector: DbConnector = null;

if (process.env.DATA_SOURCE === 'mysql')
    DatabaseConnector = MySqlDb;
else 
    DatabaseConnector = MemoryDb;

console.log(`Using the ${process.env.DATA_SOURCE === 'mysql' ? 'MySQL' : 'Memory'} database connector.`);

export interface OrderByOption {
    column: string;
    ascending: boolean;
}

export interface FilterOption {
    column: string;
    value: string|number;
}

export interface InOption {
    column: string;
    value: string[]|number[];
}

export interface FullTextMatchOption {
    columns: string[];
    value: string
}

export enum AggregateType {
    Count = 'COUNT'
}

export interface AggregateOption {
    type: AggregateType;
    column: string;
    alias: string;
}

export interface SelectOption {
    includeDeleted?: boolean;
    orderBy?: OrderByOption;
    offset?: number;
    limit?: number;
    columns?: string[];
    filters?: FilterOption[];
    fullTextMatch?: FullTextMatchOption[];
    in?: InOption;
    aggregate?: AggregateOption;
}

export interface DeleteOption {
    hardDelete: boolean;
    filters: FilterOption[];
    in?: InOption;
}
