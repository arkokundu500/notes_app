import React from 'react';
import { useNotes } from '../../contexts/NotesContext';
import { Pin, Edit, Trash2 } from 'lucide-react';

const NoteCard = ({ note, onEdit }) => {
  const { deleteNote, togglePin } = useNotes();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(note._id);
    }
  };

  const handlePin = async (e) => {
    e.stopPropagation();
    await togglePin(note._id);
  };

  const handleEdit = () => {
    onEdit(note);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateContent = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className={`note-card ${note.isPinned ? 'pinned' : ''}`} onClick={handleEdit}>
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions">
          <button
            className={`pin-btn ${note.isPinned ? 'active' : ''}`}
            onClick={handlePin}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin size={16} />
          </button>
          <button
            className="edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            title="Edit note"
          >
            <Edit size={16} />
          </button>
          <button
            className="delete-btn"
            onClick={handleDelete}
            title="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="note-content">
        <p>{truncateContent(note.content)}</p>
      </div>
      
      <div className="note-footer">
        <span className="note-date">
          {formatDate(note.updatedAt)}
        </span>
        {note.isPinned && (
          <span className="pinned-badge">
            <Pin size={12} />
            Pinned
          </span>
        )}
      </div>
    </div>
  );
};

export default NoteCard;