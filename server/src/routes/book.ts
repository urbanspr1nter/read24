import { IRouter } from "express";
import { MemoryDb } from "../db/memory";
import { Book } from "../models/book";

export function mountBook(app: IRouter) {
    app.get('/book/search/title/:bookTitle', (req, res) => {
        const bookTitle = req.params.bookTitle.trim().toLowerCase();
        const books = MemoryDb.select('books');

        const results = books.filter((b: Book) => b.title.toLowerCase().indexOf(bookTitle) !== -1);
        
        return res.status(200).json(results);
    });    

    app.get('/book/search/author/:authorName', (req, res) => {
        const authorName = req.params.authorName.trim().toLowerCase();
        const books = MemoryDb.select('books');
        
        const results = books.filter((b: Book) => b.author.toLowerCase().indexOf(authorName) !== -1);
        
        return res.status(200).json(results);
    });
}
