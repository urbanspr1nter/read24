import { IRouter } from "express";
import * as uuid from "uuid";
import { QuizToken, QuizStatus } from "../models/quiztoken";
import { maybeLoadDb } from '../db/memory';

const db = maybeLoadDb();

function buildQuiz(bookId: number) {
    const result = [];
    const questions = db.data.questions.filter(q => q.bookId === bookId);
    for(const q of questions) {
        result.push({
            question: q,
            choices: db.data.choices.filter(c => c.questionId === q.id)
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

        const existing = db.data.quizTokens.find(t => t.id === quizToken.id);

        if (existing)
            db.data.quizTokens = db.data.quizTokens.filter(t => t.id === existing.id).concat(quizToken);
        else
            db.data.quizTokens.push(quizToken);

        const quiz = buildQuiz(bookId);

        // Associate each question with the quiz
        let i = 1;
        for(const el of quiz) {
            db.data.quizQuestions.push({
                id: i++,
                quizToken: token,
                questionId: el.question.id
            });    
        }
        
        res.status(200).json({token, quiz});
    });

    app.post('/quiz/book/question', (req, res) => {
        res.status(200).send(req.body);


    });

    app.post('/quiz/book/rate', (req, res) => {
        res.status(200).send(req.body);
    });
}
