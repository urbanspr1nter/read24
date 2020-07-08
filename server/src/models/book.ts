import { DataRow, BaseResource } from "../db/types";
import { MemoryDb } from "../db/memory";

export interface BookType extends DataRow {
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

    public static listAllBooksByRelevantTitles(title: string) {
        const books: BookType[] = MemoryDb.select('books', b => (b as BookType).title.toLowerCase().indexOf(title) !== -1);

        return books.map(b => new Book().load(b.id));
    }

    public static listAllBooksByRelevantAuthor(author: string) {
        const books: BookType[] = MemoryDb.select('books', b => (b as BookType).author.toLowerCase().indexOf(author) !== -1);

        return books.map(b => new Book().load(b.id));
    }
}