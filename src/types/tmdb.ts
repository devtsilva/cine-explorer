export type MediaType = 'movie' | 'tv'

export interface Movie {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  release_date?: string
  first_air_date?: string
  genre_ids?: number[]
  genres?: Genre[]
  media_type?: MediaType
  popularity: number
  original_language?: string
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface MovieDetail extends Omit<Movie, 'genre_ids'> {
  genres: Genre[]
  runtime?: number
  number_of_seasons?: number
  number_of_episodes?: number
  status: string
  tagline?: string
  homepage?: string
  budget?: number
  revenue?: number
  production_countries?: { name: string }[]
  spoken_languages?: { english_name: string; name: string }[]
  original_title?: string
  original_name?: string
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
  published_at: string
}

export interface WatchProvider {
  logo_path: string
  provider_id: number
  provider_name: string
  display_priority: number
}

export interface WatchProviders {
  link: string
  flatrate?: WatchProvider[]
  rent?: WatchProvider[]
  buy?: WatchProvider[]
}

export interface Genre {
  id: number
  name: string
}

export interface Image {
  file_path: string
  width: number
  height: number
  vote_average: number
}

export interface ApiResponse<T> {
  results: T[]
  page: number
  total_pages: number
  total_results: number
}

export interface DiscoverParams {
  page?: number
  sort_by?: string
  with_genres?: number
  'vote_average.gte'?: number
  'vote_average.lte'?: number
  'primary_release_date.gte'?: string
  'primary_release_date.lte'?: string
  with_original_language?: string
  year?: number
}
