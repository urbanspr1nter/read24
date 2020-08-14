import {DatabaseConnector} from '../config';
import { DataType } from "../db/types";
import { BaseResource } from "../db/base_resource";

export interface QuizQuestionType extends DataType {
    quizToken: string;
    questionId: number;
};

export class QuizQuestion
    extends BaseResource
    implements QuizQuestionType {

    public quizToken: string;
    public questionId: number;

    constructor(initialProperties?: {[properties: string]: any}) {
        super('quizQuestions');

        if (initialProperties) {
            this.quizToken = initialProperties.quizToken;
            this.questionId = initialProperties.questionId;
        }
    }

    public static async listByQuizToken(quizToken: string) {
        const quizQuestionTypes = await DatabaseConnector
            .select('quizQuestions', {
                filters: [
                    {
                        column: 'quizToken',
                        value: quizToken
                    }
                ]
            }) as QuizQuestionType[];

        return quizQuestionTypes.map(qqt => new QuizQuestion().load(qqt.id));
    }
}
