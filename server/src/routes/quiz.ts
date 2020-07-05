import { IRouter } from "express";
import * as uuid from "uuid";
import { QuizToken, QuizStatus } from "../models/quiztoken";
import { MemoryDb } from "../db/memory";

function buildQuiz(bookId: number) {
    const result = [];
    const questions = MemoryDb.select('questions', q => q.bookId === bookId);
    for(const q of questions) {
        result.push({
            question: q,
            choices: MemoryDb.select('choices', c => c.questionId === q.id)
        });
    }

    return result;
}

export function mountQuiz(app: IRouter) {
    app.post('/quiz/book', (req, res) => {
        const bookId = req.body.bookId;
        const studentId = req.body.studentId;
        const token = uuid.v4();

        const quizToken: QuizToken = {
            id: 1,
            status: QuizStatus.Incomplete,
            bookId,
            studentId,
            token
        };

        MemoryDb.insert('quizTokens', quizToken);

        const quiz = buildQuiz(bookId);

        // Associate each question with the quiz
        let i = 1;
        for(const el of quiz) {
            const quizQuestion = {
                id: i++,
                quizToken: token,
                questionId: el.question.id
            };

            MemoryDb.insert('quizQuestions', quizQuestion);
        }
        
        return res.status(200).json({token, quiz});
    });

    app.post('/quiz/book/question', (req, res) => {
        const quizToken = req.body.quizToken;
        const choiceId = req.body.choiceId;

        if (!quizToken || !choiceId)
            return res.status(400).json({message: 'Must provide both the quiz token, and choice.'});

        const qt = MemoryDb.select('quizTokens', t => t.token === quizToken)[0];
        const c = MemoryDb.select('choices', c => c.id === choiceId);

        const studentAnswer = {
            id: 1,
            quizToken: qt.token,
            studentId: qt.studentId,
            questionId: c.questionId,
            choiceId: c.id
        };

        MemoryDb.insert('studentAnswers', studentAnswer);

        return res.status(200).json(studentAnswer);
    });

    app.post('/quiz/book/rate', (req, res) => {
        const quizToken = req.body.quizToken;
        const rating = req.body.rating;

        const r = {
            id: 1,
            quizToken,
            rating
        };

        MemoryDb.insert('ratings', r);

        return res.status(200).json(r);
    });
}
