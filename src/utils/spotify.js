
const clientId = 'b603ffc978ec43be8b22a9f617f4fa24';

const redirectUri = 'http://127.0.0.1:5173/';

// Generate PKCE code verifier
function generateCodeVerifier() {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);

  return Array.from(array, (byte) =>
    ('0' + byte.toString(16)).slice(-2)
  ).join('');
}

// Generate PKCE code challenge
async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);

  const digest = await crypto.subtle.digest('SHA-256', data);

  return btoa(
    String.fromCharCode(...new Uint8Array(digest))
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Login with Spotify
export async function loginWithSpotify() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  sessionStorage.setItem('code_verifier', codeVerifier);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    scope: 'playlist-modify-private'
  });

  window.location.href =
    `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Get Spotify access token
export async function getAccessToken(code) {
  const codeVerifier = sessionStorage.getItem('code_verifier');

  if (!codeVerifier) {
    throw new Error('Code verifier not found in session storage');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier
  });

  const response = await fetch(
    'https://accounts.spotify.com/api/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error('Spotify token error:', response.status, errorText);

    throw new Error(
      `Failed to get Spotify access token: ${response.status}`
    );
  }

  const data = await response.json();

  sessionStorage.removeItem('code_verifier');

  if (data.refresh_token) {
    sessionStorage.setItem('spotify_refresh_token', data.refresh_token);
  }

  return data.access_token;
}

// Refresh expired Spotify access token
export async function refreshAccessToken() {
  const refreshToken = sessionStorage.getItem('spotify_refresh_token');

  if (!refreshToken) {
    throw new Error('No refresh token available. Please log in again.');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  });

  const response = await fetch(
    'https://accounts.spotify.com/api/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to refresh Spotify token: ${response.status}`
    );
  }

  const data = await response.json();

  if (data.refresh_token) {
    sessionStorage.setItem('spotify_refresh_token', data.refresh_token);
  }

  return data.access_token;
}

// Search tracks on Spotify
export async function searchSpotify(searchTerm, accessToken) {
  if (!searchTerm || !searchTerm.trim()) {
    return [];
  }

  if (!accessToken) {
    throw new Error('Spotify access token is missing. Please log in.');
  }

  const params = new URLSearchParams({
    q: searchTerm.trim(),
    type: 'track',
    limit: '10'
  });

  const response = await fetch(
    `https://api.spotify.com/v1/search?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error('Spotify API status:', response.status);
    console.error('Spotify API response:', errorText);

    if (response.status === 401) {
      throw new Error(
        'Spotify access token expired or invalid. Please log in again.'
      );
    }

    if (response.status === 403) {
      throw new Error(
        'Spotify denied access (403). Check your app permissions and account eligibility.'
      );
    }

    throw new Error(
      `Spotify search failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  return (data.tracks?.items ?? []).map((track) => ({
    id: track.id,
    name: track.name,
    artist: track.artists.map((artist) => artist.name).join(', '),
    album: track.album.name,
    uri: track.uri
  }));
}

// Create Spotify playlist
export async function createSpotifyPlaylist(
  playlistName,
  accessToken
) {
  const response = await fetch(
    'https://api.spotify.com/v1/me/playlists',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: playlistName,
        public: false
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error('Create playlist error:', errorText);

    throw new Error(
      `Failed to create playlist: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  return data.id;
}

// Add tracks to Spotify playlist
export async function addTracksToPlaylist(
  playlistId,
  trackUris,
  accessToken
) {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/items`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: trackUris
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error('Add tracks error:', errorText);

    throw new Error(
      `Failed to add tracks: ${response.status} ${errorText}`
    );
  }

  return await response.json();
}
