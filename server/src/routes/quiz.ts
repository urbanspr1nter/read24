import { IRouter } from "express";
import * as uuid from "uuid";
import { QuizToken, QuizStatus } from "../models/quiztoken";
import { Question } from "../models/question";
import { Choice } from "../models/choice";
import { QuizQuestion } from "../models/quiz_question";
import { StudentAnswer } from "../models/student_answer";
import { Rating } from "../models/rating";

function buildQuiz(bookId: number) {
    const result = Question.listByBookId(bookId)
        .map(q => ({
            question: q.json(),
            choices: Choice.listByQuestionId(q.id).map(c => c.json())
        }));

    return result;
}

export function mountQuiz(app: IRouter) {
    app.post('/quiz/book', (req, res) => {
        const bookId = req.body.bookId;
        const studentId = req.body.studentId;
        const token = uuid.v4();

        const quizToken = new QuizToken({
            status: QuizStatus.Incomplete,
            bookId,
            studentId,
            token
        });
        quizToken.insert();

        const quiz = buildQuiz(bookId);

        // Associate each question with the quiz
        for(const el of quiz) {
            const quizQuestion = new QuizQuestion({
                quizToken: token,
                questionId: el.question.id
            });

            quizQuestion.insert();
        }

       return res.status(200).json({token, quiz});
    });

    app.post('/quiz/book/question', (req, res) => {
        const quizToken = req.body.quizToken;
        const choiceId = req.body.choiceId;

        if (!quizToken || !choiceId)
            return res.status(400).json({message: 'Must provide both the quiz token, and choice.'});

        const qt = QuizToken.findByToken(quizToken);
        const c = new Choice().load(choiceId);

        const studentAnswer = new StudentAnswer({
            quizToken: qt.token,
            studentId: qt.studentId,
            questionId: c.questionId,
            choiceId: c.id
        });
        studentAnswer.insert();

        return res.status(200).json(studentAnswer.json());
    });

    app.post('/quiz/book/rate', (req, res) => {
        const quizToken = req.body.quizToken;
        const rating = req.body.rating;

        const r = new Rating({
            quizToken,
            rating
        });
        r.insert();

        return res.status(200).json(r.json());
    });

    app.post('/quiz/status', (req, res) => {
        const quizToken = req.body.quizToken;
        const status = parseInt(req.body.status, 10);

        const original = QuizToken.findByToken(quizToken);
        original.token = quizToken;
        original.status = status;

        original.update(q => (q as QuizToken).token === quizToken);

        return res.status(200).json(original.json());
    });
}
