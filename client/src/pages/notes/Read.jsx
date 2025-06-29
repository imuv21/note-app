import React, { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import DOMPurify from 'dompurify';
import { getNote } from '../../features/thunks/noteThunks';
import { clearErrors } from '../../features/reducers/noteReducer';
import Loader from '../../components/Loader';


const Read = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { noteId } = useParams();
    const { note, getLoading, getError } = useSelector((state) => state.note);

    useEffect(() => {
        if (noteId) {
            dispatch(getNote(noteId));
        }

        return () => {
            dispatch(clearErrors());
        };
    }, [dispatch, noteId]);

    const goBack = () => {
        navigate('/');
    }

    if (getLoading) return <Loader />;

    return (
        <Fragment>
            <Helmet>
                <title>Note App — Read</title>
                <meta
                    name="description"
                    content="Read your note in full detail here."
                />
                <link rel="canonical" href="https://noteapp.netlify.app/read" />
            </Helmet>

            <div className="page">
                {getError ? (
                    <p className="error">Error loading note!</p>) : !getLoading && !getError &&
                        note ? (
                    <div className="note-full">
                        <h1 className="headingBig">{note.title}</h1>
                        <div
                            className="note-content"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(note.description, {
                                    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li']
                                })
                            }}
                        />
                        <p className="note-date">
                            Last updated: {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                        </p>
                    </div>
                ) : (<p className="text">Note not found!</p>
                )}

                <button className='addbutton' onClick={goBack}>Go Back</button>
            </div>
        </Fragment>
    );
};

export default Read;