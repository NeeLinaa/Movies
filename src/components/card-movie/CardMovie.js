import React, { useState, useEffect } from 'react';
import { Alert, Row, Pagination } from 'antd';
import 'antd/dist/antd.css';
import debounce from 'lodash.debounce';
import CardContent from '../card-content/CardContent';
import Search from '../search/Search';
import './card-movie.css';
import ApiService from '../../services';
import { shortText, checkOnlineState, spinner } from '../../utilits';

const CardMovie = () => {
  const apiService = new ApiService();
  const [valueFromInput, setValueFromInput] = useState('return');
  const [page, setPage] = useState(1);
  const [array, setArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function getDataFromInput(event) {
    setValueFromInput(event.target.value);
  }

  function changePage(num) {
    setPage(num);
  }

  const onError = () => {
    setLoading(false);
    setError(true);
  };

  /* eslint-disable */
  useEffect(() => {
    apiService
      .sendRequest(valueFromInput, page)
      .then((rez) => {
        setArray(rez.results);
        setLoading(false);
      })
      .catch(onError);
  }, [valueFromInput, page]);

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

export default CardMovie;
