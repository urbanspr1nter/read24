import { IRouter } from "express";
import { Book } from "../models/book";
import { Question } from "../models/question";

export function mountBook(app: IRouter) {
    app.get('/book/search/all/:page', async (req, res) => {
        const defaultLimit = 2;
        const page = parseInt(req.params.page || '1');

        if (page === 0)
            return res.status(400).json({message: 'Invalid page number'});

        const offset = (page - 1) * defaultLimit;
        
        const pages = Math.ceil((await Book.numberOfPages()) / defaultLimit);
        const results = await Book.listAllBooks(offset, defaultLimit);

        if (results.length === 0)
            return res.status(200).json({
                books: [],
                _meta: {
                    hasMore: false,
                    pages: 0
                }
            });

        const lastBookTitle = await Book.lastBookTitle();
        const hasMore = !!!results.find(r => r.title === lastBookTitle);
        const books = [];
        for(let r of results) {
            const totalQuestions = await Question.totalQuestionsForBookId(r.id);
            const bookSerialized = r.json();
            
            books.push({...bookSerialized, totalQuestions});
        }

        return res.status(200).json({
            books,
            _meta: {
                hasMore,
                pages,
                nextPage: hasMore ? page + 1: undefined
            }
        })
    });

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
