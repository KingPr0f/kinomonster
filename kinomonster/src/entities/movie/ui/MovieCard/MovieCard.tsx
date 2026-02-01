import { Link } from 'react-router-dom';
import type { IMovie } from '@/shared/api/kinopoiskApi'; // Путь может отличаться
import { RoutePaths } from '@/shared/config/routes';
import styles from './MovieCard.module.scss';

interface MovieCardProps {
  movie: IMovie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  // Логики больше нет! Она вся в transformResponse
  return (
    <Link to={`${RoutePaths.MOVIE_DETAILS}/${movie.id}`} className={styles.card}>
      <div className={styles.posterWrapper}>
        <img src={movie.posterUrl} alt={movie.title} className={styles.image} />
        {movie.rating !== "0.0" && <span className={styles.rating}>{movie.rating}</span>}
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.year}>{movie.year}</p>
      </div>
    </Link>
  );
};