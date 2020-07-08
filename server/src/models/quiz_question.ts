import { DataRow, BaseResource } from "../db/types";

export interface QuizQuestionType extends DataRow {
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
}
