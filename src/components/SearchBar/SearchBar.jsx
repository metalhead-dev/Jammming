import styles from './SearchBar.module.css';

function SearchBar() {
  return (
    <div className={styles.searchBar}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Enter a song"
      />
      <button className={styles.searchButton}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;