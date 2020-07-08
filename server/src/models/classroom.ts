import { DataRow, BaseResource } from "../db/types";

export interface ClassroomType extends DataRow {
    name: string;
    slug: string;
};

export class Classroom extends BaseResource implements DataRow {
    public name: string;
    public slug: string;

    constructor(initialProperties?: {[property: string]: any}) {
        super('classrooms');

        if (initialProperties) {
            this.name = initialProperties.name;
            this.slug = initialProperties.slug;
        }
    }
}
