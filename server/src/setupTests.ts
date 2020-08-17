import {Config} from './config';

Config.data_source = 'memory';
Config.environment = 'test';

import { Classroom } from './models/classroom';
import { User } from './models/user';

export default async function setup() {
    // Add a sample classroom
    await new Classroom({
        name: 'Room 10',
        slug: 'room10'
    }).insert();
    
    await new Classroom({
        name: 'Room 5',
        slug: 'room5'
    }).insert();

    for(let i = 0; i < 5; i++) {
        const username = `User ${i}`;
        const password = `passw0rd_${i}`;

        User.create(username, password);
    }
}


setup();