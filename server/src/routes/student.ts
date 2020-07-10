import { IRouter } from "express";
import { QuizToken, QuizStatus } from "../models/quiztoken";
import { Student, StudentType } from "../models/student";
import { Book } from "../models/book";
import { QuizQuestion } from "../models/quiz_question";
import { StudentAnswer } from "../models/student_answer";
import { Choice } from "../models/choice";

interface StudentReportQuizResult {
    token: string;
    dateCreated: number;
    totalQuestions: number;
    totalCorrect: number;
}
interface StudentReportBookItem {
    title: string;
    author: string;
    wordCount: number;
    lexile: number;
}
interface StudentReportItem {
    passed: boolean;
    book: StudentReportBookItem;
    quiz: StudentReportQuizResult;
}
interface StudentReport {
    student: StudentType;
    data: StudentReportItem[];
}

const MINIMUM_PASSING_GRADE = 0.7;

export function mountStudent(app: IRouter) {
    app.get('/student/report/:studentId', async (req, res) => {
        const studentId = parseInt(req.params.studentId, 10);

        // Pull data from the database. Only process quiz sessions which have been
        // completed.
        const student = (await new Student().load(studentId)).json() as StudentType;
        const quizTokens = (await Promise.all((await QuizToken
            .listByStudentId(studentId))))
            .filter(qt => qt.status === QuizStatus.Completed);

        // Build the report
        const reportItems: StudentReportItem[] = []
        for(const qt of quizTokens) {
            const book = await new Book().load(qt.bookId);
            const bookItem: StudentReportBookItem = {
                title: book.title,
                author: book.author,
                wordCount: book.wordCount,
                lexile: book.lexile
            };

            const dateCreated = qt.dateCreated || 0;
            const totalQuestions = (await QuizQuestion.listByQuizToken(qt.token)).length;
            const totalCorrect = (await Promise.all((await StudentAnswer
                .listByQuizToken(qt.token))))
                    .map(async sa => await new Choice().load(sa.choiceId))
                .filter(async c => (await c).answer).length;
            const passed = (totalCorrect / totalQuestions) >= MINIMUM_PASSING_GRADE;

            reportItems.push({
                passed,
                book: bookItem,
                quiz: {
                    token: qt.token,
                    dateCreated,
                    totalQuestions,
                    totalCorrect
                }
            });
        }

        // Send the final report
        return res.status(200).json({
            student,
            data: reportItems
        } as StudentReport);
    });
}
