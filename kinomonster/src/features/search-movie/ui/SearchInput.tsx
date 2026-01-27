import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import styles from './SearchInput/SearchInput.module.scss';

export const SearchInput = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
 // 1. Инициализация: если в URL уже есть запрос (?query=...), подставляем его в инпут
  const queryFromUrl = searchParams.get('query') || '';
  const [value, setValue] = useState(queryFromUrl);

  // 2. СИНХРОНИЗАЦИЯ: Если мы нажали на логотип или перешли на другую страницу, 
  // где нет query — очищаем инпут.
  useEffect(() => {
    setValue(queryFromUrl);
  }, [queryFromUrl, location.pathname]);

   // 3. Debounce-эффект
  // Мы не отправляем запрос на каждое нажатие клавиши (это положит API).
  // Мы ждем 500мс после того, как пользователь закончил печатать.
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Переходим к поиску только если значение в инпуте изменилось 
      // и оно не совпадает с тем, что уже в URL
      if (value.trim() && value !== queryFromUrl) {
        navigate(`/search?query=${value}`);
      } 
      // Очистка поиска: если стерли текст на странице поиска — идем на главную
      else if (value === '' && location.pathname === '/search') {
        navigate('/');
      }
    }, 500);
    // Cleanup-функция: сбрасывает таймер при каждом новом нажатии клавиши
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