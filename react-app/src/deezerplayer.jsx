import { useState } from "react";
import axios from "axios";

const DeezerPlayer = ({ albums, setAlbums }) => {
  const [search, setSearch] = useState("");
  const [tracks, setTracks] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [error, setError] = useState(null);

  const searchAlbums = async () => {
    if (!search.trim()) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/search?q=${search}`
      );
      const data = response.data;
      console.log(data);

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
      const response = await axios.get(
        `http://localhost:5000/album/${albumId}`
      );
      setSelectedAlbum(response.data);
      setTracks(response.data.tracks.data);
    } catch (err) {
      console.error(err);
      setError("Fout bij het ophalen van nummers.");
    }
  };

  const handleBack = () => {
    setAlbums([]);
    setTracks([]);
    setSelectedAlbum(null);
    setError(null);
  };

  return (
    <div className="deezer-container">
      {(albums.length > 0 || selectedAlbum) && (
        <button onClick={handleBack} className="back-button">
          Terug
        </button>
      )}

      <h2>Zoek een album</h2>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Voer een artiest of album in..."
        className="search-input"
      />
      <button onClick={searchAlbums} className="search-button">
        Zoek
      </button>

      {error && <p className="error-text">{error}</p>}

      <div className="album-list-horizontal">
        {albums.map((album) => (
          <div
            key={album.id}
            onClick={() => fetchTracks(album.id)}
            className="album-item"
          >
            <img
              src={`https://e-cdns-images.dzcdn.net/images/cover/${album.md5_image}/500x500.jpg`}
              alt={album.title}
              className="album-cover"
            />
            <p className="album-title">{album.title}</p>
            <p className="album-artist">{album.artist.name}</p>
          </div>
        ))}
      </div>

      {selectedAlbum && (
        <div className="selected-album">
          <h3>
            {selectedAlbum.title} - {selectedAlbum.artist.name}
          </h3>
          {tracks.map((track) => (
            <div key={track.id} className="track-item">
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
