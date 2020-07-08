import { DataRow, BaseResource } from "../db/types";
import { MemoryDb } from "../db/memory";

export interface QuestionType extends DataRow {
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

    public static listByBookId(bookId: number) {
        const data = MemoryDb.select('questions', q => (q as Question).bookId === bookId) as Question[];

        const result = [];

        for (const r of data) {
            result.push(new Question().load(r.id));
        }

        return result;
    }
}
