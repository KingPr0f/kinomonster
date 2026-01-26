import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // 1. Импортируем провайдер
import { store } from './app/store/store'; // 2. Импортируем наш стор
import './app/styles/variables.scss'; // 3. Импортируем переменные (цвета)
import App from './app/App';
import './index.css'; // Можно оставить или удалить, если там пусто

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Оборачиваем App в Provider и передаем store */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);