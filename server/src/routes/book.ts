import { IRouter } from "express";
import * as db from '../mockDb.json'

export function mountBook(app: IRouter) {
    app.get('/book/search/title/:bookTitle', (req, res) => {
        const bookTitle = req.params.bookTitle.trim().toLowerCase();
        const books = db.books;

        const results = books.filter(b => b.title.toLowerCase().indexOf(bookTitle) !== -1);
        
        res.status(200).json(results);
    });    

    app.get('/book/search/author/:authorName', (req, res) => {
        const authorName = req.params.authorName.trim().toLowerCase();
        const books = db.books;
        
        const results = books.filter(b => b.author.toLowerCase().indexOf(authorName) !== -1);
        
        res.status(200).json(results);
    });
}
