import { Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import StrategyLibrary from './pages/StrategyLibrary'
import StrategyDetail from './pages/StrategyDetail'
import Lessons from './pages/Lessons'
import LessonDetail from './pages/LessonDetail'
import QuizPage from './pages/QuizPage'
import PayoffVisualizer from './pages/PayoffVisualizer'
import Glossary from './pages/Glossary'

export default function App() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>StrategyTrainer</h1>
          <p>151 Trading Strategies</p>
        </div>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/strategies">Strategy Library</NavLink>
          <NavLink to="/lessons">Learning Path</NavLink>
          <NavLink to="/visualizer">Payoff Visualizer</NavLink>
          <NavLink to="/glossary">Glossary</NavLink>
        </nav>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/strategies" element={<StrategyLibrary />} />
          <Route path="/strategies/:id" element={<StrategyDetail />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/:id" element={<LessonDetail />} />
          <Route path="/quiz/:id" element={<QuizPage />} />
          <Route path="/visualizer" element={<PayoffVisualizer />} />
          <Route path="/glossary" element={<Glossary />} />
        </Routes>
      </main>
    </div>
  )
}
