import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Image, Rate, Typography, Spin, Alert, Col, Row } from 'antd';
import { format } from 'date-fns';
import './rated-movie.css';
import GenresContext from '../context/context';

const key = 'b14771c0adfdc54f59204d41d5bf2302';

const RatedMovie = ({ tab, setTab }) => {
  const [array, setArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const onError = () => {
    setLoading(false);
    setError(true);
  };

  useEffect(() => {
    const sendRequest = () => {
      fetch(
        `https://api.themoviedb.org/3/guest_session/${localStorage.getItem('session_id')}/rated/movies?api_key=${key}`
      )
        .then((resp) => resp.json())
        .then((rez) => {
          setArray(rez.results);
          setLoading(false);
        })
        .catch(onError);
    };
    sendRequest();
  }, [tab]);

  const checkOnlineState = () => <Alert message="No internet connection" type="warning" showIcon closable />;

  function shortText(longText, maxLength, postfix) {
    const pos = longText.indexOf(' ', maxLength);
    return pos === -1 ? longText : longText.substr(0, pos) + postfix;
  }

  const genres = useContext(GenresContext);

  function ratedCard(movie) {
    const image = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    const originalTitle = shortText(movie.original_title, 23, '...');
    const date = format(new Date(movie.release_date), 'PP');
    const overview = shortText(movie.overview, 70, '...');
    const newRating = movie.rating;
    const movieGenres = movie.genre_ids.slice(0, 2);

    const genresArr = genres.filter((elem) => movieGenres.includes(elem.id)).map((elem) => elem.name);

    function showGenres(arr) {
      if (arr.length !== 0) {
        return arr.map((elem) => elem);
      }
      return 'Genres not specified';
    }

    let retingCircle = 'ant-rate-text ratingСircle';
    if (newRating >= 0 && newRating <= 3) retingCircle += ' colorRatingСircleToThree';
    if (newRating > 3 && newRating <= 5) retingCircle += ' colorRatingСircleToFive';
    if (newRating > 5 && newRating <= 7) retingCircle += ' colorRatingСircleToSeven';
    if (newRating > 7) retingCircle += ' colorRatingСircleAboveSeven';

    const { Title, Text } = Typography;

    return (
      <Col xs={24} md={11} key={originalTitle + Math.random() * 100}>
        <div className="cardStyle">
          <div className="imageStyle">
            <Image src={image} />
          </div>
          <div className="allFilmInform">
            <div className="titleAndRating">
              <Title level={5}>{originalTitle}</Title>
              <Text strong>
                <span className={retingCircle}>{newRating}</span>
              </Text>
            </div>
            <div className="date">
              <Text disabled>{date}</Text>
            </div>
            <div className="genres">
              <Text keyboard type="secondary">
                {showGenres(genresArr)}
              </Text>
            </div>
            <div className="filmDescription">
              <Text>
                <p className="overview">{overview}</p>
              </Text>
            </div>
            <div className="raiting">
              <Rate allowHalf defaultValue={newRating} count={10} onChange={(elem) => elem} />
            </div>
          </div>
        </div>
      </Col>
    );
  }

  useEffect(() => {
    setTab(false);
  });

  function spinner() {
    return (
      <div className="example">
        <Spin size="large" />
      </div>
    );
  }

  if (loading) return spinner();

  if (error || array === undefined || array === null) return <Alert message="Something went wrong" type="success" />;

  if (!navigator.onLine) return checkOnlineState();

  if (array.length === 0) return <Alert message="Movie not found" type="success" />;

  return (
    <div className="container">
      <Row justify="space-around">{array.map((movie) => ratedCard(movie))}</Row>
    </div>
  );
};

RatedMovie.defaultProps = {
  tab: false,
  setTab: () => {},
};

RatedMovie.propTypes = {
  tab: PropTypes.bool,
  setTab: PropTypes.func,
};

export default RatedMovie;
