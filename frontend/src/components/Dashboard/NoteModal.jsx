import React, { useState, useEffect } from 'react';
import { useNotes } from '../../contexts/NotesContext';
import { X, Save, Pin } from 'lucide-react';

const NoteModal = ({ note, onClose }) => {
  const { createNote, updateNote, togglePin } = useNotes();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
      });
    }
  }, [note]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in both title and content');
      setLoading(false);
      return;
    }

    let result;
    if (note) {
      result = await updateNote(note._id, formData);
    } else {
      result = await createNote(formData);
    }

    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handlePin = async () => {
    if (note) {
      await togglePin(note._id);
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="note-modal">
        <div className="modal-header">
          <h2>{note ? 'Edit Note' : 'Create New Note'}</h2>
          <div className="modal-actions">
            {note && (
              <button
                type="button"
                className={`pin-btn ${note.isPinned ? 'active' : ''}`}
                onClick={handlePin}
                title={note.isPinned ? 'Unpin note' : 'Pin note'}
              >
                <Pin size={18} />
              </button>
            )}
            <button
              type="button"
              className="close-btn"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="note-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Note title..."
              className="note-title-input"
              autoFocus
            />
          </div>

          <div className="form-group">
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your note here..."
              className="note-content-input"
              rows={12}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;