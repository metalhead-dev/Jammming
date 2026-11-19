
import { useState, useEffect } from 'react';

import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import styles from './App.module.css';

import {
  loginWithSpotify,
  getAccessToken,
  searchSpotify,
  createSpotifyPlaylist,
  addTracksToPlaylist
} from './utils/spotify';

// Защита от повторного обмена одного и того же кода
let authorizationPromise = null;

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
    },
  ]);

  const [accessToken, setAccessToken] = useState(null);

  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([]);

  const [saveMessage, setSaveMessage] = useState('');

  // Получаем токен после авторизации Spotify
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      return;
    }

    // Убираем одноразовый код из адресной строки
    window.history.replaceState(
      {},
      '',
      window.location.pathname
    );

    // Не обмениваем один и тот же код повторно
    if (!authorizationPromise) {
      authorizationPromise = getAccessToken(code);
    }

    async function handleSpotifyCallback() {
      try {
        const token = await authorizationPromise;

        setAccessToken(token);

        console.log('Spotify authorization successful!');
      } catch (error) {
        console.error('Spotify authorization failed:', error);
      }
    }

    handleSpotifyCallback();
  }, []);

  // Поиск песен через Spotify API
  async function handleSearch(searchTerm) {
    if (!accessToken) {
      console.error('Please log in to Spotify first.');
      return;
    }

    try {
      const tracks = await searchSpotify(
        searchTerm,
        accessToken
      );

      setSearchResults(tracks);

      console.log('Spotify search results:', tracks);
    } catch (error) {
      console.error('Spotify search failed:', error);
    }
  }


function addTrack(track) {
  setPlaylistTracks((prevTracks) => {
    const trackExists = prevTracks.some(
      (savedTrack) => savedTrack.id === track.id
    );

    if (trackExists) {
      return prevTracks;
    }

    return [...prevTracks, track];
  });
}

function removeTrack(track) {
  setPlaylistTracks((prevTracks) =>
    prevTracks.filter((savedTrack) => savedTrack.id !== track.id)
  );
}


async function savePlaylist(playlistName) {
  setSaveMessage('');
  
  if (playlistTracks.length === 0) {
  setSaveMessage('Please add some tracks to your playlist.');
  return;
}
  const trackUris = playlistTracks
    .map((track) => track.uri)
    .filter(Boolean);

  if (!accessToken) {
  setSaveMessage('Please log in to Spotify first.');
  return;
}

  if (trackUris.length === 0) {
  setSaveMessage('No Spotify tracks to save.');
  return;
}

  try {
    const playlistId = await createSpotifyPlaylist(
      playlistName,
      accessToken
    );

    await addTracksToPlaylist(
      playlistId,
      trackUris,
      accessToken
    );
    setPlaylistTracks([]);
    setSaveMessage('Playlist saved successfully!');
  }  catch (error) {
  console.error('Failed to save playlist:', error);

  setSaveMessage(
    'Failed to save playlist. Please try again later.'
  );
}
}

  return (
    <div className={styles.app}>
      <h1>Jammming</h1>

         
<div className={styles.loginContainer}>
  {accessToken ? (
    <div
      className={styles.spotifyConnected}
      role="status"
    >
      ✓ Connected to Spotify
    </div>
  ) : (
    <button
      className={styles.spotifyLoginButton}
      onClick={loginWithSpotify}
    >
      Login With Spotify
    </button>
  )}
</div>

      <SearchBar onSearch={handleSearch} />

      <div className={styles.container}>
        <SearchResults
          searchResults={searchResults}
          onAdd={addTrack}
        />
        <Playlist 
        playlistName={playlistName}
        onNameChange={setPlaylistName}
        playlistTracks={playlistTracks}
        onRemove={removeTrack}
        onSave={savePlaylist}
        />
        {saveMessage && (
  <p role="status">{saveMessage}</p>
)}
      </div>
    </div>
  );
}

export default App;
