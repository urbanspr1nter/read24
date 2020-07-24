import { IRouter } from "express";
import { Student } from "../models/student";
import { BookType, Book } from "../models/book";
import { Question, QuestionType } from "../models/question";
import { Choice, ChoiceType } from "../models/choice";
import { hashPassword } from "../util/util";
import { User } from "../models/user";

interface BookQuiz {
    book: BookType,
    quiz: QuizDatum[]
};

interface QuizDatum {
    question: QuestionType,
    choices: ChoiceType[]
};

async function saveBookAsQuiz(body: BookQuiz) {
    const book = await new Book(body.book).insert();

    for (const d of body.quiz) {
        const question = d.question;
        const choices = d.choices;

        const questionResource = await new Question({
            ...question,
            bookId: book.id
        }).insert();
        
        for (const c of choices) {
            await new Choice({
                ...c,
                questionId: questionResource.id
            }).insert();
        }
    }
}

async function readBookAsQuiz(bookId: number) {
    const book = await new Book().load(bookId);

    const questions = await Question.listByBookId(book.id);

    const result = { book, quiz: [] };

    for (const q of questions) {
        const item = {question: q.json(), choices: []};

        const choices = await Choice.listByQuestionId(q.id);
        item.choices = choices.map(c => c.json());

        result.quiz.push(item)
    }

    return result;
}

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
     app.post('/admin/quiz/import', (req, res) => {
         return res.status(200).json({});
     });

     app.put('/admin/quiz/import', (req, res) => {
         return res.status(200).json({});
     });

     app.get('/admin/quiz/book/:bookId', (req, res) => {
         const bookId = req.params.bookId;

         return res.status(200).json({bookId});
     });

     app.delete('/admin/quiz/book/:bookId', (req, res) => {
         const bookId = req.params.bookId;

         return res.status(200).json({bookId});
     });
}
