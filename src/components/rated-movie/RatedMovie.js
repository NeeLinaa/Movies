import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Alert, Row, Pagination } from 'antd';
import 'antd/dist/antd.css';
import CardContent from '../card-content/CardContent';
import './rated-movie.css';
import ApiService from '../../services';
import { shortText, checkOnlineState, spinner } from '../../utilits';

const RatedMovie = ({ tab, setTab, changePage }) => {
  const apiService = new ApiService();
  const [array, setArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const onError = () => {
    setLoading(false);
    setError(true);
  };

  /* eslint-disable */
  useEffect(() => {
    apiService
      .sendRequestRated()
      .then((rez) => {
        setArray(rez.results);
        setLoading(false);
      })
      .catch(onError);
  }, [tab]);
  /* eslint-enable */

  const ratingRequest = (elem) => elem;

  useEffect(() => {
    setTab(false);
  });

  if (loading) return spinner();

  if (error || array === undefined || array === null) return <Alert message="Something went wrong" type="success" />;

  if (!navigator.onLine) return checkOnlineState();

  if (array.length === 0) return <Alert message="Movie not found" type="success" />;

  return (
    <div className="container">
      <Row justify="space-around">
        {array.map((movie) => (
          <CardContent movie={movie} ratingRequest={ratingRequest} shortText={shortText} />
        ))}
      </Row>
      <div className="pagination">
        <Pagination style={{ maxWidth: 420 }} onChange={(elem) => changePage(elem)} defaultCurrent={1} total={50} />
      </div>
    </div>
  );
};

RatedMovie.defaultProps = {
  tab: false,
  setTab: () => {},
  changePage: () => {},
};

RatedMovie.propTypes = {
  tab: PropTypes.bool,
  setTab: PropTypes.func,
  changePage: PropTypes.func,
};

export default RatedMovie;
