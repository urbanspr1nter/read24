import { IRouter } from "express";
import { Book } from "../models/book";

export function mountBook(app: IRouter) {
    app.get('/book/search/title/:bookTitle', (req, res) => {
        const bookTitle = req.params.bookTitle.trim().toLowerCase();
        const results = Book.listAllBooksByRelevantTitles(bookTitle);
        
        return res.status(200).json(results.map(r => r.json()));
    });    

    app.get('/book/search/author/:authorName', (req, res) => {
        const authorName = req.params.authorName.trim().toLowerCase();
        const results = Book.listAllBooksByRelevantAuthor(authorName);
                
        return res.status(200).json(results.map(r => r.json()));
    });
}
