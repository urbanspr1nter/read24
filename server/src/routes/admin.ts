import { IRouter } from "express";

export function mountAdmin(app: IRouter) {
    /**
     * Admin Student Routes
     */

    app.get('/admin/classroom/:classroomId/students', (req, res) => {
        const classroomId = req.params.classroomId;

        return res.status(200).json({classroomId});
    });

    app.post('/admin/classroom/:classroomId/students', (req, res) => {
        const classroomId = req.params.classroomId;

        return res.status(200).json({classroomId});
    });

    app.put('/admin/classroom/:classroomId/students', (req, res) => {
        const classroomId = req.params.classroomId;

        return res.status(200).json({classroomId});
    });

    app.get('/admin/classroom/:classroomId/students/:studentId', (req, res) => {
        const classroomId = req.params.classroomId;
        const studentId = req.params.studentId;

        return res.status(200).json({classroomId, studentId})
    })

    app.delete('/admin/classroom/:classroomId/students/:studentId', (req, res) => {
        const classroomId = req.params.classroomId;
        const studentId = req.params.studentId;

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
