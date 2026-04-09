# Trading Strategy Trainer

A full-stack web application for mastering trading strategies from the "151 Trading Strategies" paper by Kakushadze & Serur. Covers options and stock strategies with interactive lessons, quizzes, a payoff visualizer, and a searchable glossary.

## Live Website

**🌐 [https://trading-strategies.vercel.app](https://trading-strategies.vercel.app)**

## Original Creator

This project was originally created by [KellanFinney](https://github.com/KellanFinney) as a Python FastAPI backend with React frontend.

## Conversion

This version has been converted to a single **Next.js 16** application with:
- All data stored locally in JSON files (no database required)
- User progress persisted in browser **localStorage**
- Deployed to **Vercel** for free hosting

## Quick Start (Local Development)

```bash
cd trading-app
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

## Features

- **Strategy Library** — Browse strategies with filters, formulas (KaTeX), and detailed descriptions
- **Learning Path** — Progressive lessons across Options and Stocks modules, from beginner to advanced
- **Quiz Engine** — Multiple-choice quizzes for each lesson with scoring and pass/fail tracking
- **Payoff Visualizer** — Interactive options payoff diagram builder with presets (covered call, iron condor, butterfly, etc.)
- **Glossary** — Searchable trading terms with category filtering
- **Progress Dashboard** — Track strategies studied, lessons completed, quiz scores

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Math Rendering**: KaTeX
- **Charts**: Plotly.js
- **Styling**: Custom CSS (dark theme)
- **Deployment**: Vercel

## Project Structure

```
trading-app/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── strategies/        # Strategy library pages
│   ├── lessons/          # Learning path pages
│   ├── quiz/             # Quiz pages
│   ├── visualizer/       # Payoff visualizer
│   └── glossary/         # Glossary page
├── components/            # React components
├── lib/                   # Hooks and utilities
├── data/                  # Seed data (JSON)
└── package.json
```

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/strategies` | GET | List/filter strategies |
| `/api/lessons` | GET | List lessons |
| `/api/quizzes` | GET/POST | Get quiz / submit answers |
| `/api/glossary` | GET | Search glossary terms |
| `/api/simulator/payoff` | POST | Calculate options payoff |