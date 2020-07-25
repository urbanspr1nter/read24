import { IRouter } from "express";
import { Student } from "../models/student";
import { Book } from "../models/book";
import { Question } from "../models/question";
import { Choice } from "../models/choice";
import { hashPassword } from "../util/util";
import { User } from "../models/user";

export function mountAdmin(app: IRouter) {
    /**
     * Admin Student Routes
     */

    app.get('/admin/classroom/:classroomId/students', async (req, res) => {
        const classroomId = parseInt(req.params.classroomId);

        const students = (await Student.listByClassroomId(classroomId)).map(s => s.json());

        return res.status(200).json(students);
    });

    app.post('/admin/classroom/:classroomId/students', async (req, res) => {
        const classroomId = req.params.classroomId;
        const {
            firstName,
            middleName,
            lastName,
            grade,
            username,
            password
        } = req.body;

        const hashedObj = hashPassword(password);

        const user = await (new User({
            username,
            salt: hashedObj.salt,
            password: hashedObj.hashed
        })).insert();

        const student = await (new Student({
            classroomId,
            firstName,
            middleName,
            lastName,
            grade: parseInt(grade, 10),
            userId: user.id
        })).insert();

        return res.status(200).json(student.json());
    });

    app.put('/admin/classroom/:classroomId/students', async (req, res) => {
        const {
            studentId,
            firstName,
            lastName,
            middleName,
            grade    
        } = req.body;

        if(!studentId)
            return res.status(404).json({message: 'Not found'});

        const student = await new Student().load(studentId);

        student.firstName = firstName;
        student.lastName = lastName;
        student.middleName = middleName;
        student.grade = parseInt(grade, 10);

        await student.update();

        return res.status(200).json(student.json());
    });

    app.get('/admin/classroom/:classroomId/students/:studentId', async (req, res) => {
        const classroomId = parseInt(req.params.classroomId, 10);
        const studentId = parseInt(req.params.studentId, 10);

        const student = (await new Student().load(studentId)).json();

        if(student.classroomId !== classroomId)
            return res.status(404).send({message: 'Student not found'});        

        return res.status(200).json(student);
    })

    app.delete('/admin/classroom/:classroomId/students', async (req, res) => {
        const classroomId = req.params.classroomId;
        const studentId = parseInt(req.body.studentId);

        const deleted = (await new Student().load(studentId)).delete();

        return res.status(200).json({classroomId, studentId});
    });

    /**
     * Admin Quiz Routes
     */
     app.post('/admin/quiz/import', async (req, res) => {        
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

     app.put('/admin/quiz/import', async (req, res) => {
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

     app.get('/admin/quiz/book/:bookId', async (req, res) => {
        const bookId = req.params.bookId;

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
     });

     app.delete('/admin/quiz/book/:bookId', (req, res) => {
         const bookId = req.params.bookId;

         return res.status(200).json({bookId});
     });
}
