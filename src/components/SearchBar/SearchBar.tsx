import { type ChangeEvent, useRef } from 'react'
import './SearchBar.css'

interface Props {
  value: string
  onChange: (v: string) => void
  onClear: () => void
}

export function SearchBar({ value, onChange, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="search-bar">
      <label htmlFor="search-input" className="sr-only">Buscar filmes e séries</label>
      <svg className="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
      <input
        ref={inputRef}
        id="search-input"
        type="search"
        className="search-bar__input"
        placeholder="Buscar filmes, séries..."
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
        aria-label="Buscar filmes e séries"
      />
      {value && (
        <button
          className="search-bar__clear"
          onClick={() => { onClear(); inputRef.current?.focus() }}
          aria-label="Limpar busca"
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      )}
    </div>
  )
}
