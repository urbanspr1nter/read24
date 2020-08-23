import { IRouter } from "express";
import { Teacher } from "../models/teacher";
import { DEFAULT_PAGE_LIMIT } from "../db/types";
import { User } from "../models/user";

export function mountTeacher(app: IRouter) {
    app.get('/teacher/:teacherId', async (req, res) => {
        const teacherId = parseInt(req.params.teacherId);

        if(!Number.isFinite(teacherId))
        return res.status(400).json({status: 'bad_request', message: 'Invalid teacherId supplied.'});

        const teacher = await new Teacher().load(teacherId);

        if (!teacher.id)
            return res.status(404).json({status: 'not_found', message: 'Could not find teacher with the given ID'});

        const user = await new User().load(teacher.userId);

        return res.status(200).json({
            username: user.username,
            userId: user.id,
            ...teacher.json()
        });
    });

     app.post('/teacher', async (req, res) => {
        const {
            firstName,
            middleName,
            lastName,
            userId
        } = req.body;

        const uid = parseInt(userId);

        if(!Number.isFinite(uid))
            return res.status(400).json({status: 'bad_request', message: 'Must provide a valid user ID'});

        try {
            const user = await new User().load(uid);

            // Make sure there is no conflict
            if (await Teacher.findByUserId(uid))
                return res.status(409).json({status: 'conflict', message: 'A teacher already exists for this user.'});

            const teacher = new Teacher({
                firstName,
                middleName,
                lastName,
                userId: user.id
            });

            await teacher.insert();

            return res.status(200).json({
                id: teacher.id,
                username: user.username
            });
        } catch (e) {
            return res.status(400).json({status: 'bad_request', message: e});
        }
     });

     app.put('/teacher', async (req, res) => {
         const {
            id,
            firstName,
            middleName,
            lastName,
            userId
         } = req.body;

         const uid = parseInt(userId);
         const teacherId = parseInt(id);

         if(!Number.isFinite(uid) || !Number.isFinite(teacherId))
            return res.status(400).json({status: 'bad_request', message: 'Must provide a numeric ID for teacher and user'});

        const teacher = await new Teacher().load(teacherId);

        if (teacher.userId !== uid)
            return res.status(400).json({status: 'bad_request', message: 'User ID does not match what is stored.'});

        teacher.firstName = firstName;
        teacher.middleName = middleName;
        teacher.lastName = lastName;

        await teacher.update();

        return res.status(200).json({
          firstName: teacher.firstName,
          middleName: teacher.middleName,
          lastName: teacher.lastName  
        })
     });

    app.delete('/teacher/:teacherId', async (req, res) => {
         const {
             teacherId
         } = req.params;

         const tid = parseInt(teacherId);

         if (!Number.isFinite(tid))
            return res.status(400).json({status: 'bad_request', message: 'Must provide a numeric ID for the teacher'});

        const teacher = await new Teacher().load(tid);

        teacher.delete();

        return res.status(200).json({
            id: teacher.id,
            dateDeleted: new Date(teacher.dateDeleted)
        });
     });

    app.get('/teacher/list/all', async (req, res) => {
        const teachers = await Teacher.listAllTeachersNoLimit();

        return res.status(200).json({
            teachers: teachers.map(t => t.json())
        });
    });

    app.get('/teacher/list/page/:page', async (req, res) => {
        const {
            page
        } = req.params;

        const pageNumber = parseInt(page);

        if (!Number.isFinite(pageNumber) || pageNumber === 0)
            return res.status(400).json({status: 'bad_request', message: 'Invalid page number'});

        const offset = (pageNumber - 1) * DEFAULT_PAGE_LIMIT;
        const numberOfPages = Math.ceil(await Teacher.numberOfTeachers() / DEFAULT_PAGE_LIMIT);

        const results = await Teacher.listAllTeachers(offset, DEFAULT_PAGE_LIMIT);

        if (results.length === 0)
            return res.status(200).json({
                teachers: [],
                _meta: {
                    hasMore: false,
                    pages: 0
                }
            });

        const lastTeacherId = await Teacher.lastTeacherId();
        const hasMore = !!!results.find(r => r.id === lastTeacherId);
        
        const teachers = results.map(r => r.json());

        return res.status(200).json({
            teachers,
            _meta: {
                hasMore,
                pages: numberOfPages,
                nextPage: hasMore ? page + 1 : undefined
            }
        });
     });
}
