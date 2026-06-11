export default async function handler(req, res) {
  const { path, ...params } = req.query

  if (!path) {
    res.status(400).json({ error: 'Missing path' })
    return
  }

  const tmdbUrl = new URL(`https://api.themoviedb.org/3/${path}`)
  for (const [key, value] of Object.entries(params)) {
    tmdbUrl.searchParams.set(key, String(value))
  }
  tmdbUrl.searchParams.set('api_key', process.env.TMDB_API_KEY ?? '')

  const response = await fetch(tmdbUrl.toString())
  const data = await response.json()

  res.status(response.status).json(data)
}
