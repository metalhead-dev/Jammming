
import { useState, useEffect } from 'react';

import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import styles from './App.module.css';

import {
  loginWithSpotify,
  getAccessToken,
  refreshAccessToken,
  searchSpotify,
  createSpotifyPlaylist,
  addTracksToPlaylist
} from './utils/spotify';

// Защита от повторного обмена одного и того же кода
let authorizationPromise = null;

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [saveMessage, setSaveMessage] = useState('');

  // Восстанавливаем авторизацию после обновления страницы
  useEffect(() => {
    let active = true;

    async function initializeSpotify() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      try {
        if (code) {
          window.history.replaceState(
            {},
            '',
            window.location.pathname
          );

          if (!authorizationPromise) {
            authorizationPromise = getAccessToken(code);
          }

          const token = await authorizationPromise;

          if (active) {
            setAccessToken(token);
            console.log('Spotify authorization successful!');
          }
        } else {
          const refreshToken = sessionStorage.getItem(
            'spotify_refresh_token'
          );

          if (refreshToken) {
            const token = await refreshAccessToken();

            if (active) {
              setAccessToken(token);
              console.log('Spotify session restored!');
            }
          }
        }
      } catch (error) {
        console.error('Spotify authorization failed:', error);
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    }

    initializeSpotify();

    return () => {
      active = false;
    };
  }, []);

  // Автоматически обновляем access token до истечения срока действия
  useEffect(() => {
    if (!accessToken) {
      return;
    }

    let active = true;
    let refreshTimer;

    async function updateToken() {
      try {
        const newToken = await refreshAccessToken();

        if (active) {
          setAccessToken(newToken);
          console.log('Spotify access token refreshed!');
        }
      } catch (error) {
        console.error('Automatic token refresh failed:', error);

        if (active) {
          setAccessToken(null);
        }
      }
    }

    const expiresAt = Number(
      sessionStorage.getItem('spotify_token_expires_at')
    );

    if (!expiresAt || !Number.isFinite(expiresAt)) {
      return;
    }

    // Обновляем токен за минуту до истечения
    const refreshDelay = Math.max(
  expiresAt - Date.now() - 60 * 1000,
  0);

    refreshTimer = setTimeout(updateToken, refreshDelay);

    return () => {
      active = false;
      clearTimeout(refreshTimer);
    };
  }, [accessToken]);


  // Поиск песен через Spotify API
  async function handleSearch(searchTerm) {
    if (!accessToken) {
      console.error('Please log in to Spotify first.');
      return;
    }

    try {
      const tracks = await searchSpotify(searchTerm, accessToken);
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

  async function savePlaylist(name) {
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
        name,
        accessToken
      );

      await addTracksToPlaylist(
        playlistId,
        trackUris,
        accessToken
      );

      setPlaylistTracks([]);
      setSaveMessage('Playlist saved successfully!');
    } catch (error) {
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
        {authLoading ? (
          <div className={styles.spotifyConnected} role="status">
            Connecting to Spotify...
          </div>
        ) : accessToken ? (
          <div className={styles.spotifyConnected} role="status">
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
