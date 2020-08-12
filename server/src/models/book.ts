import { DataType } from "../db/types";
import { DatabaseConnector, AggregateType } from "../db/connector";
import { BaseResource } from "../db/base_resource";

export interface BookType extends DataType {
    title: string;
    fiction: boolean;
    author: string;
    year: string;
    publisher: string;
    genre: number;
    isbn: string;
    lexile: number;
    wordCount: number;
};

export class Book
    extends BaseResource
    implements BookType {

    public title: string;
    public fiction: boolean;
    public author: string;
    public year: string;
    public publisher: string;
    public genre: number;
    public isbn: string;
    public lexile: number;
    public wordCount: number;

    constructor(initialProperties?: {[property: string]: any}) {
        super('books');

        if (initialProperties) {
            this.title = initialProperties.title;
            this.fiction = initialProperties.fiction;
            this.author = initialProperties.author;
            this.year = initialProperties.year;
            this.publisher = initialProperties.publisher;
            this.genre = initialProperties.genre;
            this.isbn = initialProperties.isbn;
            this.lexile = initialProperties.lexile;
            this.wordCount = initialProperties.wordCount;
        }
    }

    public static async numberOfPages() {
        const results = await DatabaseConnector.select('books', {
            aggregate: {
                type: AggregateType.Count,
                column: 'id',
                alias: 'count(id)'
            }
        });

        return results[0]['count(id)'];
    }
    public static async lastBookTitle() {
        const results = await DatabaseConnector.select('books', {
            limit: 1,
            orderBy: {
                ascending: false,
                column: 'title'
            }
        });

        return results[0].title;
    }

    public static async listAllBooks(offset: number, limit: number) {
        const books = await DatabaseConnector.select('books', {
            limit,
            offset,
            orderBy: {
                ascending: true,
                column: 'title'
            }
        });

        return await Promise.all(books.map(async b => await new Book().load(b.id)));
    }

    public static async numberOfPagesByRelevantTitle(title: string) {
        const results = await DatabaseConnector.select('books', {
            fullTextMatch: [
                {
                    columns: ['title'],
                    value: title
                },
            ],
            aggregate: {
                type: AggregateType.Count,
                column: 'id',
                alias: 'count(id)'
            }
        });

        return results[0]['count(id)'];
    }

    public static async lastBookTitleByRelevantTitle(title: string) {
        const books = await DatabaseConnector.select('books', {
            limit: 1,
            orderBy: {
                column: 'title',
                ascending: false
            },
            fullTextMatch: [
                {
                    columns: ['title'],
                    value: title
                }
            ]
        });

        return books[0].title;
    }

    public static async listAllBooksByRelevantTitles(offset: number, limit: number, title: string) {
        const books = await DatabaseConnector.select('books', {
            offset,
            limit,
            orderBy: {
                column: 'title',
                ascending: true
            },
            fullTextMatch: [
                {
                    columns: ['title'],
                    value: title
                }
            ]
        });

        return await Promise.all(books.map(async b => await new Book().load(b.id)));
    }

    public static async numberOfPagesByRelevantAuthor(author: string) {
        const results = await DatabaseConnector.select('books', {
            fullTextMatch: [
                {
                    columns: ['author'],
                    value: author
                },
            ],
            aggregate: {
                type: AggregateType.Count,
                column: 'id',
                alias: 'count(id)'
            }
        });

        return results[0]['count(id)'];
    }

    public static async lastBookTitleByRelevantAuthor(author: string) {
        const books = await DatabaseConnector.select('books', {
            limit: 1,
            orderBy: {
                column: 'author',
                ascending: false
            },
            fullTextMatch: [
                {
                    columns: ['author'],
                    value: author
                }
            ]
        });

        return books[0].title;
    }

    public static async listAllBooksByRelevantAuthor(offset: number, limit: number, author: string) {
        const books = await DatabaseConnector.select('books', {
            offset,
            limit,
            orderBy: {
                column: 'author',
                ascending: true
            },
            fullTextMatch: [
                {
                    columns: ['author'],
                    value: author
                }
            ]
        });

        return await Promise.all(books.map(async b => await new Book().load(b.id)));
    }
}