import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotes } from '../../contexts/NotesContext';
import Header from './Header';
import SearchBar from './SearchBar';
import NoteCard from './NoteCard';
import NoteModal from './NoteModal';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { notes, loading } = useNotes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const pinnedNotes = notes.filter(note => note.isPinned);
  const regularNotes = notes.filter(note => !note.isPinned);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading your notes...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.name}!</h1>
            <p>You have {notes.length} notes</p>
          </div>
          
          <button 
            className="create-note-btn"
            onClick={handleCreateNote}
          >
            <Plus size={20} />
            New Note
          </button>
        </div>

        <SearchBar />

        {notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <h2>No notes yet</h2>
              <p>Start by creating your first note</p>
              <button 
                className="create-first-note-btn"
                onClick={handleCreateNote}
              >
                <Plus size={20} />
                Create Your First Note
              </button>
            </div>
          </div>
        ) : (
          <div className="notes-container">
            {pinnedNotes.length > 0 && (
              <div className="notes-section">
                <h2 className="section-title">Pinned Notes</h2>
                <div className="notes-grid">
                  {pinnedNotes.map(note => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={handleEditNote}
                    />
                  ))}
                </div>
              </div>
            )}

            {regularNotes.length > 0 && (
              <div className="notes-section">
                <h2 className="section-title">
                  {pinnedNotes.length > 0 ? 'Other Notes' : 'All Notes'}
                </h2>
                <div className="notes-grid">
                  {regularNotes.map(note => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={handleEditNote}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <NoteModal
          note={editingNote}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Dashboard;