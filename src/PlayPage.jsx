import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function PlayPage() {
  const { albumId } = useParams();
  const [albumData, setAlbumData] = useState(null);
  const [artistData, setArtistData] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [showLetter, setShowLetter] = useState("closed");

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLetter("open"), 2000);
    const timer2 = setTimeout(() => setShowLetter("done"), 3500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

    let authParams = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:
        "grant_type=client_credentials&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret,
    };

    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((res) => res.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const fetchAlbum = async () => {
      const res = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: { Authorization: "Bearer " + accessToken },
      });
      const album = await res.json();
      setAlbumData(album);

      if (album.artists?.length > 0) {
        const artistId = album.artists[0].id;
        const artistRes = await fetch(
          `https://api.spotify.com/v1/artists/${artistId}`,
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        );
        const artist = await artistRes.json();
        setArtistData(artist);
      }
    };

    fetchAlbum();
  }, [accessToken, albumId]);

  if (!albumData) {
    return (
      <div
        style={{
          color: "white",
          top: 0,
          left: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
          backgroundColor: "#8b0000",
        }}
      >
        Loading album...
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        minHeight: "100vh",
        backgroundColor: "rgba(209, 19, 19, 0.6)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >

      {/* Letter Animation */}
      <AnimatePresence>
        {showLetter === "closed" && (
          <motion.img
            key="closed"
            src="/letter-closed.png"
            alt="Closed Letter"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "20%",
              left: "30%",
              transform: "translate(-50%, -50%)",
              width: "600px",
              zIndex: 10,
            }}
          />
        )}
        {(showLetter === "open" || showLetter === "done")&&(
          <>
          <motion.img
            key="open"
            src="/letter-open.png"
            alt="Open Letter"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 60 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "20%",
              left: "27%",
              transform: "translate(-50%, -50%)",
              width: "700px",
              zIndex: 10,
            }}
          />

          <motion.div
            key="content"
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              position: "relative",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100vw",
              height: "100vh",
              overflow: "hidden",
            }}
          >

          {/* Spinning Disc */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: "850px",
              width: "50vw",
              minHeight: "100vh",
            }}
          >
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "20%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "400px",
              width: "40vw",
            }}
          >
          <img
            src="/disc.png"
            alt="Spinning Disc"
            className="spinning-disc"
            style={{
              position: "absolute",
              top: "1%",
              left: "16%",
              width: "200px",
              height: "200px",
              aspectRatio: "1 / 1",
              borderRadius: "50%",
              transformOrigin: "center center",
            }}
          />

          <img
            src="/casette.jpeg"
            alt="Casette"
            style={{
              position: "absolute",
              top: "25%",
              width: "350px",
              height: "200px",
              borderRadius: "15px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />

          {/* Artist Image */}
          {artistData?.images?.length > 0 && (
            <img
              src={artistData.images[0].url}
              alt={artistData.name}
              style={{
                position: "absolute",
                top: "80%",
                left: "30%",
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderWidth: "8px 8px 50px 8px",
                borderStyle: "solid",
                borderColor: "rgba(224, 170, 116, 1)",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
                transform: "rotate(-8deg)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "rotate(-8deg) scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "rotate(-8deg)";
              }}
            />
          )}

          {/* Album Cover */}
          {albumData?.images?.length > 0 && (
          <img
            src={albumData.images[0].url}
            alt={albumData.name}
            style={{
              position: "absolute",
              top: "80%",
              left: "47%",
              width: "150px",
              height: "150px",
              objectFit: "cover",
              borderWidth: "8px 8px 50px 8px",
              borderStyle: "solid",
              borderColor: "rgba(224, 170, 116, 1)",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
              transform: "rotate(8deg)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "rotate(8deg) scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "rotate(8deg)";
            }}
          />
         )}
      </div>
      
      {/* Spotify Embed */}
      <iframe
        style={{
          borderRadius: "30px",
          position: "absolute",
          width: "350px",
          height: "380px",
          top: "20%",
          left: "53%",
          padding: "10px",
          backgroundColor: "transparent",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
        }}
        src={`https://open.spotify.com/embed/album/${albumId}?utm_source=generator&theme=0`}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>

      <div
        style={{
          position: "absolute",
          top: "80%",
          left: "59%",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 0 30px rgba(0, 0, 0, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.4)";
        }}
      >
        <img
          src="/cat1.png"
          alt="cat1"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: "80%",
          left: "64%",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 0 30px rgba(0, 0, 0, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.4)";
        }}
      >
        <img
          src="/cat2.png"
          alt="cat2"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: "80%",
          left: "69%",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 0 30px rgba(0, 0, 0, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.4)";
        }}
      >
        <img
          src="/cat3.png"
          alt="cat3"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
   </div>
   </motion.div>
   </>
   )}
  </AnimatePresence>

  {/* CSS Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .spinning-disc {
            animation: spin 4s linear infinite;
          }
        `}
      </style>
    </div>
  );
}

export default PlayPage;
