import { DataType } from "../db/types";
import { BaseResource } from "../db/base_resource";

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
}
