import { Link } from 'react-router-dom';
import type { IMovie } from '../../../../shared/api/kinopoiskApi';
import styles from './MovieCard.module.scss';

interface MovieCardProps {
  movie: IMovie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const imageBase = 'https://image.tmdb.org/t/p/w500';
  
  const imageUrl = movie.poster_path 
    ? `${imageBase}${movie.poster_path}` 
    : 'https://placehold.co/400x600/1a1a1b/ffffff?text=No+Poster';

  // Поддержка и фильмов (title/release_date), и сериалов (name/first_air_date)
  const title = movie.title || movie.name || movie.original_title || movie.original_name;
  const date = movie.release_date || movie.first_air_date || '';
  const year = date ? date.split('-')[0] : '';
  
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <Link to={`/movie/${movie.id}`} className={styles.card}>
      <div className={styles.posterWrapper}>
        <img src={imageUrl} alt={title} className={styles.image} />
        {rating && rating !== "0.0" && <span className={styles.rating}>{rating}</span>}
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.year}>{year}</p>
      </div>
    </Link>
  );
};