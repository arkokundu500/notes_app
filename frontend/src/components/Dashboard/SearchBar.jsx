import React from 'react';
import { useNotes } from '../../contexts/NotesContext';
import { Search, X } from 'lucide-react';

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useNotes();

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="search-bar">
      <div className="search-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            className="clear-search-btn"
            onClick={handleClearSearch}
            title="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;