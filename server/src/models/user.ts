import {DatabaseConnector} from '../config';
import { DataType } from "../db/types";
import { BaseResource } from "../db/base_resource";
import { hashPassword } from "../util/util";

export interface UserType extends DataType {
    username: string;
    password: string;
    salt: string;
};

export class User
    extends BaseResource
    implements UserType {
    
    public username: string;
    public password: string;
    public salt: string;

    constructor(initialProperties?: {[property: string]: any}) {
        super('users');

        if (initialProperties) {
            this.username = initialProperties.username;
            this.password = initialProperties.password;
            this.salt = initialProperties.salt;
        }
    }

    public static async findByUsername(username: string) {
        const userType = (await DatabaseConnector.select('users', {
            filters: [
                {
                    column: 'username',
                    value: username
                }
            ]
        }))[0];
    
        return await new User().load(userType.id);
    }

    public static async create(username: string, plainTextPassword: string) {
        const hashed = hashPassword(plainTextPassword);

        const user = new User({
            username,
            password: hashed.hashed,
            salt: hashed.salt
        });
        
        await user.insert();

        return user;
    }
}
