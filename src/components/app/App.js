import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import 'antd/dist/antd.css';
import CardMovie from '../card-movie/CardMovie';
import RatedMovie from '../rated-movie/RatedMovie';
import GenresContext from '../context/context';
import ApiService from '../../services';

import './app.css';

const App = () => {
  const apiService = new ApiService();
  const [valueFromInput, setValueFromInput] = useState('return');
  const [page, setPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [tab, setTab] = useState(true);
  const { TabPane } = Tabs;

  function getDataFromInput(event) {
    setValueFromInput(event.target.value);
  }

  function changePage(num) {
    setPage(num);
  }

  function getTab(key) {
    if (key === 'Rated') setTab(true);
  }

  /* eslint-disable */
  useEffect(() => {
    apiService.getGenres(setGenres);
  }, []);
  /* eslint-enable */

  return (
    <GenresContext.Provider value={genres}>
      <div className="container">
        <Tabs onTabClick={(key) => getTab(key)} defaultActiveKey="1" centered>
          <TabPane tab="Search" key="Search">
            <CardMovie value={valueFromInput} page={page} changePage={changePage} getDataFromInput={getDataFromInput} />
          </TabPane>
          <TabPane tab="Rated" key="Rated">
            <RatedMovie tab={tab} setTab={setTab} />
          </TabPane>
        </Tabs>
      </div>
    </GenresContext.Provider>
  );
};

export default App;
