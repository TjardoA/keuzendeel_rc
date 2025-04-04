import { useState } from "react";

const DeezerPlayer = () => {
  const [search, setSearch] = useState("");
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [error, setError] = useState(null);

  // 🔍 Zoek albums op Deezer
  const searchAlbums = async () => {
    if (!search.trim()) return;

    try {
      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://api.deezer.com/search/album?q=${encodeURIComponent(
          search
        )}`
      );
      const data = await response.json();
      if (data?.data?.length) {
        setAlbums(data.data);
        setError(null);
      } else {
        setAlbums([]);
        setError("Geen albums gevonden.");
      }
    } catch (err) {
      console.error(err);
      setError("Fout bij het ophalen van albums.");
    }
  };

  const fetchTracks = async (albumId) => {
    try {
      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://api.deezer.com/album/${albumId}`
      );
      const data = await response.json();
      setTracks(data.tracks.data || []);
      setSelectedAlbum(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Fout bij het ophalen van tracks.");
    }
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h2>🎶 Zoek een album op Deezer</h2>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Voer een artiest of album in..."
        style={{ padding: "10px", width: "300px", fontSize: "16px" }}
      />
      <button
        onClick={searchAlbums}
        style={{ marginLeft: "10px", padding: "10px", cursor: "pointer" }}
      >
        Zoek 🔍
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <div style={{ marginTop: "20px" }}>
        {albums.map((album) => (
          <div
            key={album.id}
            onClick={() => fetchTracks(album.id)}
            style={{
              display: "inline-block",
              margin: "10px",
              padding: "10px",
              border: "1px solid #ddd",
              cursor: "pointer",
              borderRadius: "8px",
              width: "180px",
            }}
          >
            <img
              src={album.cover_medium}
              alt={album.title}
              width="150"
              height="150"
              style={{ borderRadius: "6px" }}
            />
            <p style={{ fontWeight: "bold" }}>{album.title}</p>
            <p style={{ fontSize: "14px", color: "#555" }}>
              {album.artist.name}
            </p>
          </div>
        ))}
      </div>

      {selectedAlbum && (
        <div style={{ marginTop: "30px" }}>
          <h3>
            🎵 {selectedAlbum.title} - {selectedAlbum.artist.name}
          </h3>
          {tracks.map((track) => (
            <div key={track.id} style={{ marginBottom: "15px" }}>
              <p>{track.title}</p>
              <audio controls>
                <source src={track.preview} type="audio/mpeg" />
                Je browser ondersteunt geen audio-element.
              </audio>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeezerPlayer;
