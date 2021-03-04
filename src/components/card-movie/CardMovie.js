import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Image, Rate, Typography, Spin, Alert, Col, Row, Pagination } from 'antd';
import 'antd/dist/antd.css';
import { format } from 'date-fns';
import './card-movie.css';
import GenresContext from '../context/context';
import ApiService from '../../services';

const CardMovie = ({ value, page, changePage }) => {
  const [array, setArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const onError = () => {
    setLoading(false);
    setError(true);
  };

  useEffect(() => {
    ApiService.sendRequest(value, page, onError, setArray, setLoading);
  }, [value, page]);

  const checkOnlineState = () => <Alert message="No internet connection" type="warning" showIcon closable />;

  useEffect(() => {
    ApiService.getSession();
  }, []);

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
              <Rate allowHalf defaultValue={0} count={10} onChange={(elem) => ApiService.sendRate(elem, movie.id)} />
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
      <div className="pagination">
        <Pagination style={{ maxWidth: 420 }} onChange={(elem) => changePage(elem)} defaultCurrent={1} total={50} />
      </div>
    </div>
  );
};

CardMovie.defaultProps = {
  value: 'return',
  page: 0,
  changePage: () => {},
};

CardMovie.propTypes = {
  value: PropTypes.string,
  page: PropTypes.number,
  changePage: PropTypes.func,
};

export default CardMovie;
