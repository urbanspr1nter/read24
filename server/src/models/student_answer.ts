import { DataRow, BaseResource } from "../db/types";
import { MemoryDb } from "../db/memory";

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

    public static listByQuizToken(quizToken: string) {
        const studentAnswerTypes = 
            MemoryDb.select('studentAnswers', o => (o as StudentAnswerType).quizToken === quizToken) as StudentAnswerType[];

        return studentAnswerTypes.map(t => new StudentAnswer().load(t.id));
    }
}
