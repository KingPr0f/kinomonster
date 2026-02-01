import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, createSearchParams } from 'react-router-dom';
import { RoutePaths } from '@/shared/config/routes';
import styles from './SearchInput/SearchInput.module.scss'

export const SearchInput = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Получаем текущее значение из URL для инициализации (чтобы поиск не стирался при F5)
  const queryFromUrl = searchParams.get('query') || '';
  const [value, setValue] = useState(queryFromUrl);

   /**
   * Эффект для синхронизации URL -> Input.
   * Если мы перешли на главную или сбросили параметры, инпут должен очиститься.
   */
  useEffect(() => {
    setValue(queryFromUrl);
  }, [queryFromUrl, location.pathname]);

  /**
   * Эффект для Debounce (отложенного поиска).
   * Ждем 500мс после того, как пользователь закончит печатать, прежде чем менять URL.
   * Это предотвращает лишние перерисовки и нагрузку на историю браузера.
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value.trim() && value !== queryFromUrl) {
        // Безопасный переход с createSearchParams
        navigate({
          pathname: RoutePaths.SEARCH,
          search: createSearchParams({ query: value }).toString(),
        });
      } else if (value === '' && location.pathname === RoutePaths.SEARCH) {
        navigate(RoutePaths.HOME);
      }
    }, 500);
    // Cleanup функция: очищает таймер, если пользователь нажал кнопку до истечения 500мс
    return () => clearTimeout(timeout);
  }, [value, navigate, location.pathname, queryFromUrl]);

  return (
    <div className={styles.searchWrapper}>
      <input
        type="text"
        className={styles.input}
        placeholder="Поиск фильмов..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <span className={styles.icon}>🔍</span>
    </div>
  );
};