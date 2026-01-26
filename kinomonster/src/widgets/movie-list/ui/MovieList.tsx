import { useGetMoviesQuery } from '@/shared/api/kinopoiskApi';
import { MovieCard } from '@/entities/movie/ui/MovieCard/MovieCard';
import styles from './MovieList.module.scss';

export const MovieList = () => {
  const { data, isLoading, error } = useGetMoviesQuery({ page: 1 });

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки</div>;

  return (
    <div className={styles.grid}>
      {/* Исправили data.docs на data.results */}
      {data?.results.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};