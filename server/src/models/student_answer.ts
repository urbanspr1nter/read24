import { DataType } from "../db/types";
import { DatabaseConnector } from "../db/connector";
import { BaseResource } from "../db/base_resource";

export interface StudentAnswerType extends DataType {
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

    public static async listByQuizToken(quizToken: string) {
        const studentAnswerTypes = await DatabaseConnector
            .select('studentAnswers', (o: StudentAnswerType) => o.quizToken === quizToken) as StudentAnswerType[];

        return studentAnswerTypes.map(t => new StudentAnswer().load(t.id));
    }
}
