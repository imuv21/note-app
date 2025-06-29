import React, { Fragment, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../../utils/toast';
import { addNote, updateNote, getAllNotes, deleteNote } from '../../features/thunks/noteThunks';
import { clearErrors } from '../../features/reducers/noteReducer';
import DOMPurify from 'dompurify';
import Grid from '../../components/Grid';

const Dashboard = () => {

  const dispatch = useDispatch();
  const { addLoading, addErrors, addError, editLoading, editErrors, editError, delLoading } = useSelector((state) => state.note);

  const [isClickedFooter, setIsClickedFooter] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formValues, setFormValues] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    if (currentNote) {
      setFormValues({
        title: currentNote?.title || '',
        description: currentNote?.description || ''
      });
    }
  }, [currentNote]);


  const openEditPopup = (note) => {
    setCurrentNote(note);
    setIsEditMode(true);
    setIsClickedFooter(true);
    dispatch(clearErrors());
  };

  const openAddPopup = () => {
    setFormValues({ title: '', description: '' });
    setIsEditMode(false);
    setIsClickedFooter(true);
    dispatch(clearErrors());
  };

  const openDeleteConfirm = (note) => {
    setCurrentNote(note);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setCurrentNote(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    dispatch(clearErrors());
  };

  const closepopup = (event) => {
    event.preventDefault();
    setIsClickedFooter(false);
  };

  const getAddError = (field) => Array.isArray(addErrors) ? addErrors.find(error => error.path === field) : null;
  const getUpdateError = (field) => Array.isArray(editErrors) ? editErrors.find(error => error.path === field) : null;
  const titleError = isEditMode ? getUpdateError('title') : getAddError('title');
  const descripError = isEditMode ? getUpdateError('description') : getAddError('description');

  const submitHandler = async (event) => {
    event.preventDefault();
    if (isSubmitted) return;
    if (titleError || descripError) {
      showToast('error', 'Please fix the errors before submitting the form!');
      return;
    }
    setIsSubmitted(true);
    try {
      const userData = {
        title: DOMPurify.sanitize(formValues.title),
        description: DOMPurify.sanitize(formValues.description)
      };
      if (isEditMode) {
        const noteId = currentNote?._id;
        const response = await dispatch(updateNote({ userData, noteId })).unwrap();
        if (response.status) {
          showToast('success', `${response.message}`);
          dispatch(getAllNotes({ page: 1, size: 5, sortBy: 'createdAt', order: 'desc' }));
          setIsClickedFooter(false);
        } else {
          showToast('error', `${response.message}`);
        }
      } else {
        const response = await dispatch(addNote(userData)).unwrap();
        if (response.status) {
          showToast('success', `${response.message}`);
          dispatch(getAllNotes({ page: 1, size: 5, sortBy: 'createdAt', order: 'desc' }));
          setIsClickedFooter(false);
        } else {
          showToast('error', `${response.message}`);
        }
      }
    } catch (error) {
      showToast('error', 'Something went wrong!');
    } finally {
      setIsSubmitted(false);
      setCurrentNote(null);
    }
  };

  const deleteHandler = async () => {
    if (!currentNote) return;
    try {
      const noteId = currentNote?._id;
      const response = await dispatch(deleteNote(noteId)).unwrap();
      if (response.status) {
        showToast('success', `${response.message}`);
        dispatch(getAllNotes({ page: 1, size: 5, sortBy: 'createdAt', order: 'desc' }));
      } else {
        showToast('error', `${response.message}`);
      }
    } catch (error) {
      showToast('error', 'Something went wrong!');
    } finally {
      closeDeleteConfirm();
    }
  }


  return (
    <Fragment>
      <Helmet>
        <title>Note App — Dashboard</title>
        <meta
          name="description"
          content="View and manage all your notes on your Dashboard."
        />
        <link rel="canonical" href="https://noteapp.netlify.app/" />
      </Helmet>

      <div className="page">
        <article className='gridHeading'>
          <h1 className='headingBig'>Your Notes</h1>
          <button className='addbutton' onClick={openAddPopup}>+ Add</button>
        </article>

        <Grid onEdit={openEditPopup} onDelete={openDeleteConfirm} />

        <div className={`popup-btn ${isClickedFooter ? 'clicked' : ''}`}>
          {isClickedFooter && (
            <div className="popup">
              <form className="popup-wrapper" onSubmit={submitHandler}>
                <h2 className="heading">
                  {isEditMode ? 'Update Note' : 'Add New Note'}
                </h2>

                <div className="popInputCont">
                  <div className="flexcol start-center w100 g5">
                    <input type="text" name='title' placeholder='Enter title...' value={formValues.title} onChange={handleInputChange} />
                    {titleError && <p className="error">{titleError.msg}</p>}
                  </div>
                  <div className="flexcol start-center w100 g5">
                    <textarea name='description' placeholder='Enter description...' value={formValues.description} onChange={handleInputChange} rows={4} />
                    {descripError && <p className="error">{descripError.msg}</p>}


                    {isEditMode && editError && <p className="error">{editError}</p>}
                    {!isEditMode && addError && <p className="error">{addError}</p>}
                  </div>
                </div>

                <div className="flex w100 g10" style={{ justifyContent: 'space-between' }}>
                  <button type='submit' disabled={isSubmitted || (isEditMode ? editLoading : addLoading)}>
                    {(isSubmitted || (isEditMode ? editLoading : addLoading)) ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update' : 'Add')}
                  </button>
                  <button type="button" onClick={closepopup}>Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className={`popup-btn ${showDeleteConfirm ? 'clicked' : ''}`}>
          {showDeleteConfirm && (
            <div className="popup">
              <div className="popup-wrapper">
                <h2 className="heading">Delete Note</h2>
                <p className="textBig">
                  Are you sure you want to delete this note?<br />
                  <p className='fw-600'>"{currentNote?.title || 'Untitled Note'}"</p>
                </p>

                <div className="flex w100 g10" style={{ justifyContent: 'space-between' }}>
                  <button type="button" onClick={deleteHandler} disabled={delLoading}>
                    {delLoading ? 'Deleting...' : 'Delete'}
                  </button>
                  <button type="button" onClick={closeDeleteConfirm}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;