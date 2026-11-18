
import Tracklist from '../Tracklist/Tracklist';
import styles from './Playlist.module.css';
import { useState } from 'react';

function Playlist({ playlistTracks, onRemove, onSave }) {
  const [playlistName, setPlaylistName] = useState('My Playlist');

  function handleSave() {
    if (playlistName.trim() === '') {
      return;
    }

    onSave(playlistName);
  }

  return (
    <div className={styles.playlist}>
      <input
        className={styles.playlistName}
        type="text"
        value={playlistName}
        onChange={(event) => setPlaylistName(event.target.value)}
      />

      <Tracklist
        tracks={playlistTracks}
        onRemove={onRemove}
      />

      <button
        className={styles.saveButton}
        onClick={handleSave}
      >
        Save To Spotify
      </button>
    </div>
  );
}

export default Playlist;
