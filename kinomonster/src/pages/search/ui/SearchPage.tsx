import { useSearchParams } from 'react-router-dom';
import { useSearchMoviesQuery } from '../../../shared/api/kinopoiskApi';
import { MovieCard } from '../../../entities/movie/ui/MovieCard/MovieCard';
import styles from './SearchPage.module.scss';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';

  // RTK Query магия: запрос отправится автоматически при изменении query
  const { data, isLoading, isError } = useSearchMoviesQuery(
    { query }, 
    { skip: query.length < 2 } // Не ищем, если введено меньше 2 букв
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Результаты поиска: <span>{query}</span>
        </h1>

        {isLoading && <div className={styles.status}>Ищем фильмы...</div>}
        
        {isError && <div className={styles.status}>Ошибка при поиске</div>}

        <div className={styles.grid}>
          {data?.results?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {data?.results?.length === 0 && !isLoading && (
          <div className={styles.status}>По вашему запросу ничего не найдено</div>
        )}
      </div>
    </div>
  );
};