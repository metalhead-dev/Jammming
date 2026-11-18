import Tracklist from '../Tracklist/Tracklist';
import styles from './Playlist.module.css';
import { useState } from 'react';

function Playlist() {
  const [playlistName, setPlaylistName] = useState('My Playlist');

  return (
    <div className={styles.playlist}>
      <input
        className={styles.playlistName}
        type="text"
        value={playlistName}
        onChange={(event) => setPlaylistName(event.target.value)}
      />

      <Tracklist tracks={[]} />

      <button className={styles.saveButton}>
        Save To Spotify
      </button>
    </div>
  );
}

export default Playlist;