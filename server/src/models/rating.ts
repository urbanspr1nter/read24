import { DataRow, BaseResource } from "../db/types";

export interface RatingType extends DataRow {
    quizToken: string;
    rating: number;    
};

export class Rating extends BaseResource implements DataRow {
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
