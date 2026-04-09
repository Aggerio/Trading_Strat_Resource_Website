'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', end: true },
  { href: '/strategies', label: 'Strategy Library' },
  { href: '/lessons', label: 'Learning Path' },
  { href: '/visualizer', label: 'Payoff Visualizer' },
  { href: '/glossary', label: 'Glossary' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>StrategyTrainer</h1>
          <p>151 Trading Strategies</p>
        </div>
        <nav>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href && item.end ? 'active' : pathname.startsWith(item.href) && !item.end ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}