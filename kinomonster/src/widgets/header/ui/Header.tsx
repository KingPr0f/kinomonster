import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import { SearchInput } from '@/features/search-movie/ui/SearchInput';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          KINOMONSTER
        </Link>
        
        <nav className={styles.nav}>
          <Link to="/">Главная</Link>
          {/* ИСПРАВЛЕНО: путь должен быть /movies, как в App.tsx */}
          <Link to="/movies">Популярные фильмы</Link> 
          <Link to="/series">Сериалы</Link>
        </nav>

        <div className={styles.searchSection}>
            <SearchInput />
        </div>
      </div>
    </header>
  );
};