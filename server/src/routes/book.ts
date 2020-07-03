import { IRouter } from "express";

export function mountBook(app: IRouter) {
    app.get('/book/search/title/:bookTitle', (req, res) => {
        res.status(200).send(`bookTitle: ${req.params.bookTitle}`);
    });    

    app.get('/book/search/author/:authorName', (req, res) => {
        res.status(200).send(`authorName: ${req.params.authorName}`);
    });
}
