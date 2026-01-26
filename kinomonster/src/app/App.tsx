import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BaseLayout } from './layouts/BaseLayout';
import { Home } from '../pages/home/ui/Home';
import { MovieDetails } from '../pages/movie-details/ui/MovieDetails';
import { SearchPage } from '@/pages/search/ui/SearchPage';
import { DiscoveryPage } from '@/pages/discovery/ui/DiscoveryPage';
import { MoviesPage } from '@/pages/movies/ui/MoviesPage';
import { SeriesPage } from '@/pages/series/ui/SeriesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="series" element={<SeriesPage />} />
          <Route path="movie/:id" element={<MovieDetails />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="discover" element={<DiscoveryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;