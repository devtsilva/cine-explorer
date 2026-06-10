import './GenreFilter.css'

export interface Category {
  id: string
  label: string
  genreId?: number
  endpoint?: string
}

export const CATEGORIES: Category[] = [
  { id: 'trending',   label: '🔥 Em Alta' },
  { id: 'popular',    label: '⭐ Populares' },
  { id: 'top_rated',  label: '🏆 Mais Votados' },
  { id: 'now_playing',label: '🎬 Em Cartaz' },
  { id: 'upcoming',   label: '📅 Em Breve' },
  { id: 'mood',       label: '🎭 Por Humor' },
  { id: 28,  label: 'Ação',          genreId: 28  } as unknown as Category,
  { id: 12,  label: 'Aventura',      genreId: 12  } as unknown as Category,
  { id: 878, label: 'Ficção Científica', genreId: 878 } as unknown as Category,
  { id: 27,  label: 'Terror',        genreId: 27  } as unknown as Category,
  { id: 18,  label: 'Drama',         genreId: 18  } as unknown as Category,
  { id: 35,  label: 'Comédia',       genreId: 35  } as unknown as Category,
  { id: 10749, label: 'Romance',     genreId: 10749 } as unknown as Category,
  { id: 16,  label: 'Animação',      genreId: 16  } as unknown as Category,
  { id: 99,  label: 'Documentário',  genreId: 99  } as unknown as Category,
  { id: 36,  label: 'Clássicos',     genreId: 36  } as unknown as Category,
]

interface Props {
  selected: string
  onChange: (id: string) => void
}

export function GenreFilter({ selected, onChange }: Props) {
  return (
    <div className="genre-filter" role="tablist" aria-label="Categorias">
      {CATEGORIES.map(cat => (
        <button
          key={String(cat.id)}
          role="tab"
          aria-selected={selected === String(cat.id)}
          className={`genre-filter__chip ${selected === String(cat.id) ? 'active' : ''}`}
          onClick={() => onChange(String(cat.id))}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
