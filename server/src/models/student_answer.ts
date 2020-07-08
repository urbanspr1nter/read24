import { DataRow, BaseResource } from "../db/types";

export interface StudentAnswerType extends DataRow {
    quizToken: string;
    studentId: number;
    questionId: number;
    choiceId: number;
};

export class StudentAnswer
    extends BaseResource 
    implements StudentAnswerType {

    public quizToken: string;
    public studentId: number;
    public questionId: number;
    public choiceId: number;

    constructor(initialProperties?: {[properties: string]: any}) {
        super('studentAnswers');

        if (initialProperties) {
            this.quizToken = initialProperties.quizToken;
            this.studentId = initialProperties.studentId;
            this.questionId = initialProperties.questionId;
            this.choiceId = initialProperties.choiceId;
        }
    }
}
