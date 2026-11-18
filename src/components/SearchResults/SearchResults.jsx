import Tracklist from '../Tracklist/Tracklist';
import styles from './SearchResults.module.css';

function SearchResults({ searchResults }) {
    return (
        <div className={styles.searchResults}>
            <h2 className={styles.title}>Search Results</h2>
            <Tracklist tracks={searchResults} />
        </div>
    );
}

export default SearchResults;