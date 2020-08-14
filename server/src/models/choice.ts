import {DatabaseConnector} from '../config';
import { DataType } from "../db/types";
import { BaseResource } from "../db/base_resource";

export interface ChoiceType extends DataType {
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

    public static async listByQuestionId(questionId: number): Promise<Choice[]> {
        const choiceIds = (await DatabaseConnector.select('choices', {
            filters: [
                {
                    column: 'questionId',
                    value: questionId
                }
            ]
        })).map((c: ChoiceType) => c.id);

        const choices = [];
        for(const id of choiceIds) {
            choices.push(await new Choice().load(id));
        }

        return choices;
    }
}
