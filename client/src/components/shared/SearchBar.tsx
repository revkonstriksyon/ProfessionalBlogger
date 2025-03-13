import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'wouter';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [, navigate] = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white py-3" data-testid="search-bar">
      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
        <input
          type="text"
          className="w-full bg-gray-100 p-3 pl-10 rounded-lg"
          placeholder={t('header.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
        <span className="absolute left-3 top-3.5 text-gray-400">
          <i className="fas fa-search"></i>
        </span>
        <button
          type="button"
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
