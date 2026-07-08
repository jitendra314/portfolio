import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle({ size = 16 }) {
  const { isDark, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="btn btn-ghost btn-icon"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <span style={{ display: 'flex', transition: 'transform 0.3s, opacity 0.3s', transform: isDark ? 'rotate(0deg)' : 'rotate(-90deg)', opacity: isDark ? 1 : 0, position: isDark ? 'static' : 'absolute' }}>
        <Moon size={size} />
      </span>
      <span style={{ display: 'flex', transition: 'transform 0.3s, opacity 0.3s', transform: isDark ? 'rotate(90deg)' : 'rotate(0deg)', opacity: isDark ? 0 : 1, position: isDark ? 'absolute' : 'static' }}>
        <Sun size={size} />
      </span>
    </button>
  )
}
