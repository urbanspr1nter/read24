export interface QuestionItem {
    id?: number;
    content: string;
    choices: Map<string, ChoiceItem>;
    delete?: boolean;
}

export interface ChoiceItem {
    id?: number;
    content: string;
    answer: string;
    delete?: boolean;
};

export interface BookItem {
    id?: number;
    title: string;
    fiction: string;
    year: string;
    author: string;
    publisher: string;
    genre: number;
    isbn: string;
    lexile: number;
    wordCount: number;
};
