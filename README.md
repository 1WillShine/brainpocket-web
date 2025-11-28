# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```




# BrainPocket — A Full-Stack Productivity & Study Workflow Platform

BrainPocket is a full-stack productivity platform that enhances note-taking workflows with calendar-based organization, tag/category classification, multi-filter search, and data-driven analytics.
Originally built as part of an applied software engineering project, BrainPocket integrates frontend UI/UX, backend APIs, relational databases, and an ETL analytics pipeline.

## 🚀 Features
📚 Rich Note System

Create, edit, delete notes

Tag and categorize notes

Filter by keyword, tag, date, or priority

Auto-save and clean UI

## 📅 Calendar–Integrated Workflow

Notes mapped to calendar events

Study-session scheduling

Color-coded daily/weekly views

## 🔎 Advanced Search

Multi-criteria filtering

Tag intersection search

Natural-language processing (optional future extension)

## 📊 Analytics Pipeline (Python + SQL)

Built a real analytics pipeline:

MySQL → ETL → pandas → analytics dashboard

Computes:

note creation velocity

session duration distributions

tag usage frequency

user engagement trends

Outputs actionable UX recommendations

## 🛠️ Tech Stack
Frontend

Next.js / React

TailwindCSS

Framer Motion (optional)

Backend

Python (FastAPI or Flask)

REST API

JWT authentication (optional)

Database

MySQL

SQLAlchemy ORM

Normalized schema for notes, tags, sessions

Analytics

Python (pandas, NumPy)

ETL pipeline converting raw logs → analytic tables

## 📂 Repository Structure
backend/
    api/
    db/
    etl/
frontend/
docs/
README.md



## 🧰 Setup Instructions
Backend
cd backend
pip install -r requirements.txt
python app.py

Frontend
cd frontend
npm install
npm run dev

## ✨ Future Enhancements

AI-assisted summarization

Semantic search

Habit tracking module

Calendar automation
