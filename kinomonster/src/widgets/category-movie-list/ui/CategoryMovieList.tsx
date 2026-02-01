import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetGenresQuery, useGetDiscoverMoviesQuery } from '@/shared/api/kinopoiskApi';
import { MovieCard } from '@/entities/movie/ui/MovieCard/MovieCard';
import { POPULAR_COUNTRIES } from '@/shared/constants/countries';
import { RoutePaths } from '@/shared/config/routes'; // Импортируем константы
import styles from './CategoryMovieList.module.scss';

export const CategoryMovieList = () => {
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [country, setCountry] = useState('');

  const { data: genresData } = useGetGenresQuery();
  const { data: movies, isLoading } = useGetDiscoverMoviesQuery({ genre, year, country });

  const years = Array.from({ length: 30 }, (_, i) => (2026 - i).toString());

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Фильмы по категориям</h2>

      <div className={styles.filters}>
        <select value={genre} onChange={(e) => setGenre(e.target.value)} className={styles.select}>
          <option value="">Жанры</option>
          {genresData?.genres.map((g) => <option key={g.id} value={g.id.toString()}>{g.name}</option>)}
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)} className={styles.select}>
          <option value="">Годы</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>

        <select value={country} onChange={(e) => setCountry(e.target.value)} className={styles.select}>
          <option value="">Страна</option>
          {POPULAR_COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>

        {/* Используем RoutePaths.DISCOVER */}
        <Link 
          to={`${RoutePaths.DISCOVER}?genre=${genre}&year=${year}&country=${country}`} 
          className={styles.seeAll}
        >
          Смотреть все →
        </Link>
      </div>

      <div className={styles.grid}>
        {isLoading ? (
          <div>Загрузка...</div>
        ) : (
          movies?.results.slice(0, 5).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        )}
      </div>
    </section>
  );
};