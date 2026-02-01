import { Routes, Route } from 'react-router-dom';
import { BaseLayout } from '../layouts/BaseLayout';
import { Home } from '@/pages/home/ui/Home';
import { MoviesPage } from '@/pages/movies/ui/MoviesPage';
import { SeriesPage } from '@/pages/series/ui/SeriesPage';
import { MovieDetails } from '@/pages/movie-details/ui/MovieDetails';
import { SearchPage } from '@/pages/search/ui/SearchPage';
import { DiscoveryPage } from '@/pages/discovery/ui/DiscoveryPage';
import { RoutePaths } from '@/shared/config/routes';

/**
 * AppRouter — компонент, отвечающий только за маршрутизацию.
 * Вынесен из App.tsx для соблюдения принципа единственной ответственности (SRP).
 * Использует константы RoutePaths для избежания "магических строк".
 */

export const AppRouter = () => {
  return (
    <Routes>
      <Route path={RoutePaths.HOME} element={<BaseLayout />}>
        <Route index element={<Home />} />
        <Route path={RoutePaths.MOVIES} element={<MoviesPage />} />
        <Route path={RoutePaths.SERIES} element={<SeriesPage />} />
        <Route path={`${RoutePaths.MOVIE_DETAILS}/:id`} element={<MovieDetails />} />
        <Route path={RoutePaths.SEARCH} element={<SearchPage />} />
        <Route path={RoutePaths.DISCOVER} element={<DiscoveryPage />} />
      </Route>
    </Routes>
  );
};