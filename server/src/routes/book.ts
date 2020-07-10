import { IRouter } from "express";
import { Book } from "../models/book";

export function mountBook(app: IRouter) {
    app.get('/book/search/title/:bookTitle', async (req, res) => {
        const bookTitle = req.params.bookTitle.trim().toLowerCase();
        const results = await Book.listAllBooksByRelevantTitles(bookTitle);
        
        return res.status(200).json(results.map(r => r.json()));
    });    

    app.get('/book/search/author/:authorName', async (req, res) => {
        const authorName = req.params.authorName.trim().toLowerCase();
        const results = await Book.listAllBooksByRelevantAuthor(authorName);
                
        return res.status(200).json(results.map(r => r.json()));
    });
}
