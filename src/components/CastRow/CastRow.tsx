import { profileUrl } from '../../services/tmdb'
import type { CastMember } from '../../types/tmdb'
import './CastRow.css'

interface Props {
  cast: CastMember[]
}

const AVATAR = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect width="80" height="80" fill="%231a1a28"/%3E%3Ccircle cx="40" cy="30" r="14" fill="%2330304a"/%3E%3Cellipse cx="40" cy="68" rx="22" ry="16" fill="%2330304a"/%3E%3C/svg%3E'

export function CastRow({ cast }: Props) {
  const visible = cast.slice(0, 10)
  if (!visible.length) return null

  return (
    <div className="cast-row" role="list" aria-label="Elenco principal">
      {visible.map(member => (
        <div key={member.id} className="cast-row__item" role="listitem">
          <img
            src={profileUrl(member.profile_path) ?? AVATAR}
            alt={member.name}
            className="cast-row__photo"
            loading="lazy"
            width="80"
            height="120"
          />
          <p className="cast-row__name">{member.name}</p>
          <p className="cast-row__char">{member.character}</p>
        </div>
      ))}
    </div>
  )
}
