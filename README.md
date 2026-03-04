# Trading Strategy Trainer

A full-stack web application for mastering trading strategies from the "151 Trading Strategies" paper by Kakushadze & Serur. Covers 79 options and stock strategies with interactive lessons, quizzes, a payoff visualizer, and a searchable glossary.

## Quick Start

### Backend (FastAPI)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## Features

- **Strategy Library** — Browse 79 strategies (58 options + 21 stocks) with filters, formulas (KaTeX), and detailed descriptions
- **Learning Path** — 14 progressive lessons across Options and Stocks modules, from beginner to advanced
- **Quiz Engine** — Multiple-choice quizzes for each lesson with scoring, explanations, and pass/fail tracking
- **Payoff Visualizer** — Interactive options payoff diagram builder with presets (covered call, iron condor, butterfly, etc.)
- **Glossary** — 156 searchable trading terms with category filtering and alphabetical index
- **Progress Dashboard** — Track strategies studied, lessons completed, quiz scores, and overall mastery

## Tech Stack

- **Backend**: Python 3.11+, FastAPI, SQLAlchemy, SQLite, NumPy
- **Frontend**: React 18, Vite, Plotly.js, KaTeX
- **Database**: SQLite (auto-created and seeded on first startup)

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/strategies/` | GET | List/filter strategies |
| `/api/strategies/{id}` | GET | Strategy detail |
| `/api/strategies/filters` | GET | Available filter values |
| `/api/lessons/` | GET | List lessons |
| `/api/lessons/{id}` | GET | Lesson detail with content |
| `/api/quizzes/{id}` | GET | Quiz questions |
| `/api/quizzes/{id}/submit` | POST | Submit quiz answers |
| `/api/glossary/` | GET | Search glossary terms |
| `/api/progress/` | GET | User progress summary |
| `/api/progress/study` | POST | Mark strategy as studied |
| `/api/simulator/payoff` | POST | Calculate options payoff |
