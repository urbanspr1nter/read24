import { DataRow, BaseResource } from "../db/types";
import { MemoryDb } from "../db/memory";

export interface QuizTokenType extends DataRow {
    studentId: number;
    bookId: number;
    token: string;
    status: QuizStatus;
};

export class QuizToken
    extends BaseResource
    implements QuizTokenType {

    public studentId: number;
    public bookId: number;
    public token: string;
    public status: QuizStatus;

    constructor(initialProperties?: {[properties: string]: any}) {
        super('quizTokens');

        if (initialProperties) {
            this.studentId = initialProperties.studentId;
            this.bookId = initialProperties.bookId;
            this.token = initialProperties.token;
            this.status = initialProperties.status;
        }
    }

    public static findByToken(token: string) {
        const id = (MemoryDb.select('quizTokens', (o: DataRow) => (o as QuizToken).token === token)[0] as QuizToken).id;

        return new QuizToken().load(id);
    }
}

export enum QuizStatus {
    Incomplete = 0,
    Abandoned = 1,
    Completed = 2
};
