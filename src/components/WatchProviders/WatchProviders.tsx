import { PROVIDER_IMAGE } from '../../services/tmdb'
import type { WatchProviders as WPType } from '../../types/tmdb'
import './WatchProviders.css'

interface Props {
  providers: WPType | null
}

export function WatchProviders({ providers }: Props) {
  if (!providers) return null

  const hasAny = providers.flatrate?.length || providers.rent?.length || providers.buy?.length
  if (!hasAny) return (
    <div className="watch-providers watch-providers--empty">
      <p>Não disponível em streaming no Brasil atualmente.</p>
    </div>
  )

  return (
    <div className="watch-providers">
      {providers.flatrate && providers.flatrate.length > 0 && (
        <div className="watch-providers__group">
          <h4 className="watch-providers__label">Streaming</h4>
          <div className="watch-providers__list">
            {providers.flatrate.map(p => (
              <a
                key={p.provider_id}
                href={providers.link}
                target="_blank"
                rel="noopener noreferrer"
                className="watch-providers__item"
                aria-label={`Assistir no ${p.provider_name}`}
                title={p.provider_name}
              >
                <img
                  src={`${PROVIDER_IMAGE}${p.logo_path}`}
                  alt={p.provider_name}
                  width="40"
                  height="40"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>
      )}
      {providers.rent && providers.rent.length > 0 && (
        <div className="watch-providers__group">
          <h4 className="watch-providers__label">Alugar</h4>
          <div className="watch-providers__list">
            {providers.rent.map(p => (
              <a key={p.provider_id} href={providers.link} target="_blank" rel="noopener noreferrer"
                className="watch-providers__item" title={p.provider_name}>
                <img src={`${PROVIDER_IMAGE}${p.logo_path}`} alt={p.provider_name} width="40" height="40" loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
