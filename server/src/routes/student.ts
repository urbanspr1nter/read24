import { IRouter } from "express";

export function mountStudent(app: IRouter) {
    app.post('/student/report', (req, res) => {
        res.status(200).send(req.body);
    });
}
