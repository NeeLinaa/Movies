import React from 'react';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import { Input } from 'antd';

import './search.css';

export default function Search({ getDataFromInput }) {
  return <Input className="search" placeholder="Type to search..." onChange={(element) => getDataFromInput(element)} />;
}

Search.defaultProps = {
  getDataFromInput: () => {},
};

Search.propTypes = {
  getDataFromInput: PropTypes.func,
};
