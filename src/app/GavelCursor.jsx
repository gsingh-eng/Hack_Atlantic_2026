import { useEffect, useState } from 'react'

export function GavelCursor() {
  const [strikes, setStrikes] = useState([])

  useEffect(() => {
    const onClick = (event) => {
      const id = `${Date.now()}-${Math.random()}`
      const x = event.clientX
      const y = event.clientY
      setStrikes((prev) => [...prev.slice(-10), { id, x, y }])
      window.setTimeout(() => {
        setStrikes((prev) => prev.filter((item) => item.id !== id))
      }, 420)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[300] overflow-hidden">
      {strikes.map((item) => (
        <span
          key={item.id}
          className="gavel-strike"
          style={{ left: item.x, top: item.y }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}
