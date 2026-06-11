export const config = { runtime: 'edge' }

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const tmdbPath = url.pathname.replace(/^\/api\/tmdb\/?/, '')

  const tmdbUrl = new URL(`https://api.themoviedb.org/3/${tmdbPath}`)
  url.searchParams.forEach((value, key) => tmdbUrl.searchParams.set(key, value))
  tmdbUrl.searchParams.set('api_key', process.env.TMDB_API_KEY!)

  const res = await fetch(tmdbUrl)
  const data = await res.json()

  return Response.json(data, { status: res.status })
}
