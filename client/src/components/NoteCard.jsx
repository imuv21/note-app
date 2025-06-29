import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { formatTitle, formatDescription } from '../utils/formatTime';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReadMoreIcon from '@mui/icons-material/ReadMore';


const NoteCard = ({ note, onEdit, onDelete }) => {

  const navigate = useNavigate();
  // if note was recently updated
  const isRecentlyUpdated = new Date().getTime() - new Date(note.updatedAt).getTime() < 86400000; // 24 hours

  const handleReadMore = () => {
    navigate(`/read/${note._id}`);
  };

  return (
    <div className="note-card">
      <div className="note-header">
        <h3 className="note-title">{formatTitle(note?.title)}</h3>
        <div className="note-actions">
          <button className="icon-btn" aria-label="Edit note">
            <EditIcon fontSize="small" onClick={() => onEdit(note)} />
          </button>
          <button className="icon-btn" aria-label="Delete note">
            <DeleteIcon fontSize="small" onClick={() => onDelete(note)} />
          </button>
        </div>
      </div>

      <p className="note-content">{formatDescription(note?.description)}</p>

      <p className="read-more-btn text" onClick={handleReadMore}>
        <ReadMoreIcon fontSize="small" /> Read More
      </p>
      <div className="note-meta">
        <span className="note-date">
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>

        {isRecentlyUpdated && (
          <span className="note-status">
            <AccessTimeIcon fontSize="small" style={{ marginRight: 4 }} /> Updated
          </span>
        )}
      </div>
    </div>
  );
};

export default NoteCard;