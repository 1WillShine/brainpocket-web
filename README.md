

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




## Running Locally (Full Functionality)

To enable full functionality, you must connect your own Firebase project.

### 1. Create Firebase Project
1. Visit the Firebase Console.
2. Create a new project.
3. Enable Firestore Database.

### 2. Get Your Firebase Config
In your project settings, copy the config:

```ts
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

### 3. Add Firebase Setup File
Create firebase.ts in your project:
```ts
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
```

### 4. Firestore Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Add a .env.local File
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_DEMO_MODE=false
```
