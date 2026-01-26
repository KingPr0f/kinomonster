import { useGetMoviesQuery } from '@/shared/api/kinopoiskApi';
import { Link } from 'react-router-dom';
import styles from './Hero.module.scss';

export const Hero = () => {
  // Берем первый фильм из популярных
  const { data, isLoading } = useGetMoviesQuery({ page: 1 });
  const movie = data?.results[0];

  if (isLoading || !movie) return <div className={styles.skeleton}></div>;

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  return (
    <section 
      className={styles.hero} 
      style={{ backgroundImage: `url(${backdropUrl})` }}
    >
      <div className={styles.overlay}>
        <div className={styles.content}>
          <span className={styles.badge}>Уже в кино</span>
          <h1 className={styles.title}>{movie.title}</h1>
          
          <div className={styles.meta}>
            <span className={styles.year}>
                {movie.release_date?.split('-')[0] || 'Н/Д'}
            </span>

            <span className={styles.rating}>
                {movie.vote_average?.toFixed(1) || '0.0'}
            </span>
          </div>

          <p className={styles.description}>{movie.overview}</p>

          <Link to={`/movie/${movie.id}`} className={styles.button}>
            Смотреть
          </Link>
        </div>
      </div>
    </section>
  );
};