import { NavLink, Link } from 'react-router-dom';
import { RoutePaths } from '@/shared/config/routes'; // Импортируем константы
import { SearchInput } from '@/features/search-movie/ui/SearchInput';
import styles from './Header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to={RoutePaths.HOME} className={styles.logo}>
          KINOMONSTER
        </Link>
        
        <nav className={styles.nav}>
          <NavLink 
            to={RoutePaths.HOME} 
            className={({ isActive }) => isActive ? styles.active : ''}
          >
            Главная
          </NavLink>
          
          <NavLink 
            to={RoutePaths.MOVIES} 
            className={({ isActive }) => isActive ? styles.active : ''}
          >
            Популярные фильмы
          </NavLink>
          
          <NavLink 
            to={RoutePaths.SERIES} 
            className={({ isActive }) => isActive ? styles.active : ''}
          >
            Сериалы
          </NavLink>
        </nav>

        <div className={styles.searchSection}>
            <SearchInput />
        </div>
      </div>
    </header>
  );
};