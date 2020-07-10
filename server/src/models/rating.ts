import { DataType } from "../db/types";
import { BaseResource } from "../db/base_resource";

export interface RatingType extends DataType {
    quizToken: string;
    rating: number;    
};

export class Rating
    extends BaseResource
    implements RatingType {
    
    public quizToken: string;
    public rating: number;

    constructor(initialProperties?: {[properties: string]: any}) {
        super('ratings');

        if (initialProperties) {
            this.quizToken = initialProperties.quizToken;
            this.rating = initialProperties.rating;
        }
    }
}
