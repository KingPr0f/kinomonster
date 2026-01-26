import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  useGetMovieByIdQuery, 
  useGetMovieCreditsQuery, 
  useGetRelatedMoviesQuery 
} from '../../../shared/api/kinopoiskApi';

import { ActorCard } from '../../../entities/actor/ui/ActorCard/ActorCard';
import { MovieCard } from '../../../entities/movie/ui/MovieCard/MovieCard';

import styles from './MovieDetails.module.scss';

export const MovieDetails = () => {
  const { id } = useParams();

  // Автоматический скролл вверх при переходе на новый фильм
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { data: movie, isLoading: isMovieLoading } = useGetMovieByIdQuery(id || '');
  const { data: credits } = useGetMovieCreditsQuery(id || '');
  const { data: related } = useGetRelatedMoviesQuery(id || '');

  if (isMovieLoading || !movie) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  // --- ЛОГИКА ДАННЫХ ---
  
  // 1. Перевод стран на русский через встроенный Intl
  const regionNames = new Intl.DisplayNames(['ru'], { type: 'region' });
  const countries = movie.production_countries
    ?.map((c: any) => {
      try {
        return regionNames.of(c.iso_3166_1);
      } catch {
        return c.name;
      }
    })
    .join(', ') || 'Не указана';

  // 2. Поиск режиссера
  const director = credits?.crew?.find((person: any) => person.job === 'Director')?.name || 'Неизвестен';

  // 3. Ссылки на изображения
  const imageBase = 'https://image.tmdb.org/t/p/w500';
  const originalImageBase = 'https://image.tmdb.org/t/p/original';
  
  const year = movie.release_date?.split('-')[0] || '';
  const rating = movie.vote_average?.toFixed(1) || '0.0';

  return (
    <div className={styles.page}>
      {/* Большой фоновый баннер */}
      <div 
        className={styles.backdrop} 
        style={{ backgroundImage: `url(${originalImageBase}${movie.backdrop_path})` }}
      >
        <div className={styles.overlay}></div>
      </div>

      <div className={styles.container}>
        {/* Основной блок: Постер + Инфо */}
        <div className={styles.contentWrapper}>
          <div className={styles.poster}>
            <img src={`${imageBase}${movie.poster_path}`} alt={movie.title} />
          </div>

          <div className={styles.info}>
            <h1 className={styles.title}>{movie.title}</h1>
            <div className={styles.originalTitle}>{movie.original_title}</div>

            <div className={styles.meta}>
              <span className={styles.ratingBadge}>{rating}</span>
              <span>{year}</span>
              {movie.runtime && <span>{movie.runtime} мин.</span>}
            </div>

            <div className={styles.genres}>
              {movie.genres?.map((genre: any) => (
                <span key={genre.id} className={styles.genreTag}>{genre.name}</span>
              ))}
            </div>

            <div className={styles.detailsList}>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Режиссер:</span>
                    <span className={styles.detailValue}>{director}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Страна:</span>
                    <span className={styles.detailValue}>{countries}</span>
                </div>
            </div>

            <h3 className={styles.subtitle}>О фильме</h3>
            <p className={styles.description}>{movie.overview || 'Описание отсутствует.'}</p>

            <button className={styles.watchBtn}>Смотреть</button>
          </div>
        </div>

        {/* Секция: Актеры */}
        <section className={styles.section}>
          <h2 className={styles.subtitle}>В главных ролях</h2>
          <div className={styles.actorsList}>
            {credits?.cast?.slice(0, 15).map((actor: any) => (
              <ActorCard 
                key={actor.id}
                name={actor.name}
                character={actor.character}
                photoUrl={actor.profile_path}
              />
            ))}
          </div>
        </section>

        {/* Секция: Похожие фильмы */}
        {related?.results && related.results.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.subtitle}>Возможно, вам понравится</h2>
            <div className={styles.relatedGrid}>
              {related.results.slice(0, 5).map((m: any) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};