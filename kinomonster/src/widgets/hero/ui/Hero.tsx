import { useGetMoviesQuery } from '@/shared/api/kinopoiskApi';
import { Link } from 'react-router-dom';
import { RoutePaths } from '@/shared/config/routes';
import styles from './Hero.module.scss';

export const Hero = () => {
  // Забираем первый фильм из популярных
  const { data, isLoading } = useGetMoviesQuery({ page: 1 });
  const movie = data?.results[0];
   // Early Return паттерн: если данных нет, показываем скелетон и не рендерим основной контент
  if (isLoading || !movie) return <div className={styles.skeleton}></div>;

  return (
    <section 
      className={styles.hero} 
      // Используем movie.backdropUrl, который уже сформирован в transformResponse (API)
      style={{ backgroundImage: `url(${movie.backdropUrl})` }}
    >
      <div className={styles.overlay}>
        <div className={styles.content}>
          <span className={styles.badge}>Уже в кино</span>
          <h1 className={styles.title}>{movie.title}</h1>
          
          <div className={styles.meta}>
            {/* Используем готовое поле year из transformResponse */}
            <span className={styles.year}>{movie.year}</span>
            {/* Используем готовое поле rating */}
            <span className={styles.rating}>{movie.rating}</span>
          </div>

          <p className={styles.description}>{movie.overview}</p>
         {/* Используем константы путей вместо хардкода строк */}
          <Link to={`${RoutePaths.MOVIE_DETAILS}/${movie.id}`} className={styles.button}>
            Смотреть
          </Link>
        </div>
      </div>
    </section>
  );
};