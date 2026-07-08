import { useState } from 'react'
import { X } from 'lucide-react'

/**
 * Tag/chip input — enter tags by pressing Enter or comma.
 * Props: value (string[]), onChange (string[] => void), placeholder
 */
export default function TagInput({ value = [], onChange, placeholder = 'Add tag…' }) {
  const [input, setInput] = useState('')

  const add = (raw) => {
    const tag = raw.trim()
    if (tag && !value.includes(tag)) onChange([...value, tag])
    setInput('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input) }
    if (e.key === 'Backspace' && !input && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  const remove = (tag) => onChange(value.filter(t => t !== tag))

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center',
      padding: '0.45rem 0.7rem', background: 'var(--bg-3)',
      border: '1px solid var(--border)', borderRadius: '8px',
      cursor: 'text', minHeight: '42px',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}
      onClick={e => e.currentTarget.querySelector('input')?.focus()}
    >
      {value.map(tag => (
        <span key={tag} style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
          fontSize: '0.78rem', fontWeight: 500, padding: '0.2rem 0.55rem',
          borderRadius: '100px', background: 'rgba(124,106,247,0.15)',
          color: 'var(--accent-2)', border: '1px solid rgba(124,106,247,0.25)',
        }}>
          {tag}
          <button type="button" onClick={() => remove(tag)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex', lineHeight: 1 }}>
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => input.trim() && add(input)}
        placeholder={value.length === 0 ? placeholder : ''}
        style={{
          flex: 1, minWidth: '80px', border: 'none', background: 'none',
          color: 'var(--text)', fontFamily: 'inherit', fontSize: '0.9rem',
          outline: 'none', padding: '0.1rem',
        }}
      />
    </div>
  )
}
