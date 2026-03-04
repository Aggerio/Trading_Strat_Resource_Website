import { useEffect, useRef } from 'react'
import katex from 'katex'

export default function MarkdownRenderer({ content }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current || !content) return
    let html = content
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^\- (.+)$/gm, '<li>$1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')

    // Tables
    html = html.replace(/\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)+)/g, (_, header, body) => {
      const ths = header.split('|').filter(Boolean).map(h => `<th>${h.trim()}</th>`).join('')
      const rows = body.trim().split('\n').map(row => {
        const tds = row.split('|').filter(Boolean).map(d => `<td>${d.trim()}</td>`).join('')
        return `<tr>${tds}</tr>`
      }).join('')
      return `<table><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table>`
    })

    html = html.replace(/<li>/g, (_, i) => {
      const before = html.substring(0, html.indexOf('<li>'))
      return '<li>'
    })

    html = html.replace(/\n\n/g, '</p><p>')
    html = `<p>${html}</p>`
    html = html.replace(/<p>\s*(<h[1-3]>)/g, '$1')
    html = html.replace(/(<\/h[1-3]>)\s*<\/p>/g, '$1')
    html = html.replace(/<p>\s*<table>/g, '<table>')
    html = html.replace(/<\/table>\s*<\/p>/g, '</table>')

    ref.current.innerHTML = html

    // Render LaTeX display math ($$...$$)
    ref.current.querySelectorAll('p, td, li, div').forEach(el => {
      if (el.innerHTML.includes('$$')) {
        el.innerHTML = el.innerHTML.replace(/\$\$(.+?)\$\$/gs, (_, tex) => {
          const span = document.createElement('span')
          try {
            katex.render(tex.trim(), span, { displayMode: true, throwOnError: false })
          } catch { span.textContent = tex }
          return span.outerHTML
        })
      }
      // Inline math \\(...\\)
      if (el.innerHTML.includes('\\(')) {
        el.innerHTML = el.innerHTML.replace(/\\\((.+?)\\\)/g, (_, tex) => {
          const span = document.createElement('span')
          try {
            katex.render(tex.trim(), span, { displayMode: false, throwOnError: false })
          } catch { span.textContent = tex }
          return span.outerHTML
        })
      }
    })
  }, [content])

  return <div ref={ref} className="lesson-content" />
}
