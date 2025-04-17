import {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import axios from "axios";

const DeezerPlayer = forwardRef(({ albums, setAlbums, socket }, ref) => {
  const [search, setSearch] = useState("");
  const [tracks, setTracks] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play() {
      if (audioRef.current) {
        audioRef.current.play();
      }
    },
    pause() {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    },
  }));

  const searchAlbums = async () => {
    if (!search.trim()) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/search?q=${search}`
      );
      const data = response.data;

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

  const selectTrack = (track) => {
    setSelectedTrack(track);
    if (socket) {
      socket.emit("selectTrack", track);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("selectTrack", (track) => {
      setSelectedTrack(track);
    });

    return () => {
      socket.off("selectTrack");
    };
  }, [socket]);

  const handleBack = () => {
    setAlbums([]);
    setTracks([]);
    setSelectedAlbum(null);
    setSelectedTrack(null);
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
            onClick={() => selectTrack(album)}
            className={`album-item ${
              selectedTrack?.id === album.id ? "selected" : ""
            }`}
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

      {selectedTrack && selectedTrack.preview && (
        <audio ref={audioRef} src={selectedTrack.preview} />
      )}
    </div>
  );
});

export default DeezerPlayer;
