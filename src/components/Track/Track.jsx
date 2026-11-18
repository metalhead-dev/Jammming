import styles from './Track.module.css';

function Track({ track }) {
  return (
    <div className={styles.track}>
      <h3 className={styles.trackName}>{track.name}</h3>
      <p className={styles.trackInfo}>
        {track.artist} | {track.album}
      </p>
    </div>
  );
}

export default Track;