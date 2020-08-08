import React, { SyntheticEvent } from 'react';
import TextField from './TextField';
import SelectBox from './SelectBox';
import { BookItem } from '../common/types';

export enum BookFormAction {
    Add = 0,
    Edit = 1
};

interface BookFormProps {
    formAction: BookFormAction;
    book: BookItem;
    onBookChange: (e: SyntheticEvent) => void;
};

export default function BookForm(props: BookFormProps) {
    const {
        formAction,
        book,
        onBookChange
    } = props;

    return (
        <div className="book-form container">
            <div className="row">
                <div className="col col-lg">
                    <h1>
                        {formAction === BookFormAction.Add ? 'Add' : 'Edit'}  a Book
                    </h1>
                </div>
            </div>
            <div className="row">
                <div className="col col-md">
                    <TextField label="Title" id="book-title" onChange={onBookChange} value={book.title} />
                </div>
                <div className="col col-md">
                    <TextField label="Author" id="book-author" onChange={onBookChange} value={book.author} />
                </div>
                <div className="col col-sm">
                    <TextField label="Year" id="book-year" onChange={onBookChange} value={book.year} />
                </div>
            </div>
            <div className="row">
                <div className="col col-md">
                    <SelectBox label="Fiction" id="book-fiction" onChange={onBookChange} options={[
                            {value: 'nonfiction', label: 'Non Fiction', selected: true},
                            {value: 'fiction', label: 'Fiction', selected: false}
                    ]} />
                </div>
                <div className="col col-md">
                    <SelectBox label="Genre" id="book-genre" onChange={onBookChange} options={[
                        {value: '0', label: 'Unknown', selected: true},
                        {value: '1', label: 'Pets', selected: false}
                    ]} />
                </div>
                <div className="col col-md">
                    <TextField label="Publisher" id="book-publisher" onChange={onBookChange} value={book.publisher} />
                </div>
            </div>
            <div className="row">
                <div className="col col-md">
                    <TextField label="ISBN" id="book-isbn" onChange={onBookChange} value={book.isbn} />
                </div>
                <div className="col col-md">
                    <TextField label="Lexile" id="book-lexile" onChange={onBookChange} value={book.lexile.toString()} />
                </div>
                <div className="col col-md">
                    <TextField label="Word Count" id="book-wordCount" onChange={onBookChange} value={book.wordCount.toString()} />
                </div>
            </div>
        </div>
    );
}
