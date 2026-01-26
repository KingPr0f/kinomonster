import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import styles from './SearchInput/SearchInput.module.scss';

export const SearchInput = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // 1. Берем начальное значение
  const queryFromUrl = searchParams.get('query') || '';
  const [value, setValue] = useState(queryFromUrl);

  // 2. СИНХРОНИЗАЦИЯ: Если мы нажали на логотип или перешли на другую страницу, 
  // где нет query — очищаем инпут.
  useEffect(() => {
    setValue(queryFromUrl);
  }, [queryFromUrl, location.pathname]);

  // 3. DEBOUNCE: Переход на страницу поиска при печати
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Переходим к поиску только если значение в инпуте изменилось 
      // и оно не совпадает с тем, что уже в URL
      if (value.trim() && value !== queryFromUrl) {
        navigate(`/search?query=${value}`);
      } 
      // Если пользователь стер всё вручную, будучи на странице поиска
      else if (value === '' && location.pathname === '/search') {
        navigate('/');
      }
    }, 500);

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