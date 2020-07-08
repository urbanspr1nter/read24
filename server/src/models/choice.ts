import { DataRow, BaseResource } from "../db/types";
import { MemoryDb } from "../db/memory";

export interface ChoiceType extends DataRow {
    questionId: number;
    content: string;
    answer: boolean;
}

export class Choice
    extends BaseResource
    implements ChoiceType {

    public questionId: number;
    public content: string;
    public answer: boolean;

    constructor(initialProperties?: {[properties: string]: any}) {
        super('choices');

        if (initialProperties) {
            this.questionId = initialProperties.questionId;
            this.content = initialProperties.content;
            this.answer = initialProperties.answer;        
        }
    }

    public static listByQuestionId(questionId: number): Choice[] {
        const choiceIds = MemoryDb.select('choices', c => (c as ChoiceType).questionId === questionId).map((c: ChoiceType) => c.id);

        const choices = [];
        for(const id of choiceIds) {
            choices.push(new Choice().load(id));
        }

        return choices;
    }
}
