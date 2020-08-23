import { IRouter } from "express";
import * as uuid from "uuid";
import { QuizToken, QuizStatus } from "../models/quiztoken";
import { Question } from "../models/question";
import { Choice } from "../models/choice";
import { QuizQuestion } from "../models/quiz_question";
import { StudentAnswer } from "../models/student_answer";
import { Rating } from "../models/rating";
import { Book } from "../models/book";
import { errorStatusToHttpCode } from "../util/util";

async function buildQuiz(bookId: number) {
    const questions = await Question.listByBookId(bookId);

    const result = [];

    for (let q of questions) {
        const choices = await Choice.listByQuestionId(q.id);
        const serialized = choices.map(c => c.json());
        
        result.push({
            question: q.json(),
            choices: serialized
        });
    }

    return result;
}

export function mountQuiz(app: IRouter) {
    app.post('/quiz/book', async (req, res) => {
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

        const quiz = await buildQuiz(bookId);

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

    app.post('/quiz/book/question', async (req, res) => {
        const quizToken = req.body.quizToken;
        const choiceId = req.body.choiceId;

        if (!quizToken || !choiceId)
            return res.status(400).json({message: 'Must provide both the quiz token, and choice.'});

        const qt = await QuizToken.findByToken(quizToken);
        const c = await new Choice().load(choiceId);

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

    app.post('/quiz/status', async (req, res) => {
        const quizToken = req.body.quizToken;
        const status = parseInt(req.body.status, 10);

        const original = await QuizToken.findByToken(quizToken);
        original.token = quizToken;
        original.status = status;
        original.update();

        return res.status(200).json(original.json());
    });

    app.post('/quiz/import', async (req, res) => {        
        const {
            book,
            questions
        } = req.body;

        const b = await new Book({
            title: book.title,
            fiction: book.fiction === 'true' ? true : false,
            author: book.author,
            year: book.year,
            publisher: book.publisher,
            genre: parseInt(book.genre),
            isbn: book.isbn,
            lexile: parseInt(book.lexile),
            wordCount: parseInt(book.wordCount)
        }).insert();

        for (const q of questions) {
            const content = q.content;
            const bookId = b.id;

            const question = await new Question({
                bookId,
                content
            }).insert();

            for(const c of q.choices) {
                await new Choice({
                    questionId: question.id,
                    content: c.content,
                    answer: c.answer === 'true' ? true : false
                }).insert();
            }
        }

        return res.status(200).json({message: 'Quiz has been created.'});
     });

     app.put('/quiz/import', async (req, res) => {
        const {
            book,
            questions
        } = req.body;

        if (!book.id)
           return res.status(400).json({message: 'Bad request. No book.id provided.'});

       const b = await new Book().load(parseInt(book.id));
       b.title = book.title;
       b.fiction = book.fiction === 'true' ? true : false;
       b.author = book.author;
       b.year = book.year;
       b.publisher = book.publisher;
       b.genre = parseInt(book.genre);
       b.isbn = book.isbn;
       b.lexile = parseInt(book.lexile);
       b.wordCount = parseInt(book.wordCount);

       await b.update();
       
       for(const q of questions) {
           const bookId = b.id;
           const content = q.content;

           let question = null;
           if (q.id) {
               const questionId = parseInt(q.id);

               question = await new Question().load(questionId);
               question.content = content;

               if(q.delete)
                   await question.delete()
               else
                   await question.update();
           } else {
               question = await new Question({
                   bookId,
                   content
               }).insert();
           }

           for(const c of q.choices) {
               const content = c.content;
               const answer = c.answer === 'true' ? true : false;
               let choice = null;
               if (c.id) {
                   const choiceId = parseInt(c.id);

                   choice = await new Choice().load(choiceId);
                   choice.content = content;
                   choice.answer = answer;

                   if (q.delete || c.delete)
                       await choice.delete();
                   else
                       await choice.update();
               } else {
                   choice = await new Choice({
                       questionId: question.id,
                       content: c.content,
                       answer: c.answer === 'true' ? true : false
                   }).insert();
               }
           }
       }
       
        return res.status(200).json({});
    });

    app.get('/quiz/book/:bookId', async (req, res) => {
        const bookId = req.params.bookId;

        try {
            const b = await new Book().load(parseInt(bookId));

            const book = {...b.json(), id: b.id};
            const questions = [];
    
            const qs = await Question.listByBookId(b.id);
            for(const q of qs) {
                const curr = {
                    id: q.id,
                    content: null,
                    choices: []
                };
    
                curr.content = q.content;
    
                const choices = await Choice.listByQuestionId(q.id);
                for(const c of choices) {
                    curr.choices.push({
                        id: c.id,
                        content: c.content,
                        answer: c.answer ? 'true' : 'false'
                    });
                }
    
                questions.push(curr);
            }
    
            return res.status(200).json({book, questions});
        } catch (e) {
            return res.status(errorStatusToHttpCode(e.status)).json(e);
        }
     });

     app.delete('/quiz/book/:bookId', async (req, res) => {
         const bookId = req.params.bookId;

         try {
            const b = await new Book().load(parseInt(bookId));
            const qs = await Question.listByBookId(b.id);
            for (const q of qs) {
                const cs = await Choice.listByQuestionId(q.id);

                for(const c of cs) {
                    await c.delete();
                }

                await q.delete();
            }

            await b.delete();
   
            return res.status(200).json({deletedAt: new Date(b.dateDeleted)});
         } catch (e) {
            return res.status(errorStatusToHttpCode(e.status)).json(e);
         }
     });
}
