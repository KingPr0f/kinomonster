import { useGetMoviesQuery } from '@/shared/api/kinopoiskApi';
import { MovieCard } from '@/entities/movie/ui/MovieCard/MovieCard';
import styles from './MoviesPage.module.scss'; // Можно взять стили от SearchPage

export const MoviesPage = () => {
  const { data } = useGetMoviesQuery({ page: 1 });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Популярные фильмы</h1>
        <div className={styles.grid}>
          {data?.results.map(movie => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </div>
    </div>
  );
};