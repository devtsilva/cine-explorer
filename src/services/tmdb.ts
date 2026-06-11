import axios from 'axios'
import type {
  Movie, MovieDetail, Video, Genre, ApiResponse,
  CastMember, CrewMember, WatchProviders, Image, DiscoverParams
} from '../types/tmdb'

export const IMAGE_BASE = 'https://image.tmdb.org/t/p'
export const PROVIDER_IMAGE = 'https://image.tmdb.org/t/p/original'

const api = axios.create({ baseURL: '/api/proxy', params: { language: 'pt-BR' } })

api.interceptors.request.use((config) => {
  const url = new URL(config.url ?? '', 'http://x')
  const tmdbPath = url.pathname.replace(/^\//, '')
  config.url = ''
  config.params = { ...config.params, path: tmdbPath }
  return config
})

export const tmdb = {
  /* ── Trending & Discovery ── */
  getTrending: (page = 1) =>
    api.get<ApiResponse<Movie>>('/trending/all/week', { params: { page } }),

  getPopularMovies: (page = 1) =>
    api.get<ApiResponse<Movie>>('/movie/popular', { params: { page } }),

  getTopRated: (page = 1) =>
    api.get<ApiResponse<Movie>>('/movie/top_rated', { params: { page } }),

  getNowPlaying: (page = 1) =>
    api.get<ApiResponse<Movie>>('/movie/now_playing', { params: { page } }),

  getUpcoming: (page = 1) =>
    api.get<ApiResponse<Movie>>('/movie/upcoming', { params: { page } }),

  getPopularTV: (page = 1) =>
    api.get<ApiResponse<Movie>>('/tv/popular', { params: { page } }),

  getTopRatedTV: (page = 1) =>
    api.get<ApiResponse<Movie>>('/tv/top_rated', { params: { page } }),

  /* ── Discover (filters + genre) ── */
  discoverMovies: (params: DiscoverParams) =>
    api.get<ApiResponse<Movie>>('/discover/movie', { params }),

  discoverTV: (params: DiscoverParams) =>
    api.get<ApiResponse<Movie>>('/discover/tv', { params }),

  /* ── Search ── */
  searchMulti: (query: string, page = 1) =>
    api.get<ApiResponse<Movie>>('/search/multi', { params: { query, page } }),

  searchMovies: (query: string, page = 1) =>
    api.get<ApiResponse<Movie>>('/search/movie', { params: { query, page } }),

  searchTV: (query: string, page = 1) =>
    api.get<ApiResponse<Movie>>('/search/tv', { params: { query, page } }),

  /* ── Details ── */
  getMovieDetail: (id: number) =>
    api.get<MovieDetail>(`/movie/${id}`),

  getTvDetail: (id: number) =>
    api.get<MovieDetail>(`/tv/${id}`),

  getCredits: (id: number, type: 'movie' | 'tv') =>
    api.get<{ cast: CastMember[]; crew: CrewMember[] }>(`/${type}/${id}/credits`),

  getVideos: (id: number, type: 'movie' | 'tv') =>
    api.get<{ results: Video[] }>(`/${type}/${id}/videos`),

  getSimilar: (id: number, type: 'movie' | 'tv', page = 1) =>
    api.get<ApiResponse<Movie>>(`/${type}/${id}/similar`, { params: { page } }),

  getRecommendations: (id: number, type: 'movie' | 'tv') =>
    api.get<ApiResponse<Movie>>(`/${type}/${id}/recommendations`),

  getWatchProviders: (id: number, type: 'movie' | 'tv') =>
    api.get<{ results: Record<string, WatchProviders> }>(`/${type}/${id}/watch/providers`),

  getImages: (id: number, type: 'movie' | 'tv') =>
    api.get<{ backdrops: Image[]; posters: Image[] }>(`/${type}/${id}/images`, {
      params: { include_image_language: 'pt,en,null' },
    }),

  /* ── Genres ── */
  getMovieGenres: () =>
    api.get<{ genres: Genre[] }>('/genre/movie/list'),

  getTvGenres: () =>
    api.get<{ genres: Genre[] }>('/genre/tv/list'),
}

/* ── Image helpers ── */
export function posterUrl(path: string | null, size: 'w185' | 'w342' | 'w500' | 'original' = 'w342') {
  return path ? `${IMAGE_BASE}/${size}${path}` : null
}

export function backdropUrl(path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') {
  return path ? `${IMAGE_BASE}/${size}${path}` : null
}

export function profileUrl(path: string | null) {
  return path ? `${IMAGE_BASE}/w185${path}` : null
}

/* ── Formatting helpers ── */
export function formatRuntime(minutes?: number) {
  if (!minutes) return null
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}min` : `${m}min`
}

export function formatMoney(amount?: number) {
  if (!amount || amount === 0) return null
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

export function getTitle(m: { title?: string; name?: string }): string {
  return m.title ?? m.name ?? 'Sem título'
}

export function getReleaseYear(m: { release_date?: string; first_air_date?: string }): string {
  const d = m.release_date ?? m.first_air_date ?? ''
  return d.slice(0, 4)
}

export function scoreLabel(score: number): string {
  if (score >= 7.5) return 'score-high'
  if (score >= 6)   return 'score-mid'
  if (score > 0)    return 'score-low'
  return 'score-none'
}
