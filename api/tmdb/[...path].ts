export default async function handler(req: any, res: any) {
  const pathParts: string[] = Array.isArray(req.query.path)
    ? req.query.path
    : req.query.path ? [req.query.path] : []

  const tmdbPath = pathParts.join('/')
  const tmdbUrl = new URL(`https://api.themoviedb.org/3/${tmdbPath}`)

  const { path: _path, ...params } = req.query
  for (const [key, value] of Object.entries(params)) {
    tmdbUrl.searchParams.set(key, String(value))
  }
  tmdbUrl.searchParams.set('api_key', process.env.TMDB_API_KEY ?? '')

  const response = await fetch(tmdbUrl.toString())
  const data = await response.json()

  res.status(response.status).json(data)
}
