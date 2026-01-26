import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface IMovie {
  id: number;
  title?: string;          // Для фильмов
  name?: string;           // Для сериалов
  original_title?: string;
  original_name?: string;  // Для сериалов
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;   // Для фильмов
  first_air_date?: string; // Для сериалов
  vote_average: number;
  overview: string;
  genres?: { id: number; name: string }[];
  production_countries?: { iso_3166_1: string; name: string }[];
  runtime?: number;
}

export interface IActor {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
}

export interface ICredits {
  cast: IActor[];
  crew: { id: number; name: string; job: string }[];
}

export interface IResponse {
  results: IMovie[];
  page: number;
  total_pages: number;
}

export const kinopoiskApi = createApi({
  reducerPath: 'kinopoiskApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  endpoints: (builder) => ({
    getMovies: builder.query<IResponse, { page?: number }>({
      query: ({ page = 1 }) => ({
        url: '/movie/popular',
        params: { api_key: import.meta.env.VITE_API_KEY, language: 'ru-RU', page },
      }),
    }),
    getPopularSeries: builder.query<IResponse, { page?: number }>({
      query: ({ page = 1 }) => ({
        url: '/tv/popular',
        params: { api_key: import.meta.env.VITE_API_KEY, language: 'ru-RU', page },
      }),
    }),
    getMovieById: builder.query<IMovie, string>({
      query: (id) => ({
        url: `/movie/${id}`, // Для простоты пока ищем только фильмы по ID
        params: { api_key: import.meta.env.VITE_API_KEY, language: 'ru-RU' },
      }),
    }),
    getMovieCredits: builder.query<ICredits, string>({
      query: (id) => ({
        url: `/movie/${id}/credits`,
        params: { api_key: import.meta.env.VITE_API_KEY, language: 'ru-RU' },
      }),
    }),
    getRelatedMovies: builder.query<IResponse, string>({
      query: (id) => ({
        url: `/movie/${id}/recommendations`,
        params: { api_key: import.meta.env.VITE_API_KEY, language: 'ru-RU', page: 1 },
      }),
    }),
    searchMovies: builder.query<IResponse, { query: string; page?: number }>({
      query: ({ query, page = 1 }) => ({
        url: '/search/movie',
        params: { api_key: import.meta.env.VITE_API_KEY, language: 'ru-RU', query, page },
      }),
    }),
    getGenres: builder.query<{ genres: { id: number; name: string }[] }, void>({
      query: () => ({
        url: '/genre/movie/list',
        params: { api_key: import.meta.env.VITE_API_KEY, language: 'ru-RU' },
      }),
    }),
    getDiscoverMovies: builder.query<IResponse, { genre?: string; year?: string; country?: string }>({
      query: ({ genre, year, country }) => ({
        url: '/discover/movie',
        params: {
          api_key: import.meta.env.VITE_API_KEY,
          language: 'ru-RU',
          with_genres: genre,
          primary_release_year: year,
          with_origin_country: country,
          sort_by: 'popularity.desc',
          'vote_count.gte': 100,
        },
      }),
    }),
  }),
});

export const { 
  useGetMoviesQuery, 
  useGetPopularSeriesQuery,
  useGetMovieByIdQuery, 
  useGetMovieCreditsQuery,
  useGetRelatedMoviesQuery,
  useSearchMoviesQuery,
  useGetGenresQuery,
  useGetDiscoverMoviesQuery
} = kinopoiskApi;