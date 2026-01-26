import { useGetPopularSeriesQuery } from '@/shared/api/kinopoiskApi';
import { MovieCard } from '@/entities/movie/ui/MovieCard/MovieCard';
import styles from './SeriesPage.module.scss'; 

export const SeriesPage = () => {
  const { data } = useGetPopularSeriesQuery({ page: 1 });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Популярные сериалы</h1>
        <div className={styles.grid}>
          {data?.results.map(series => <MovieCard key={series.id} movie={series} />)}
        </div>
      </div>
    </div>
  );
};