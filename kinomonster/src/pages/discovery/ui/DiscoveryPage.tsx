import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  useGetDiscoverMoviesQuery, 
  useGetGenresQuery 
} from '../../../shared/api/kinopoiskApi';
import { MovieCard } from '../../../entities/movie/ui/MovieCard/MovieCard';
import { POPULAR_COUNTRIES } from '../../../shared/constants/countries';
import styles from './DiscoveryPage.module.scss';

export const DiscoveryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Скролл вверх при открытии страницы
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 2. Получаем текущие фильтры из URL
  const genre = searchParams.get('genre') || '';
  const year = searchParams.get('year') || '';
  const country = searchParams.get('country') || '';

  // 3. Запросы к API
  const { data: genresData } = useGetGenresQuery();
  const { data: movies, isLoading } = useGetDiscoverMoviesQuery({ 
    genre, 
    year, 
    country 
  });

  // Генерируем список годов (от 2026 до 1970)
  const years = Array.from({ length: 57 }, (_, i) => (2026 - i).toString());

  // Функция обновления фильтров в URL
  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Все фильмы</h1>

        {/* Блок фильтров сверху */}
        <div className={styles.filters}>
          <select 
            value={genre} 
            onChange={(e) => updateFilters('genre', e.target.value)} 
            className={styles.select}
          >
            <option value="">Все жанры</option>
            {genresData?.genres.map((g) => (
              <option key={g.id} value={g.id.toString()}>
                {g.name}
              </option>
            ))}
          </select>

          <select 
            value={year} 
            onChange={(e) => updateFilters('year', e.target.value)} 
            className={styles.select}
          >
            <option value="">Все годы</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y} год
              </option>
            ))}
          </select>

          <select 
            value={country} 
            onChange={(e) => updateFilters('country', e.target.value)} 
            className={styles.select}
          >
            <option value="">Все страны</option>
            {POPULAR_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Результаты поиска */}
        {isLoading ? (
          <div className={styles.status}>Поиск лучших фильмов...</div>
        ) : (
          <div className={styles.grid}>
            {movies?.results && movies.results.length > 0 ? (
              movies.results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))
            ) : (
              <div className={styles.status}>Ничего не найдено по вашему запросу</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};