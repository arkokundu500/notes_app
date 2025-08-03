import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  // Debounced search effect
  useEffect(() => {
    if (user) {
      const timeoutId = setTimeout(() => {
        fetchNotes();
      }, 300); // 300ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [user, searchQuery]);

  // Initial fetch of notes
  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      
      const response = await api.get('/notes', { params });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (noteData) => {
    try {
      const response = await api.post('/notes', noteData);
      setNotes(prevNotes => [response.data, ...prevNotes]);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create note',
      };
    }
  };

  const updateNote = async (noteId, noteData) => {
    try {
      const response = await api.put(`/notes/${noteId}`, noteData);
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note._id === noteId ? response.data : note
        )
      );
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update note',
      };
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}`);
      setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete note',
      };
    }
  };

  const togglePin = async (noteId) => {
    try {
      const response = await api.put(`/notes/${noteId}/pin`);
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note._id === noteId ? response.data : note
        )
      );
      // Re-sort notes to move pinned notes to top
      setTimeout(() => {
        fetchNotes();
      }, 100);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to toggle pin',
      };
    }
  };

  const value = {
    notes,
    loading,
    searchQuery,
    setSearchQuery,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    fetchNotes,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};