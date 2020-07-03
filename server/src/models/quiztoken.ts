export interface QuizToken {
    id: number;
    studentId: number;
    bookId: number;
    token: string;
    status: QuizStatus;
};

export enum QuizStatus {
    Incomplete = 0,
    Abandoned = 1,
    Completed = 2
};
