import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  useGetMovieByIdQuery, 
  useGetMovieCreditsQuery, 
  useGetRelatedMoviesQuery 
} from '@/shared/api/kinopoiskApi';
import { ActorCard } from '@/entities/actor/ui/ActorCard/ActorCard';
import { MovieCard } from '@/entities/movie/ui/MovieCard/MovieCard';
import styles from './MovieDetails.module.scss';

export const MovieDetails = () => {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { data: movie, isLoading: isMovieLoading } = useGetMovieByIdQuery(id || '');
  const { data: creditsData } = useGetMovieCreditsQuery(id || '');
  const { data: related } = useGetRelatedMoviesQuery(id || '');

  // Early return - если грузится или нет фильма, выходим сразу
  if (isMovieLoading || !movie) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  // Режиссера мы теперь достаем из creditsData.director, который посчитал API
  const director = creditsData?.director;

  return (
    <div className={styles.page}>
      <div 
        className={styles.backdrop} 
        style={{ backgroundImage: `url(${movie.backdropUrl})` }}
      >
        <div className={styles.overlay}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.poster}>
            <img src={movie.posterUrl} alt={movie.title} />
          </div>

          <div className={styles.info}>
            <h1 className={styles.title}>{movie.title}</h1>
            <div className={styles.originalTitle}>{movie.originalTitle}</div>

            <div className={styles.meta}>
              <span className={styles.ratingBadge}>{movie.rating}</span>
              <span>{movie.year}</span>
              {movie.runtime && <span>{movie.runtime} мин.</span>}
            </div>

            <div className={styles.genres}>
              {movie.genres?.map((genre) => (
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
                    <span className={styles.detailValue}>{movie.countryList}</span>
                </div>
            </div>

            <h3 className={styles.subtitle}>О фильме</h3>
            <p className={styles.description}>{movie.overview}</p>

            <button className={styles.watchBtn}>Смотреть</button>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.subtitle}>В главных ролях</h2>
          <div className={styles.actorsList}>
            {creditsData?.cast.map((actor) => (
              <ActorCard 
                key={actor.id}
                name={actor.name}
                character={actor.character}
                photoUrl={actor.photoUrl} // Используем готовый URL
              />
            ))}
          </div>
        </section>

        {(related?.results.length ?? 0) > 0 && (
          <section className={styles.section}>
            <h2 className={styles.subtitle}>Возможно, вам понравится</h2>
            <div className={styles.relatedGrid}>
              {related?.results.slice(0, 5).map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};