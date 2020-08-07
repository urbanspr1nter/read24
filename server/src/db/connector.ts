import { MemoryDb } from "./memory";
import { DbConnector } from "./db_connector";
import { MySqlDb } from "./sql";

export let DatabaseConnector: DbConnector = null;

if (process.env.DATA_SOURCE === 'mysql') {
    DatabaseConnector = MySqlDb;
    console.log('Using the mysql database');
}
else {
    DatabaseConnector = MemoryDb;
    console.log('Using the in-memory database');
}

export interface DeleteOptions {
    hardDelete: boolean;
}

export interface OrderByOptions {
    column: string;
    ascending: boolean;
}

export interface FilterOption {
    column: string;
    value: string;
}

export interface FullTextMatchOption {
    columns: string[];
    value: string
}

export interface SelectOptions {
    includeDeleted?: boolean;
    orderBy?: OrderByOptions;
    offset?: number;
    limit?: number;
    columns?: string[];
    filters?: FilterOption[];
    fullTextMatch?: FullTextMatchOption[];
}
