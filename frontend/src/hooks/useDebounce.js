import { useState, useEffect } from 'react'

/**
 * Debounce a value — useful for search inputs.
 * @param {*} value  - the value to debounce
 * @param {number} delay - milliseconds to wait
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])

  return debounced
}
