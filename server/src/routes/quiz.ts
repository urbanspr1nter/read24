import { IRouter } from "express";

export function mountQuiz(app: IRouter) {
    app.post('/quiz/book', (req, res) => {
        res.status(200).send(req.body);
    });

    app.post('/quiz/book/question', (req, res) => {
        res.status(200).send(req.body);
    });

    app.post('/quiz/book/rate', (req, res) => {
        res.status(200).send(req.body);
    });
}
