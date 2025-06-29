import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getAllNotes } from '../features/thunks/noteThunks';
import NoteCard from './NoteCard';
import Loader from './Loader';

import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';


const Grid = ({ onEdit, onDelete }) => {

    const dispatch = useDispatch();
    const { notes, getAllLoading, getAllError, totalNotes, totalPages, pageNotes, isFirst, isLast, hasNext, hasPrevious } = useSelector((state) => state.note);

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [searchParams, setSearchParams] = useSearchParams();
    const keywords = searchParams.get('query') || '';
    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("desc");

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(getAllNotes({ page, size, search: keywords, sortBy, order }));
        }, 500);

        return () => clearTimeout(timer);
    }, [dispatch, page, size, keywords, sortBy, order]);

    // Reset to page 1 when search term changes
    useEffect(() => {
        setPage(1);
    }, [keywords]);


    //pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };
    const getPageNumbers = (currentPage, totalPages) => {
        const pageNumbers = [];
        const maxPageButtons = 5;

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (endPage - startPage < maxPageButtons - 1) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
            } else if (endPage === totalPages) {
                startPage = Math.max(1, endPage - maxPageButtons + 1);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };
    const pageNumbers = getPageNumbers(page, totalPages);

    const toggleOrder = () => {
        setOrder(prevOrder => (prevOrder === "asc" ? "desc" : "asc"));
    };

    if (getAllLoading) {
        return <Loader />;
    }

    return (
        <div className='gridCont'>
            <div className="sortCat">
                <div className="flex g20">
                    {keywords && (
                        <button className="remove-btn" onClick={() => setSearchParams({})}>
                            Clear search
                        </button>
                    )}
                     <p className="text">Showing {pageNotes || 0} of {totalNotes || 0} notes {keywords && ` for "${keywords}"`}</p>
                </div>

                <div className="flex center g10">
                    <select name="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="">Sort By</option>
                        <option value="createdAt">Time</option>
                        <option value="updatedAt">Modified</option>
                        <option value="title">Title</option>
                    </select>

                    <div className="orderfilter" onClick={toggleOrder}>
                        {order === "asc" ? <NorthIcon /> : <SouthIcon />}
                    </div>
                </div>
            </div>

            <div className='grid'>
                {getAllError ? (<p className='text'>Error loading notes!</p>) : !getAllLoading && !getAllError &&
                    notes && notes.length > 0 ? notes.map((note) => (
                        <NoteCard key={note._id} note={note} onEdit={onEdit} onDelete={onDelete} />
                    )) : (<p className='text'>No notes found!</p>)}
            </div>

            {!getAllLoading && !getAllError && totalNotes > size && (
                <div className="pagination">
                    <div className="flex wh" style={{ gap: '10px' }}>
                        <button className='pagination-btn' onClick={() => handlePageChange(1)} disabled={isFirst}>
                            First Page
                        </button>
                        <button className='pagination-btn' onClick={() => handlePageChange(page - 1)} disabled={!hasPrevious}>
                            Previous
                        </button>
                    </div>
                    <div className="flex wh" style={{ gap: '10px' }}>
                        {pageNumbers.map(index => (
                            <button key={index} className={`pagination-btn ${index === page ? 'active' : ''}`} onClick={() => handlePageChange(index)}>
                                {index}
                            </button>
                        ))}
                    </div>
                    <div className="flex wh" style={{ gap: '10px' }}>
                        <button className='pagination-btn' onClick={() => handlePageChange(page + 1)} disabled={!hasNext}>
                            Next
                        </button>
                        <button className='pagination-btn' onClick={() => handlePageChange(totalPages)} disabled={isLast}>
                            Last Page
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Grid