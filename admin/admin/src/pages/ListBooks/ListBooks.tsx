import React, { useState, useEffect, SyntheticEvent } from 'react';
import TextField from '../../components/TextField';
import SelectBox from '../../components/SelectBox';
import './ListBooks.css';
import { API_HOST } from '../../common/constants';
import { Link } from 'react-router-dom';
import PaginationBar from '../../components/PaginationBar';

enum SearchBy {
    Title = 'TITLE',
    Author = 'AUTHOR'
};

const searchOptions = [
    {label: 'Title', value: SearchBy.Title},
    {label: 'Author', value: SearchBy.Author}
];

export default function ListBooks() {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [bookData, setBookData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchBy, setSearchBy] = useState(SearchBy.Title);

    useEffect(search, [page]);

    function onSearchByChange(e: SyntheticEvent) {
        const select = e.target as HTMLSelectElement;

        const selected = select.options.item(select.selectedIndex)?.value;

        if (!selected)
            return;
        
        setSearchBy(selected === SearchBy.Title ? SearchBy.Title : SearchBy.Author);
    }

    function search() {
        let endpoint = '';
        if (searchBy === SearchBy.Title && searchQuery.length > 0)
            endpoint = `${API_HOST}/book/search/title/${searchQuery}/page/${page}`;
        else if(searchBy === SearchBy.Author && searchQuery.length > 0)
            endpoint = `${API_HOST}/book/search/author/${searchQuery}/page/${page}`;
        else
            endpoint = `${API_HOST}/book/search/all/page/${page}`;


        const dataFetch = async () => {
            const data = await (await fetch(endpoint)).json();

            setBookData(data.books);
            setTotalPages(data._meta.pages);
        };

        dataFetch();
    }

    function onSearchQueryChange(e: SyntheticEvent) {
        const input = e.target as HTMLInputElement;
        const query = input.value;

        setSearchQuery(query);
    }

    return (
        <div className="list-books container">
            <div className="row">
                <div className="col col-6">
                    <TextField id="search-input" label="Search query" onChange={onSearchQueryChange} />
                </div>
                <div className="col col-4">
                    <SelectBox id="search-type" label="Search by" onChange={onSearchByChange} options={searchOptions} />
                </div>
            </div>
            <div className="row">
                <div className="col col-4">
                    <button type="button" className="btn btn-primary" onClick={search}>Search</button>
                </div>
            </div>
            <div className="row">
                <div className="col col-12">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Year</th>
                                <th>Lexile</th>
                                <th>Total Questions</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                bookData.map((b: any) =>
                                    <tr key={b.id}>
                                        <td>{b.title}</td>
                                        <td>{b.author}</td>
                                        <td>{b.year}</td>
                                        <td>{b.lexile}</td>
                                        <td>{b.totalQuestions}</td>
                                        <td>
                                            <Link to={`/book/edit/${b.id}`} className="btn btn-primary">Edit</Link>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <PaginationBar totalPages={totalPages} currentPage={page} onClick={setPage} />
            <div className="row">
                <div className="col col-12">
                    <em>Result Information</em>
                </div>
            </div>
            <div className="row">
                <div className="col col-12">
                    <strong>Total Pages {totalPages}</strong>
                </div>
            </div>
        </div>
    );
}