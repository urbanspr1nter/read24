import { DataType } from "../db/types";
import { DatabaseConnector } from "../db/connector";
import { BaseResource } from "../db/base_resource";

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
        const userType = (await DatabaseConnector.select('users', (u: UserType) => u.username === username))[0];
    
        return await new User().load(userType.id);
    }
}
