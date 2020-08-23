import React, { useEffect, useState } from 'react';
import { API_HOST } from '../../common/constants';
import PaginationBar from '../../components/PaginationBar';
import { Link } from 'react-router-dom';

export default function ListClassrooms() {
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const getData = async () => {
            const data = await (await fetch(`${API_HOST}/classroom/list/page/${page}`)).json();

            setData(data.classrooms);
            setTotalPages(data._meta.pages);
        };

        getData();
    }, [page]);

    return (
        <div className="list-classrooms container">
            <div className="row">
                <div className="col col-12">
                    <h2>List Classrooms</h2>
                </div>
            </div>
            <div className="row">
                <div className="col col-12">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((c: any) =>
                                    <tr key={c.id}>
                                        <td>{c.name}</td>
                                        <td>{c.slug}</td>
                                        <td>
                                            <Link to={`/classroom/edit/${c.id}`} className="btn btn-primary">Edit</Link>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <PaginationBar totalPages={totalPages} currentPage={page} onClick={setPage} />
        </div>
    );
}