import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Alert, Row, Pagination } from 'antd';
import 'antd/dist/antd.css';
import CardContent from '../card-content/CardContent';
import './rated-movie.css';
import ApiService from '../../services';
import NoNetwork from '../no-network/NoNetwork';
import Spiner from '../spinner/Spiner';

const RatedMovie = ({ tab, setTab, changePage }) => {
  const apiService = new ApiService();
  const [arrayFilms, setArrayFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const onError = () => {
    setLoading(false);
    setError(true);
  };

  /* eslint-disable */
  useEffect(() => {
    apiService
      .sendRequestRated()
      .then((rez) => {
        setTotalPages(rez.total_pages);
        setArrayFilms(rez.results);
        setLoading(false);
      })
      .catch(onError);
  }, [tab]);
  /* eslint-enable */

  const ratingRequest = (elem) => elem;

  useEffect(() => {
    setTab('allFilms');
  });

  if (loading) return <Spiner />;

  if (error || !arrayFilms) return <Alert message="Something went wrong" type="success" />;

  if (!navigator.onLine) return <NoNetwork />;

  if (arrayFilms.length === 0) return <Alert message="Movie not found" type="success" />;

  return (
    <div className="container">
      <Row justify="space-around">
        {arrayFilms.map((movie) => (
          <CardContent movie={movie} ratingRequest={ratingRequest} />
        ))}
      </Row>
      <div className="pagination">
        <Pagination onChange={(elem) => changePage(elem)} defaultCurrent={1} total={totalPages} />
      </div>
    </div>
  );
};

RatedMovie.defaultProps = {
  tab: '',
  setTab: () => {},
  changePage: () => {},
};

RatedMovie.propTypes = {
  tab: PropTypes.string,
  setTab: PropTypes.func,
  changePage: PropTypes.func,
};

export default RatedMovie;
