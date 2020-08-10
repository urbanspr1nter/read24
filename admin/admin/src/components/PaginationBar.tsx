import React from 'react';
import './PaginationBar.css';

interface PaginationBarProps {
    totalPages: number;
    currentPage: number;
    onClick: (page: number) => void;
}

export default function PaginationBar(props: PaginationBarProps) {
    const {
        currentPage,
        totalPages,
        onClick
    } = props;

    const pageLinks = [];

    if (currentPage - 1 >= 1)
        pageLinks.push(<button className='page-nav-link'
            key={'arrow-back'}
            onClick={() => onClick(currentPage - 1)}
        >{'<<'}</button>);

    for(let i = 1; i <= totalPages; i++) {
        pageLinks.push(<button className={`page-nav-link ${i === currentPage ? 'active' : undefined}`}
            key={i} 
            onClick={() => onClick(i)}
        >{i}</button>);
    }

    if(currentPage + 1 <= totalPages)
        pageLinks.push(<button className='page-nav-link'
            key={'arrow-next'}
            onClick={() => onClick(currentPage + 1)}
        >{'>>'}</button>);

    return (
        <div className="pagination-bar row justify-content-center">
            <div className="col col-4">
                {pageLinks}
            </div>
        </div>
    );
}