import { IRouter } from "express";
import { Student } from "../models/student";
import { Book } from "../models/book";
import { Question } from "../models/question";
import { Choice } from "../models/choice";
import { hashPassword, errorStatusToHttpCode } from "../util/util";
import { User } from "../models/user";
import { Classroom } from "../models/classroom";

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

     app.get('/admin/quiz/book/:bookId', async (req, res) => {
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

     app.delete('/admin/quiz/book/:bookId', async (req, res) => {
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

     /**
      * Admin Classroom routes
      */
     const DEFAULT_LIMIT = 2;

     app.get('/admin/classroom/all/page/:page', async (req, res) => {
        let page = 1;
        if (req.params.page)
            page = parseInt(req.params.page);

        if (page === 0)
            return res.status(400).json({message: 'Invalid page number'});

        const offset = (page - 1) * DEFAULT_LIMIT;

        const pages = Math.ceil(await Classroom.numberOfPages()) / DEFAULT_LIMIT;
        const results = await Classroom.listClassrooms(offset, DEFAULT_LIMIT);

        if (results.length === 0)
            return res.status(200).json({
                classrooms: [],
                _meta: {
                    hasMore: false,
                    pages: 0
                }
            });

        const lastClassromName = await Classroom.lastClassroomName();
        const hasMore = !!!results.find(r => r.name === lastClassromName);
        
        return res.status(200).json({
            classrooms: results.map(r => r.json()),
            _meta: {
                hasMore,
                pages,
                nextPage: hasMore ? page + 1 : undefined
            }
        });
     });

     app.get('/admin/classroom/:classroomId', async (req, res) => {
         const classroomId = parseInt(req.params.classroomId);

         if (!Number.isFinite(classroomId))
            return res.status(400).json({message: 'Invalid classroom ID'});

        const classroom = await new Classroom().load(classroomId);

        return res.status(200).json({
            id: classroom.id,
            name: classroom.name,
            slug: classroom.slug
        });
     });

     app.post('/admin/classroom', async (req, res) => {
         const name = req.body.name;
         const slug = req.body.slug;

         if (await Classroom.findBySlugIgnoreNotFound(slug))
            return res.status(400).json({message: 'Slug already exists'});

        const newClassroom = await new Classroom({
            name,
            slug
        }).insert();

        return res.status(200).json({id: newClassroom.id});
     });

     app.put('/admin/classroom', async (req, res) => {
         const id = parseInt(req.body.id);

         if (!Number.isFinite(id))
            return res.status(400).json({message: 'Invalid classroom ID'});

        const name = req.body.name;
        const slug = req.body.slug;

        const classroom = await Classroom.findBySlugIgnoreNotFound(slug);
        if (classroom && classroom.id !== id)
            return res.status(400).json({message: 'Invalid slug. Another classroom has already taken this'});

        classroom.name = name;
        classroom.slug = slug;
        classroom.update();

        return res.status(200).json({
            id: classroom.id,
            slug: classroom.slug,
            name: classroom.name
        });
     });

     app.delete('/admin/classroom/:classroomId', async (req, res) => {
         const id = parseInt(req.params.classroomId);

         if (!Number.isFinite(id))
            return res.status(400).json({message: 'Invalid classroom ID'});

        const classroom = await new Classroom().load(id);
        classroom.delete();

        return res.status(200).json({
            id: classroom.id,
            dateDeleted: new Date(classroom.dateDeleted)
        });
     });
}
