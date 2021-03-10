import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Alert, Row, Pagination } from 'antd';
import 'antd/dist/antd.css';
import debounce from 'lodash.debounce';
import CardContent from '../card-content/CardContent';
import Search from '../search/Search';
import './card-movie.css';
import ApiService from '../../services';
import { shortText, checkOnlineState, spinner } from '../../utilits';

const CardMovie = ({ value, page, changePage, getDataFromInput }) => {
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
      .sendRequest(value, page)
      .then((rez) => {
        setArray(rez.results);
        setLoading(false);
      })
      .catch(onError);
  }, [value, page]);

  useEffect(() => {
    apiService.getSession();
  }, []);
  /* eslint-enable */

  const ratingRequest = (elem, id) => apiService.sendRate(elem, id);

  if (loading) return spinner();

  if (error || array === undefined || array === null) return <Alert message="Something went wrong" type="success" />;

  if (!navigator.onLine) return checkOnlineState();

  if (array.length === 0) return <Alert message="Movie not found" type="success" />;

  return (
    <div className="container">
      <div className="search">
        <Search getDataFromInput={debounce(getDataFromInput, 750)} />
      </div>
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

CardMovie.defaultProps = {
  value: 'return',
  page: 0,
  changePage: () => {},
  getDataFromInput: () => {},
};

CardMovie.propTypes = {
  value: PropTypes.string,
  page: PropTypes.number,
  changePage: PropTypes.func,
  getDataFromInput: PropTypes.func,
};

export default CardMovie;
