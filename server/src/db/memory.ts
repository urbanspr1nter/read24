import * as mockDb from '../mockDb.json';
import { BookType } from '../models/book';
import { StudentType } from '../models/student';
import { ClassroomType } from '../models/classroom';
import { UserType } from '../models/user';
import { QuizTokenType } from '../models/quiztoken';
import { QuestionType } from '../models/question';
import { ChoiceType } from '../models/choice';
import { QuizQuestionType } from '../models/quiz_question';
import { StudentAnswerType } from '../models/student_answer';
import { RatingType } from '../models/rating';
import { DataRow } from './types';

interface DataModel {
    classrooms: ClassroomType[];
    users: UserType[];
    books: BookType[];
    students: StudentType[];
    quizTokens: QuizTokenType[];
    questions: QuestionType[];
    choices: ChoiceType[];
    quizQuestions: QuizQuestionType[];
    studentAnswers: StudentAnswerType[];
    ratings: RatingType[];
}

interface InMemoryDatabase {
    loaded: boolean;
    data: DataModel | null;
}

const db: InMemoryDatabase = {
    loaded: true,
    data: mockDb
};

class _MemoryDb {
    public insert(tableName: string, data: DataRow) {
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

    public update(tableName: string, data: object, whereFunc: (o: DataRow) => boolean) {
        if (db.data[tableName].length === 0)
            return 0;

        const rows = db.data[tableName].filter(whereFunc);

        for (const row of rows) {
            const id = row.id;

            Object.assign(row, data);

            // Keep the old id
            row.id = id;
        }

        return rows.length;
    }

    public find(tableName: string, id: number) {
        return db.data[tableName].find((o: DataRow) => o.id === id);
    }

    public select(tableName: string, whereFunc?: (o: DataRow) => boolean) {
        if (!whereFunc)
            return db.data[tableName];

        return db.data[tableName].filter(whereFunc);
    }

    public dump() {
        return db;
    }
}

export const MemoryDb = new _MemoryDb();
