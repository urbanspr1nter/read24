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
