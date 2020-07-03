import { IRouter } from "express";

export function mountLogin(app: IRouter) {
    app.post('/login', (req, res) => {
        res.status(200).send(req.body);
    });
}
