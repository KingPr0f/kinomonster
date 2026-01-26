import { Hero } from '@/widgets/hero/ui/Hero';
import { MovieList } from '@/widgets/movie-list/ui/MovieList';
import styles from './Home.module.scss';
import { CategoryMovieList } from '@/widgets/category-movie-list/ui/CategoryMovieList';

export const Home = () => {
  return (
    <>
      <Hero />
      <div className={styles.container}>
        <section className={styles.section}>
           <h2>Популярные фильмы</h2>
           <MovieList />
        </section>

        {/* НАШ НОВЫЙ БЛОК */}
        <CategoryMovieList />
      </div>
    </>
  );
};