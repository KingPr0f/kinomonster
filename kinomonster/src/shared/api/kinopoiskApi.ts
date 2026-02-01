import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG, IMAGE_CONFIG } from '../config/constants';
import { getYearFromDate } from '../lib/dateUtils';

/**
 * Интерфейс IMovie описывает "идеальную" структуру фильма,
 * которую мы хотим использовать в UI.
 * Все поля уже обработаны и готовы к отрисовке (без null, undefined и сырых данных).
 */
export interface IMovie {
  id: number;
  title: string;          // Единое поле для названия
  posterUrl: string;      // Полный путь к картинке
  backdropUrl: string;    // Полный путь к фону
  year: string;           // Год выпуска
  rating: string;         // Отформатированный рейтинг
  overview: string;
  genres?: { id: number; name: string }[];
  runtime?: number;
  // Поля ниже нужны только для детальной страницы
  director?: string;
  countryList?: string;
  originalTitle?: string;
}

export interface IActor {
  id: number;
  name: string;
  photoUrl: string;
  character: string;
}

export interface IResponse {
  results: IMovie[];
  page: number;
  total_pages: number;
}


/**
 * Утилита для нормализации данных (Pattern: Adapter).
 * Преобразует "сырой" ответ от TMDB в удобный формат для нашего UI.
 * Это позволяет убрать логику обработки данных (split, join, проверки на null) из компонентов.
 */
const transformMovie = (movie: any): IMovie => ({
  id: movie.id,
  // API может возвращать title (фильмы) или name (сериалы) — приводим к единому виду
  title: movie.title || movie.name || movie.original_title || 'Без названия',
  originalTitle: movie.original_title || movie.original_name,
  // Собираем полный URL картинки сразу здесь
  posterUrl: movie.poster_path 
    ? `${IMAGE_CONFIG.BASE_URL}${movie.poster_path}` 
    : IMAGE_CONFIG.PLACEHOLDER,
  backdropUrl: movie.backdrop_path 
    ? `${IMAGE_CONFIG.ORIGINAL_URL}${movie.backdrop_path}` 
    : '',
    // Форматируем дату и рейтинг
  year: getYearFromDate(movie.release_date || movie.first_air_date),
  rating: movie.vote_average ? movie.vote_average.toFixed(1) : '0.0',
  overview: movie.overview || 'Описание отсутствует',
  genres: movie.genres,
  runtime: movie.runtime,
  // Для детальной страницы (будет заполнено только в getMovieById)
  director: '', 
  countryList: '',
});

export const kinopoiskApi = createApi({
  reducerPath: 'kinopoiskApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.URL,
  }),
  endpoints: (builder) => ({
    // 1. Списки фильмов (Главная, Поиск, Фильтры)
    getMovies: builder.query<IResponse, { page?: number }>({
      query: ({ page = 1 }) => ({
        url: '/movie/popular',
        // Используем конфиг, чтобы не хардкодить ключи
        params: { api_key: API_CONFIG.KEY, language: API_CONFIG.LANG, page },
      }),
       // transformResponse позволяет модифицировать данные ДО того, как они попадут в кэш и компоненты.
      transformResponse: (response: any) => ({
        ...response,
        results: response.results.map(transformMovie),
      }),
    }),

    getPopularSeries: builder.query<IResponse, { page?: number }>({
      query: ({ page = 1 }) => ({
        url: '/tv/popular',
        params: { api_key: API_CONFIG.KEY, language: API_CONFIG.LANG, page },
      }),
      transformResponse: (response: any) => ({
        ...response,
        results: response.results.map(transformMovie),
      }),
    }),

    // 2. Детальная информация (Здесь происходит сложная трансформация)
    getMovieById: builder.query<IMovie, string>({
      query: (id) => ({
        url: `/movie/${id}`,
        params: { api_key: API_CONFIG.KEY, language: API_CONFIG.LANG },
      }),
      transformResponse: (raw: any) => {
        const base = transformMovie(raw);
        
        // Логика перевода кодов стран (US -> США) вынесена сюда, чтобы разгрузить компонент
        const regionNames = new Intl.DisplayNames(['ru'], { type: 'region' });
        const countries = raw.production_countries?.map((c: any) => {
            try { return regionNames.of(c.iso_3166_1); } catch { return c.name; }
        }).join(', ') || 'Не указана';

        return {
          ...base,
          countryList: countries,
        };
      },
    }),

    // 3. Актеры (Трансформируем фото и режиссера)
    getMovieCredits: builder.query<{ cast: IActor[], director: string }, string>({
      query: (id) => ({
        url: `/movie/${id}/credits`,
        params: { api_key: API_CONFIG.KEY, language: API_CONFIG.LANG },
      }),
      transformResponse: (response: any) => ({
        cast: response.cast.slice(0, 15).map((actor: any) => ({
          id: actor.id,
          name: actor.name,
          character: actor.character,
          photoUrl: actor.profile_path 
            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` 
            : IMAGE_CONFIG.ACTOR_PLACEHOLDER
        })),
        director: response.crew.find((p: any) => p.job === 'Director')?.name || 'Неизвестен'
      }),
    }),

    // 4. Остальные запросы (поиск, похожие, дискавери) - тоже трансформируем
    getRelatedMovies: builder.query<IResponse, string>({
      query: (id) => ({
        url: `/movie/${id}/recommendations`,
        params: { api_key: API_CONFIG.KEY, language: API_CONFIG.LANG, page: 1 },
      }),
      transformResponse: (response: any) => ({ ...response, results: response.results.map(transformMovie) }),
    }),

    searchMovies: builder.query<IResponse, { query: string; page?: number }>({
      query: ({ query, page = 1 }) => ({
        url: '/search/movie',
        params: { api_key: API_CONFIG.KEY, language: API_CONFIG.LANG, query, page },
      }),
      transformResponse: (response: any) => ({ ...response, results: response.results.map(transformMovie) }),
    }),

    getDiscoverMovies: builder.query<IResponse, { genre?: string; year?: string; country?: string }>({
      query: ({ genre, year, country }) => ({
        url: '/discover/movie',
        params: {
          api_key: API_CONFIG.KEY,
          language: API_CONFIG.LANG,
          with_genres: genre,
          primary_release_year: year,
          with_origin_country: country,
          sort_by: 'popularity.desc',
          'vote_count.gte': 100,
        },
      }),
      transformResponse: (response: any) => ({ ...response, results: response.results.map(transformMovie) }),
    }),

    getGenres: builder.query<{ genres: { id: number; name: string }[] }, void>({
      query: () => ({
        url: '/genre/movie/list',
        params: { api_key: API_CONFIG.KEY, language: API_CONFIG.LANG },
      }),
    }),
  }),
});

export const { 
  useGetMoviesQuery, useGetPopularSeriesQuery, useGetMovieByIdQuery, 
  useGetMovieCreditsQuery, useGetRelatedMoviesQuery, useSearchMoviesQuery, 
  useGetGenresQuery, useGetDiscoverMoviesQuery 
} = kinopoiskApi;