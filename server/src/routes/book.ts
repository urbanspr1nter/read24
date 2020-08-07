import { IRouter } from "express";
import { Book } from "../models/book";
import { Question } from "../models/question";

const DEFAULT_LIMIT = 2;

export function mountBook(app: IRouter) {
    app.all([
        '/book/search/all/page/:page',
        '/book/search/title/:bookTitle/page/:page',
        '/book/search/author/:authorName/page/:page'
    ], (req, res, next) => {
        if (req.params.page) {
            const page = parseInt(req.params.page || '1');

            if (page === 0)
                return res.status(400).json({message: 'Invalid page number'});
            
            res.locals.page = page;
    
            const offset = (page - 1) * DEFAULT_LIMIT;
            res.locals.offset = offset;
        } else {
            res.locals.page = 1;
            res.locals.offset = 0;
        }

        return next();
    });

    app.get('/book/search/all/page/:page', async (req, res) => {
        const page = res.locals.page;
        const offset = res.locals.offset;
        
        const pages = Math.ceil((await Book.numberOfPages()) / DEFAULT_LIMIT);
        const results = await Book.listAllBooks(offset, DEFAULT_LIMIT);

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
        });
    });

    app.get('/book/search/title/:bookTitle/page/:page', async (req, res) => {
        const page = res.locals.page;
        const offset = res.locals.offset;
        const bookTitle = req.params.bookTitle.trim().toLowerCase();

        const results = await Book.listAllBooksByRelevantTitles(offset, DEFAULT_LIMIT, bookTitle);

        if (results.length === 0)
            return res.status(200).json({
                books: [],
                _meta: {
                    hasMore: false,
                    pages: 0
                }
            });

        const pages = Math.ceil((await Book.numberOfPagesByRelevantTitle(bookTitle)) / DEFAULT_LIMIT);
        const lastBookTitle = await Book.lastBookTitleByRelevantTitle(bookTitle);
        const hasMore = !!!results.find(r => r.title === lastBookTitle);

        const books = [];
        for (const r of results) {
            const totalQuestions = await Question.totalQuestionsForBookId(r.id);
            const bookSerialized = r.json();

            books.push({...bookSerialized, totalQuestions});
        }
        
        return res.status(200).json({
            books,
            _meta: {
                hasMore,
                pages,
                nextPage: hasMore ? page + 1 : undefined
            }
        });
    });    

    app.get('/book/search/author/:authorName/page/:page', async (req, res) => {
        const page = res.locals.page;
        const offset = res.locals.offset;
        const authorName = req.params.authorName.trim().toLowerCase();

        const results = await Book.listAllBooksByRelevantAuthor(offset, DEFAULT_LIMIT, authorName);

        if (results.length === 0)
        return res.status(200).json({
            books: [],
            _meta: {
                hasMore: false,
                pages: 0
            }
        });

        const pages = Math.ceil((await Book.numberOfPagesByRelevantAuthor(authorName)) / DEFAULT_LIMIT);
        const lastBookTitle = await Book.lastBookTitleByRelevantAuthor(authorName);
        const hasMore = !!!results.find(r => r.title === lastBookTitle);

        const books = [];
        for (const r of results) {
            const totalQuestions = await Question.totalQuestionsForBookId(r.id);
            const bookSerialized = r.json();

            books.push({...bookSerialized, totalQuestions});
        }

        return res.status(200).json({
            books,
            _meta: {
                hasMore,
                pages,
                nextPage: hasMore ? page + 1 : undefined
            }
        });
    });
}
