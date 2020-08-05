import { DataType } from "../db/types";
import { DatabaseConnector } from "../db/connector";
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
        const results = await DatabaseConnector.select('books', () => true, {
            columns: ['count(id)']
        });

        console.log(results);

        return results[0]['count(id)'];
    }
    public static async lastBookTitle() {
        const results = await DatabaseConnector.select('books', () => true, {
            limit: 1,
            orderBy: {
                ascending: false,
                column: 'title'
            }
        });

        return results[0].title;
    }

    public static async listAllBooks(offset: number, limit: number) {
        const books = await DatabaseConnector.select('books', () => true, {
            limit,
            offset,
            orderBy: {
                ascending: true,
                column: 'title'
            }
        });

        return await Promise.all(books.map(async b => await new Book().load(b.id)));
    }

    public static async listAllBooksByRelevantTitles(title: string) {
        const books = await DatabaseConnector
                        .select('books', (b: BookType) => b.title.toLowerCase().indexOf(title) !== -1) as BookType[];

        return await Promise.all(books.map(async b => await new Book().load(b.id)));
    }

    public static async listAllBooksByRelevantAuthor(author: string) {
        const books = await DatabaseConnector
            .select('books', (b: BookType) => b.author.toLowerCase().indexOf(author) !== -1) as BookType[];

        return await Promise.all(books.map(async b => await new Book().load(b.id)));
    }
}