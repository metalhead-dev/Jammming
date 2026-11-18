
import { useState } from 'react';
import styles from './SearchBar.module.css';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  function handleSearch() {
    if (searchTerm.trim() === '') {
      return;
    }

    onSearch(searchTerm);
  }

  return (
    <div className={styles.searchBar}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Enter a song"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      <button
        className={styles.searchButton}
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;
