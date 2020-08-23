import { IRouter } from "express";
import { Student } from "../models/student";
import { hashPassword } from "../util/util";
import { User } from "../models/user";
import { DEFAULT_PAGE_LIMIT } from "../db/types";
import { Classroom } from "../models/classroom";
import { TeacherClassroom } from "../models/teacher_classroom";

export function mountClassroom(app: IRouter) {
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


    app.get('/classroom/list/page/:page', async (req, res) => {
        let page = 1;
        if (req.params.page)
            page = parseInt(req.params.page);

        if (page === 0)
            return res.status(400).json({message: 'Invalid page number'});

        const offset = (page - 1) * DEFAULT_PAGE_LIMIT;

        const pages = Math.ceil(await Classroom.numberOfPages() / DEFAULT_PAGE_LIMIT);
        const results = await Classroom.listClassrooms(offset, DEFAULT_PAGE_LIMIT);

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

     app.get('/classroom/:classroomId', async (req, res) => {
        const classroomId = parseInt(req.params.classroomId);

        if (!Number.isFinite(classroomId))
           return res.status(400).json({message: 'Invalid classroom ID'});

       const classroom = await new Classroom().load(classroomId);
       const teacher = await TeacherClassroom.findTeacherByClassroomId(classroom.id);

       return res.status(200).json({
           id: classroom.id,
           name: classroom.name,
           slug: classroom.slug,
           teacherId: teacher ? teacher.id : 0
       });
    });

    app.post('/classroom', async (req, res) => {
        const name = req.body.name;
        const slug = req.body.slug;
        const teacherId = parseInt(req.body.teacherId);

        if (!Number.isFinite(teacherId))
           return res.status(400).json({status: 'bad_request', message: 'Must provide a number for the teacher ID'});

        if (await Classroom.findBySlugIgnoreNotFound(slug))
           return res.status(400).json({message: 'Slug already exists'});

       const newClassroom = await new Classroom({
           name,
           slug
       }).insert();

       await new TeacherClassroom({
           teacherId,
           classroomId: newClassroom.id
       }).insert();

       return res.status(200).json({id: newClassroom.id});
    });

    app.put('/classroom', async (req, res) => {
        const id = parseInt(req.body.id);

        if (!Number.isFinite(id))
           return res.status(400).json({message: 'Invalid classroom ID'});

       const name = req.body.name;
       const slug = req.body.slug;
       const teacherId = parseInt(req.body.teacherId);

       if (!Number.isFinite(teacherId))
           return res.status(400).json({status: 'bad_request', message: 'Must provide a number for the teacher ID'});

       let classroom = await Classroom.findBySlugIgnoreNotFound(slug);
       if (classroom && classroom.id !== id)
           return res.status(400).json({message: 'Invalid slug. Another classroom has already taken this'});
       
       // Slug has changed
       if (!classroom)
           classroom = await new Classroom().load(id);

       classroom.name = name;
       classroom.slug = slug;
       classroom.update();

       const currentTeacher = await TeacherClassroom.findTeacherByClassroomId(classroom.id);
       
       if (!currentTeacher)
           await new TeacherClassroom({
               classroomId: classroom.id,
               teacherId: teacherId
           }).insert();
       else {
           const teacherClassroom = await TeacherClassroom.findByTeacherAndClassroomId(currentTeacher.id, classroom.id);
           teacherClassroom.teacherId = teacherId;
           teacherClassroom.update();
       }

       return res.status(200).json({
           id: classroom.id,
           slug: classroom.slug,
           name: classroom.name
       });
    });

    app.delete('/classroom/:classroomId', async (req, res) => {
        const id = parseInt(req.params.classroomId);

        if (!Number.isFinite(id))
           return res.status(400).json({message: 'Invalid classroom ID'});

       const classroom = await new Classroom().load(id);
       classroom.delete();

       // Remove the association between the classroom, and teacher.
       const teacher = await TeacherClassroom.findTeacherByClassroomId(classroom.id);
       const teacherClassroom = await TeacherClassroom.findByTeacherAndClassroomId(teacher.id, classroom.id);
       await teacherClassroom.delete();

       return res.status(200).json({
           id: classroom.id,
           dateDeleted: new Date(classroom.dateDeleted)
       });
    });
}
