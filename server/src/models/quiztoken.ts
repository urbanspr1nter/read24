import {DatabaseConnector} from '../config';
import { DataType } from "../db/types";
import { BaseResource } from "../db/base_resource";

export interface QuizTokenType extends DataType {
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

    public static async findByToken(token: string) {
        const id = (await DatabaseConnector.select('quizTokens', {
            filters: [
                {
                    column: 'token',
                    value: token
                }
            ]
        }))[0].id;

        return await new QuizToken().load(id);
    }

    public static async listByStudentId(studentId: number) {
        const ids = (await DatabaseConnector.select('quizTokens', {
            filters: [
                {
                    column: 'studentId',
                    value: studentId
                }
            ]
        })).map(q => q.id);

        return ids.map(id => new QuizToken().load(id));
    }
}

export enum QuizStatus {
    Incomplete = 0,
    Abandoned = 1,
    Completed = 2
};
