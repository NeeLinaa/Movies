import React, { useState, useEffect } from 'react';
import { Alert, Row, Pagination } from 'antd';
import 'antd/dist/antd.css';
import CardContent from '../card-content/CardContent';
import Search from '../search/Search';
import './card-movie.css';
import ApiService from '../../services';
import NoNetwork from '../no-network/NoNetwork';
import Spiner from '../spinner/Spiner';
import { debounce } from '../../utilits';
import { saveSessionId } from '../../localStorages';

const CardMovie = () => {
  const apiService = new ApiService();
  const [valueFromInput, setValueFromInput] = useState('return');
  const [page, setPage] = useState(1);
  const [arrayFilms, setArrayFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

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
    apiService.getSession().then((data) => {
      saveSessionId(data.guest_session_id);
    });
  }, []);

  useEffect(() => {
    apiService
      .sendRequest(valueFromInput, page)
      .then((resp) => {
        setTotalPages(resp.total_pages);
        setArrayFilms(resp.results);
        setLoading(false);
      })
      .catch(onError);
  }, [valueFromInput, page]);
  /* eslint-enable */

  const ratingRequest = (elem, id) => apiService.sendRate(elem, id);

  if (loading) return <Spiner />;

  if (error || !arrayFilms) return <Alert message="Something went wrong" type="success" />;

  if (!navigator.onLine) return <NoNetwork />;

  if (arrayFilms.length === 0) return <Alert message="Movie not found" type="success" />;

  return (
    <div className="container">
      <div className="search">
        <Search getDataFromInput={debounce(getDataFromInput, 750)} />
      </div>
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

export default CardMovie;
