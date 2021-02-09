import React, { useState, useEffect } from 'react';
import { Pagination, Tabs } from 'antd';
import debounce from 'lodash.debounce';
import 'antd/dist/antd.css';
import CardMovie from '../card-movie/CardMovie';
import RatedMovie from '../rated-movie/RatedMovie';
import Search from '../search/Search';
import GenresContext from '../context/context';

import './app.css';

const App = () => {
  const [valueFromInput, setValueFromInput] = useState('return');
  const [page, setPage] = useState(1);
  const [genres, setGenres] = useState([]);

  const { TabPane } = Tabs;

  function getDataFromInput(event) {
    setValueFromInput(event.target.value);
  }

  function changePage(num) {
    setPage(num);
  }

  function getGenres() {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=b14771c0adfdc54f59204d41d5bf2302&language=en-US`)
      .then((response) => response.json())
      .then((data) => setGenres(data.genres));
  }

  useEffect(() => {
    getGenres();
  }, []);

  return (
    <GenresContext.Provider value={genres}>
      {/* <Row gutter={[16, 16]} justify="space-between"> */}
      <div className="container">
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Search" key="1">
            <Search className="search" getDataFromInput={debounce(getDataFromInput, 750)} />

            <CardMovie value={valueFromInput} page={page} />

            <Pagination style={{ maxWidth: 420 }} onChange={(elem) => changePage(elem)} defaultCurrent={1} total={50} />
          </TabPane>
          <TabPane tab="Rated" key="2">
            <RatedMovie />
          </TabPane>
        </Tabs>
      </div>
      {/* </Row> */}
    </GenresContext.Provider>
  );
};

export default App;
