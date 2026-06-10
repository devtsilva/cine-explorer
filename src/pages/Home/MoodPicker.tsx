import './MoodPicker.css'

interface Props {
  moods: string[]
  onSelect: (mood: string) => void
}

export function MoodPicker({ moods, onSelect }: Props) {
  return (
    <div className="mood-picker">
      <h2 className="mood-picker__title">Como você está se sentindo?</h2>
      <p className="mood-picker__sub">Escolha seu humor e encontramos o filme certo</p>
      <div className="mood-picker__grid" role="list">
        {moods.map(mood => (
          <button
            key={mood}
            className="mood-picker__btn"
            onClick={() => onSelect(mood)}
            role="listitem"
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  )
}
