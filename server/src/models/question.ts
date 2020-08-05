import { DataType } from "../db/types";
import { DatabaseConnector } from "../db/connector";
import { BaseResource } from "../db/base_resource";

export interface QuestionType extends DataType {
    bookId: number;
    content: string;
};

export class Question
    extends BaseResource
    implements QuestionType {
    
    public bookId: number;
    public content: string;

    constructor(initialProperties?: {[properties: string] : any}) {
        super('questions');

        if (initialProperties) {
            this.bookId = initialProperties.bookId;
            this.content = initialProperties.content;
        }
    }

    public static async totalQuestionsForBookId(bookId: number) {
        const data = await DatabaseConnector.select('questions', () => true, {
            columns: ['count(id)'],
            filters: [{
                column: 'bookId',
                value: String(bookId)
            }]
        });

        return data[0]['count(id)'];
    }

    public static async listByBookId(bookId: number): Promise<Question[]> {
        const data = await DatabaseConnector.select('questions', (q: QuestionType) => q.bookId === bookId) as QuestionType[];

        const result: Question[] = [];

        for (const r of data) {
            result.push(await new Question().load(r.id));
        }

        return result;
    }
}
