import * as dotenv from 'dotenv';
import { MemoryDb } from './db/memory';
import { MySqlDb } from './db/sql';
import { DbConnector } from './db/db_connector';

const config = dotenv.config();
console.log('Loaded env', config.parsed);

if (!(global as any).RuntimeConfiguration) {
    console.log('Configuration not initialized, initializing now');
    
    (global as any).RuntimeConfiguration = {
        port: process.env.PORT || 5000,
        environment: process.env.ENVIRONMENT || 'development',
        data_source: process.env.DATA_SOURCE || 'memory'
    };    
}

if(!(global as any).DatabaseConnector) {
    if((global as any).RuntimeConfiguration.data_source === 'memory') {
        (global as any).DatabaseConnector = new MemoryDb();
    } else {
        (global as any).DatabaseConnector = new MySqlDb();
    }
}

export const DatabaseConnector = (global as any).DatabaseConnector as DbConnector;
export const Config = (global as any).RuntimeConfiguration;
