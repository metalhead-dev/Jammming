import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <h1>Jammming</h1>

      <SearchBar />

      <div className={styles.container}>
        <SearchResults />
        <Playlist />
      </div>
    </div>
  );
}

export default App;