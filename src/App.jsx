
import './App.css'
import { useState, useEffect } from "react";
import { FormControl, InputGroup, Container, Button, Row, Card } from "react-bootstrap";
import { Routes, Route, useNavigate } from "react-router-dom";
import PlayPage from "./PlayPage";


function HomePage() {

  const clientId = import.meta.env.VITE_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret,
    };

    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => {
        setAccessToken(data.access_token);
      });
  }, []);
  
async function search() {
  if (!searchInput.trim()) return;
  let artistParams = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  };

  // Get Artist
  const artistID = await fetch(
    "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
    artistParams
  )
    .then((result) => result.json())
    .then((data) => {
      return data.artists.items[0].id;
    });

  // Get Artist Albums
  await fetch(
    "https://api.spotify.com/v1/artists/" +
      artistID +
      "/albums?include_groups=album&market=US&limit=50",
    artistParams
  )
    .then((result) => result.json())
    .then((data) => {
      setAlbums(data.items);
    });
  }
  return (
  <div
      style={{
        height: "100vh",
        width: "100vw",
        top: 0,
        left: 0,
        position: "absolute",
        minHeight: "100vh",
        backgroundColor: "#8b0000",
        backgroundImage: `url("/wallpaper.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "repeat-y",
        backgroundAttachment: "fixed",
        color: "white",
      }}
  >
   <Container
      style={{
        width: "100%",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
          <img
          src="/spotify-logo.png"
          alt="Spotify Logo"
          style={{
            width: "100px",
            height: "100px",
            marginBottom: "10px",
            marginTop: "20px",
          }}
        />
      <h1 style={{ textAlign: "center", margin: "20px 0", color: "black" }}>
        Spotify Album Player
      </h1>
    <InputGroup>
      <FormControl
        placeholder="Search For Artist"
        type="input"
        aria-label="Search for an Artist"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            search();
          }
        }}
        onChange={(event) => setSearchInput(event.target.value)}
        style={{
          color: "black",
          backgroundColor: "white",
          boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
          width: "300px",
          height: "35px",
          borderWidth: "0px",
          borderStyle: "solid",
          borderRadius: "5px",
          marginRight: "10px",
          paddingLeft: "10px",
        }}
      />

      <Button
        onClick={search}
        style={{
          backgroundColor: "#1DB954",
          border: "none",
          color: "white",
          fontWeight: "bold",
          padding: "10px 20px",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#1ed760";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#1DB954";
          e.target.style.transform = "scale(1)";
        }}
      >
      Search
      </Button>
    </InputGroup>
  </Container>

      <Container>
        <Row
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            alignContent: "center",
            backgroundImage: `url("/wallpaper.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "repeat-y",
            backgroundAttachment: "fixed",
          }}
        >
          
        {albums.map((album) => {
            return (
            <Card
              key={album.id}
              style={{
                backgroundColor: "#ffffff7a",
                color: "#000",
                borderRadius: "15px",
                width: "220px",
                margin: "15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}
              className="album-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
              }}
            >
              <Card.Img
                variant="top"
                src={album.images[0]?.url}
                style={{
                  borderRadius: "15px",
                  borderTopRightRadius: "15px",
                  height: "220px",
                  objectFit: "cover",
                }}
              />
              <Card.Body style={{ textAlign: "center" }}>
                <Card.Title style={{ fontWeight: "600", fontSize: "16px", height: "45px", overflow: "hidden" }}>
                  {album.name}
                </Card.Title>
                <Card.Text style={{ fontSize: "14px", color: "#333" }}>
                  Release Date: {album.release_date}
                </Card.Text>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    href={album.external_urls.spotify}
                    target="_blank"
                    style={{
                      backgroundColor: "#000",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      padding: "5px 10px",
                      fontWeight: "bold",
                    }}
                  >
                    Spotify
                  </Button>
                  <Button
                    onClick={() => navigate(`/play/${album.id}`)}
                    style={{
                      backgroundColor: "#1DB954",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    ▶ Play
                  </Button>
                </div>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>
  </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/play/:albumId" element={<PlayPage />} />
    </Routes>
  );
}

export default App
