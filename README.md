
# 🎵 Jammming

Jammming is a React application that allows users to search for music, build custom playlists, and save them directly to Spotify.

## Screenshot

![Jammming application](screenshots/jammming.png)

## Features

- Search for tracks using the Spotify Web API
- View song titles, artists, and albums
- Add and remove tracks from playlists
- Prevent duplicate tracks
- Rename playlists
- Save playlists to Spotify
- Authenticate with Spotify using Authorization Code with PKCE
- Automatically refresh Spotify access tokens
- Restore authentication after refreshing the page
- Responsive design with custom-styled buttons

## Technologies

- React
- JavaScript
- CSS Modules
- Vite
- Spotify Web API

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the application

```bash
npm run dev
```

### 3. Open Jammming

Open http://127.0.0.1:5173/ in your browser.

### 4. Connect to Spotify

Click **Login With Spotify** and authorize the application.

Note: Spotify authentication requires a Spotify Developer application with the correct Client ID and redirect URI. Spotify API access may also depend on the app's development-mode permissions and account eligibility.

## Testing

The following features were tested successfully:

- Empty playlist validation
- Empty search queries
- Multiple consecutive searches
- Adding and removing tracks
- Duplicate prevention
- Saving playlists to Spotify
- Restoring Spotify authentication after page refresh
- Automatic access token refresh

## Project Background

This project was created as part of the Codecademy Front-End Engineer learning path.
