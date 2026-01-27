// src/app/layouts/BaseLayout.tsx
import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets/header/ui/Header';

/**
 * BaseLayout — Основной шаблон приложения.
 * @description
 * Рендерит сквозной Header и меняющийся контент (Outlet).
 * Это позволяет не перерисовывать шапку при переходе между страницами.
 */
export const BaseLayout = () => {
  return (
    <div className="layout">
      <Header />
      <main>
        {/* Outlet — это плейсхолдер, куда React Router подставляет
            компонент текущей страницы (Home, MovieDetails и т.д.) */}
        <Outlet /> 
      </main>
    </div>
  );
};