import { DbConnector } from "./db_connector";
import { MySqlDb } from "./sql";

export let DatabaseConnector: DbConnector = null;

DatabaseConnector = MySqlDb;
console.log('Using the MySQL database connector.');

export interface DeleteOptions {
    hardDelete: boolean;
    filters: FilterOption[];
    in?: InOption;
}

export interface OrderByOptions {
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

export interface SelectOptions {
    includeDeleted?: boolean;
    orderBy?: OrderByOptions;
    offset?: number;
    limit?: number;
    columns?: string[];
    filters?: FilterOption[];
    fullTextMatch?: FullTextMatchOption[];
    in?: InOption;
}
