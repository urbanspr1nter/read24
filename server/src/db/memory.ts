import * as mockDb from '../mockDb.json';
import { Book } from '../models/book';
import { Student } from '../models/student';
import { Classroom } from '../models/classroom';
import { User } from '../models/user';
import { QuizToken } from '../models/quiztoken';
import { Question } from '../models/question';
import { Choice } from '../models/choice';
import { QuizQuestion } from '../models/quiz_question';

interface DataModel {
    classrooms: Classroom[];
    users: User[];
    books: Book[];
    students: Student[];
    quizTokens: QuizToken[];
    questions: Question[];
    choices: Choice[];
    quizQuestions: QuizQuestion[];
}

interface InMemoryDatabase {
    loaded: boolean;
    data: DataModel | null;
}

const db: InMemoryDatabase = {
    loaded: false,
    data: null
};

export function maybeLoadDb() {
    if (db.loaded)
        return db;

    db.data = mockDb;
    db.loaded = true;

    return db;
}
