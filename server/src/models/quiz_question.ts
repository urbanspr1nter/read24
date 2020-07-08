import { DataRow, BaseResource } from "../db/types";
import { MemoryDb } from "../db/memory";

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

    public static listByQuizToken(quizToken: string) {
        const quizQuestionTypes = MemoryDb.select('quizQuestions', o => (o as QuizQuestionType).quizToken === quizToken) as QuizQuestionType[];

        return quizQuestionTypes.map(qqt => new QuizQuestion().load(qqt.id));
    }
}
