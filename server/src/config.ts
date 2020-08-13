import * as dotenv from 'dotenv';

const config = dotenv.config();
console.log('Loaded env', config.parsed);

if (!(global as any).RuntimeConfiguration) {
    console.log('Configuration not initialized, initializing now');
    
    (global as any).RuntimeConfiguration = {
        port: process.env.PORT || 5000,
        environment: 'development',
        data_source: 'mysql'
    };    
}

export default (global as any).RuntimeConfiguration;
