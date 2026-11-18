import Tracklist from '../Tracklist/Tracklist';
import styles from './Playlist.module.css';

function Playlist() {
  return (
    <div className={styles.playlist}>
      <input
        className={styles.playlistName}
        type="text"
        defaultValue="My Playlist"
      />

      <Tracklist tracks={[]} />

      <button className={styles.saveButton}>
        Save To Spotify
      </button>
    </div>
  );
}

export default Playlist;