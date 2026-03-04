import { useEffect, useRef } from 'react'
import katex from 'katex'

export default function KaTeX({ math, display = false }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current && math) {
      try {
        katex.render(math, ref.current, {
          displayMode: display,
          throwOnError: false,
          trust: true,
        })
      } catch {
        ref.current.textContent = math
      }
    }
  }, [math, display])

  return <span ref={ref} />
}
