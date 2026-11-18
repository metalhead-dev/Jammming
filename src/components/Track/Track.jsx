import stryles from './Track.module.css';

function Track() {
    return (
        <div className={stryles.track}>
            <h3 className={stryles.trackName}>The Empty Hourglass</h3>
            <p className={stryles.trackInfo}>Architects | All Our Gods Have Abandoned Us</p>
        </div>
    );
}

export default Track;