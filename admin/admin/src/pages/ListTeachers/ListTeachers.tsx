import React, { useState, useEffect } from 'react';
import { API_HOST } from '../../common/constants';
import { Link } from 'react-router-dom';
import PaginationBar from '../../components/PaginationBar';

export default function ListTeachers() {
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const getData = async () => {
            const data = await (await fetch(`${API_HOST}/teacher/list/page/${page}`)).json();
            
            setData(data.teachers);
            setTotalPages(data._meta.pages);
        };

        getData();
    }, [page]);

    return (
        <div className="container list-teachers-container">
            <div className="row">
                <div className="col col-12">
                    <h2>List Teachers</h2>
                </div>
            </div>
            <div className="row">
                <div className="col col-12">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((t: any) =>
                                    <tr key={t.id}>
                                        <td>{t.firstName} {t.lastName}</td>
                                        <td>
                                            <Link to={`/teacher/edit/${t.id}`} className="btn btn-primary">Edit</Link>
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