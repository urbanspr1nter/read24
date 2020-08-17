import { DataType } from "../db/types";
import { BaseResource } from "../db/base_resource";
import { DatabaseConnector } from "../config";
import { AggregateType } from "../db/connector";
import { User } from "./user";

export interface TeacherType extends DataType {
    firstName: string;
    middleName: string;
    lastName: string;
    userId: number;
};

export class Teacher extends BaseResource implements TeacherType {
    public firstName: string;
    public middleName: string;
    public lastName: string; 
    public userId: number;

    constructor(initialProperties?: {[properties: string]: any}) {
        super('teachers');

        if (initialProperties) {
            this.firstName = initialProperties.firstName;
            this.middleName = initialProperties.middleName;
            this.lastName = initialProperties.lastName;
            this.userId = initialProperties.userId;
        }
    }

    public static async findByUserId(userId: number) {
        const teacher = (await DatabaseConnector.select('teachers', {
            filters: [{
                column: 'userId',
                value: userId
            }]
        }))[0];

        return teacher;
    }

    public static async numberOfTeachers() {
        const results = await DatabaseConnector.select('teachers', {
            aggregate: {
                type: AggregateType.Count,
                column: 'id',
                alias: 'count'
            }
        });

        return Number(results[0]['count']);
    }

    public static async listAllTeachersNoLimit() {
        const results = await DatabaseConnector.select('teachers', {
            orderBy: {
                ascending: true,
                column: 'firstName'
            }
        });

        return await Promise.all(results.map(async t => await new Teacher().load(t.id)));
    }

    public static async listAllTeachers(offset: number, limit: number) {
        const results = await DatabaseConnector.select('teachers', {
            limit,
            offset,
            orderBy: {
                ascending: true,
                column: 'id'
            }
        });

        return await Promise.all(results.map(async t => await new Teacher().load(t.id)));
    }

    public static async lastTeacherId() {
        const results = await DatabaseConnector.select('teachers', {
            limit: 1,
            orderBy: {
                ascending: false,
                column: 'id'
            }
        });

        return results[0].id;
    }

    public static async listAllUsersAsTeachers() {
        const results = await DatabaseConnector.select('teachers', {
            columns: ['id', 'userId']
        });

        const users = results.map(async r => await new User().load(r.userId));

        return Promise.all(users);
    }
}