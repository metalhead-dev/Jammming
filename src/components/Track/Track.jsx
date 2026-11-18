
import styles from './Track.module.css';

function Track({ track, onAdd, onRemove }) {
  function handleAdd() {
    if (onAdd) {
      onAdd(track);
    }
  }

  function handleRemove() {
    if (onRemove) {
      onRemove(track);
    }
  }

  return (
    <div className={styles.track}>
      <h3 className={styles.trackName}>
        {track.name}
      </h3>

      <p className={styles.trackInfo}>
        {track.artist} | {track.album}
      </p>

      {onAdd && (
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${track.name} to playlist`}
        >
          +
        </button>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={handleRemove}
          aria-label={`Remove ${track.name} from playlist`}
        >
          −
        </button>
      )}
    </div>
  );
}

export default Track;
