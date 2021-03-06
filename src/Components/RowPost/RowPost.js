import React, { useState, useEffect } from "react";
import "./RowPost.css";
import Youtube from "react-youtube";
import axios from "../../Axios";
import { imageUrl, API_KEY } from "../../Constants/Constants";
import playbtn from "../../Images/playbtn2.png";
import PopUp from "../PopUp/PopUp";

const Rowpost = (props) => {
  const [movies, setMovies] = useState([]);
  const [play, playVideo] = useState(false);
  const [urlId, setUrlId] = useState();

  useEffect(() => {
    axios.get(props.url).then((response) => {
      setMovies(response.data.results);
    });
  }, [props]);

  const opts = {
    height: "500vh",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  const showTrailer = (id) => {
    playVideo(true);
    axios
      .get(`movie/${id}/videos?api_key=${API_KEY}&language=en-US`)
      .then((response) => {
        if (response.data.results.length !== 0) {
          setUrlId(response.data.results[0]);
        } else {
          alert("This Trailer is not available");
        }
      });

    };
    const _onReady = (event) => {
      // access to player in all event handlers via event.target
      event.target.pauseVideo();
    };
  return (
    <div className="main-section">

      <div className="head">
        <h4>{props.title}</h4>
      </div>
      <div className="poster">
        {movies.map((still, k) => (
          <div className="poster-content">
            <>
              <img
                className={props.isSmall ? "small-posters" : "posters"}
                src={`${imageUrl + still.poster_path}`}
                alt="poster"
                key={k}
              />
              <img
                onClick={() => showTrailer(still.id)}
                className={props.isSmall ? "small-playbtn" : "playbtn"}
                src={playbtn}
                alt="play btn"
              />
            </>
            <div className="poster-view">
              <p className="movie-name">
                {still.title ? still.title : still.name}
              </p>
              <p className="movie-year">{still.release_date}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="popupwindow">
        {urlId && (
          <PopUp display={play} setDisplay={playVideo}>
            <Youtube videoId={urlId.key} opts={opts} onReady={_onReady} />
          </PopUp>
        )}
      </div>
    </div>
  );
};

export default React.memo(Rowpost);
