import { DataType } from "../db/types";
import { BaseResource } from "../db/base_resource";
import { DatabaseConnector } from "../db/connector";

export interface ClassroomType extends DataType {
    name: string;
    slug: string;
};

export class Classroom 
    extends BaseResource
    implements ClassroomType {
    
    public name: string;
    public slug: string;

    constructor(initialProperties?: {[property: string]: any}) {
        super('classrooms');

        if (initialProperties) {
            this.name = initialProperties.name;
            this.slug = initialProperties.slug;
        }
    }

    static async numberOfPages() {
        const count = await DatabaseConnector.select('classrooms', {
            columns: ['count(id)']
        });

        return count[0]['count(id)'];
    }

    static async lastClassroomName() {
        const classroom = await DatabaseConnector.select('classrooms', {
            orderBy: {
                column: 'name',
                ascending: false
            },
            limit: 1
        });

        return classroom[0].name;
    }

    static async listClassrooms(offset: number, limit: number) {
        const classrooms = await DatabaseConnector.select('classrooms', {
            limit,
            offset,
            orderBy: {
                column: 'name',
                ascending: true
            }
        });

        return await Promise.all(classrooms.map(async c => await new Classroom().load(c.id)));
    }

    static async findBySlugIgnoreNotFound(slug: string): Promise<Classroom> {
        const classroom = await DatabaseConnector.select('classrooms', {
            filters: [{column: 'slug', value: slug}]
        });

        if (classroom.length > 0)
            return Promise.resolve(new Classroom().load(classroom[0].id));

        return Promise.resolve(undefined);
    }
}
