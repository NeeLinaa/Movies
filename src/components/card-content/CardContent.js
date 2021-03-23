import React, { useContext } from 'react';
import { Image, Rate, Typography, Col } from 'antd';
import { format } from 'date-fns';
import GenresContext from '../context/context';
import { shortText } from '../../utilits';

import './CardContent.css';

const CardContent = ({ movie, ratingRequest }) => {
  const genres = useContext(GenresContext);
  function newCard(data) {
    const image = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    const originalTitle = shortText(data.original_title, 23, '...');
    // const date = mov.release_date;
    const date = format(new Date(data.release_date), 'PP');
    const overview = shortText(data.overview, 70, '...');
    const rating = data.vote_average;
    const movieGenres = data.genre_ids.slice(0, 2);

    const genresArr = genres.filter((elem) => movieGenres.includes(elem.id)).map((elem) => elem.name);

    function showGenres(arr) {
      if (arr.length !== 0) {
        return arr.map((elem) => elem);
      }
      return 'Genres not specified';
    }

    let retingCircle = 'ant-rate-text ratingСircle';
    if (rating >= 0 && rating <= 3) retingCircle += ' colorRatingСircleToThree';
    if (rating > 3 && rating <= 5) retingCircle += ' colorRatingСircleToFive';
    if (rating > 5 && rating <= 7) retingCircle += ' colorRatingСircleToSeven';
    if (rating > 7) retingCircle += ' colorRatingСircleAboveSeven';

    const { Title, Text } = Typography;

    return (
      <Col sm={24} md={10} className="oneFilm">
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
            <div className="genres">
              <Text keyboard type="secondary">
                {showGenres(genresArr)}
              </Text>
            </div>
            <div className="filmDescription">
              <Text>
                <p className="overview">{overview}</p>
              </Text>
            </div>
            <div className="raiting">
              <Rate allowHalf defaultValue={0} count={10} onChange={(elem) => ratingRequest(elem, movie.id)} />
            </div>
          </div>
        </div>
      </Col>
    );
  }

  return newCard(movie);
};

export default CardContent;
