import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Image, Rate, Typography, Spin, Alert, Col, Row } from 'antd';
import { format } from 'date-fns';
import './card-movie.css';
import GenresContext from '../context/context';

const key = 'b14771c0adfdc54f59204d41d5bf2302';

const CardMovie = ({ value, page }) => {
  const [array, setArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const onError = () => {
    setLoading(false);
    setError(true);
  };

  useEffect(() => {
    function sendRequest() {
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${value}&page=${page}`)
        .then((resp) => resp.json())
        .then((rez) => {
          setArray(rez.results);
          setLoading(false);
        })
        .catch(onError);
    }
    sendRequest();
  }, [value, page]);

  function getSession() {
    fetch(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${key}`)
      .then((resp) => resp.json())
      .then((data) => localStorage.setItem('session_id', data.guest_session_id));
  }

  const checkOnlineState = () => <Alert message="No internet connection" type="warning" showIcon closable />;

  useEffect(() => {
    getSession();
  }, []);

  function sendRate(rateFromCard, id) {
    localStorage.setItem('rate', rateFromCard);
    fetch(
      `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${key}&guest_session_id=${localStorage.getItem(
        'session_id'
      )}`,
      {
        method: 'POST',
        body: JSON.stringify({ value: rateFromCard }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    );
  }

  function shortText(longText, maxLength, postfix) {
    const pos = longText.indexOf(' ', maxLength);
    return pos === -1 ? longText : longText.substr(0, pos) + postfix;
  }

  const genres = useContext(GenresContext);

  function newCard(movie) {
    const image = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    const originalTitle = shortText(movie.original_title, 23, '...');
    const date = format(new Date(movie.release_date), 'PP');
    const overview = shortText(movie.overview, 70, '...');
    const rating = movie.vote_average;
    const movieGenres = movie.genre_ids.slice(0, 2);

    const genresArr = genres.filter((elem) => movieGenres.includes(elem.id)).map((elem) => elem.name);

    function showGenres(arr) {
      if (arr.length !== 0) {
        return arr.map((elem) => (
          <Text keyboard type="secondary" key={elem}>
            {elem}
          </Text>
        ));
      }
      return (
        <Text keyboard type="secondary">
          Genres not specified
        </Text>
      );
    }

    let retingCircle = 'ant-rate-text ratingСircle';
    if (rating >= 0 && rating <= 3) retingCircle += ' colorRatingСircleToThree';
    if (rating > 3 && rating <= 5) retingCircle += ' colorRatingСircleToFive';
    if (rating > 5 && rating <= 7) retingCircle += ' colorRatingСircleToSeven';
    if (rating > 7) retingCircle += ' colorRatingСircleAboveSeven';

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
                <span className={retingCircle}>{rating}</span>
              </Text>
            </div>
            <div className="date">
              <Text disabled>{date}</Text>
            </div>
            <div className="genres">{showGenres(genresArr)}</div>
            <div className="filmDescription">
              <Text>
                <p className="overview">{overview}</p>
              </Text>
            </div>
            <div className="raiting">
              <Rate allowHalf defaultValue={0} count={10} onChange={(elem) => sendRate(elem, movie.id)} />
            </div>
          </div>
        </div>
      </Col>
    );
  }

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
      <Row justify="space-around">{array.map((movie) => newCard(movie))}</Row>
    </div>
  );
};

CardMovie.defaultProps = {
  value: 'return',
  page: 0,
};

CardMovie.propTypes = {
  value: PropTypes.string,
  page: PropTypes.number,
};

export default CardMovie;
