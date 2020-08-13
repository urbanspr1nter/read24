import * as RuntimeConfig from '../config';
const Config = RuntimeConfig.default;

import { MemoryDb } from './memory';
import { MySqlDb } from './sql';
import { DbConnector } from './db_connector';

if(!(global as any).DatabaseConnector) {
    if(Config.data_source === 'memory') {
        (global as any).DatabaseConnector = new MemoryDb();
    } else {
        (global as any).DatabaseConnector = new MySqlDb();
    }
} 
export const DatabaseConnector = (global as any).DatabaseConnector as DbConnector;

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
