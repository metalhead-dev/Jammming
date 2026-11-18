import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import styles from './App.module.css';
import { useState } from 'react';

function App() {
  const [searchResults, setSearchResults] = useState([
    {
      id: 1,
      name: 'The Empty Hourglass',
      artist: 'Architects',
      album: 'All Our Gods Have Abandoned Us',
    },
    {
      id: 2,
      name: 'An Open Letter to Myself',
      artist: 'Architects',
      album: 'All Our Gods Have Abandoned Us',
    },
    {
      id: 3,
      name: 'Doomsday',
      artist: 'Architects',
      album: 'All Our Gods Have Abandoned Us',
    }
  ]);

  return (
    <div className={styles.app}>
      <h1>Jammming</h1>

      <SearchBar />

      <div className={styles.container}>
        <SearchResults searchResults={searchResults} />
        <Playlist />
      </div>
    </div>
  );
}

export default App;