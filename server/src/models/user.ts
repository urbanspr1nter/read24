import { DataRow, BaseResource } from "../db/types";
import { MemoryDb } from "../db/memory";

export interface UserType extends DataRow {
    username: string;
    password: string;
    salt: string;
};

export class User extends BaseResource implements DataRow {
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

    public static findByUsername(username: string) {
        const userType: UserType = MemoryDb.select('users', u => (u as UserType).username === username)[0];
    
        return new User().load(userType.id);
    }
}
