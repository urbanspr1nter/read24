import * as mockDb from '../mockDb.json';
import { Book } from '../models/book';
import { Student } from '../models/student';
import { Classroom } from '../models/classroom';
import { User } from '../models/user';
import { QuizToken } from '../models/quiztoken';
import { Question } from '../models/question';
import { Choice } from '../models/choice';
import { QuizQuestion } from '../models/quiz_question';
import { StudentAnswer } from '../models/student_answer';
import { Rating } from '../models/rating';

interface DataModel {
    classrooms: Classroom[];
    users: User[];
    books: Book[];
    students: Student[];
    quizTokens: QuizToken[];
    questions: Question[];
    choices: Choice[];
    quizQuestions: QuizQuestion[];
    studentAnswers: StudentAnswer[];
    ratings: Rating[];
}

interface InMemoryDatabase {
    loaded: boolean;
    data: DataModel | null;
}

const db: InMemoryDatabase = {
    loaded: true,
    data: mockDb
};

export interface DataObject {
    id: number;
    bookId?: number;
    questionId?: number;
    token?: string;
}

class _MemoryDb {
    public insert(tableName: string, data: DataObject) {
        let maxId = 0;
        const table = db.data[tableName];

        for (const row of table) {
            if (row.id > maxId)
                maxId = row.id;
        }

        maxId++;

        data.id = maxId;

        db.data[tableName].push(data);
    }

    public find(tableName: string, id: number) {
        return db.data[tableName].find((o: DataObject) => o.id === id);
    }

    public select(tableName: string, whereFunc?: (o: DataObject) => boolean) {
        if (!whereFunc)
            return db.data[tableName];

        return db.data[tableName].filter(whereFunc);
    }

    public dump() {
        return db;
    }
}

export const MemoryDb = new _MemoryDb();
