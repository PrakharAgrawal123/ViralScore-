<div align="center">

# ⚡ ViralScore — LinkedIn Post Virality Predictor

<img src="https://img.shields.io/badge/Status-In%20Development-6366F1?style=for-the-badge&logoColor=white" />
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" />
<img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" />

<br/>

### Know if your LinkedIn post will go viral — before you post it.

<br/>

[![GitHub Repo](https://img.shields.io/badge/GitHub-View%20Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/PrakharAgrawal123/LinkedIn-Post-Virality-Predictor)
[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Coming%20Soon-6366F1?style=for-the-badge)](https://github.com/PrakharAgrawal123/LinkedIn-Post-Virality-Predictor)

<br/>

> 🚧 **Live deployment coming soon. Stay tuned!**

</div>

---

## 📌 What is ViralScore?

**ViralScore** is an AI-powered full-stack web app that predicts how well your LinkedIn post will perform *before* you hit publish.

Paste your draft → get a **virality score out of 100** → fix weak sentences → post at the perfect time.

It's like a grammar checker, but for **LinkedIn engagement.**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎯 **Virality Score** | ML model predicts your post's viral potential (0–100) |
| 🔍 **Sentence Breakdown** | Highlights hooks, weak lines, engaging questions, and neutral sentences |
| ✍️ **AI Rewrite Suggestions** | GPT-powered rewrites for weak/jargon-heavy sentences |
| 🕐 **Best Time to Post** | Recommends optimal posting time for max reach |
| 📊 **Personal Dashboard** | Track your score history, trends, and most-used weak words |
| 📁 **Post History** | Browse, search, and filter all your previous analyses |
| 🔐 **Authentication** | Email/password + Google OAuth login |

---



## 🛠️ Tech Stack

### Frontend
- **React** (Vite) — Component-based UI
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations & transitions
- **Recharts** — Dashboard charts & graphs
- **React Router DOM** — Client-side routing
- **Lucide React** — Icons
- **Axios** — HTTP requests

### Backend
- **Python + Flask** — REST API server
- **Flask-JWT-Extended** — JWT authentication
- **Flask-SQLAlchemy** — ORM for database
- **bcrypt** — Password hashing
- **Flask-CORS** — Cross-origin handling

### Machine Learning / AI
- **scikit-learn** — GradientBoosting model for virality scoring
- **OpenAI API** — GPT-3.5 powered sentence rewriting
- **pandas + numpy** — Data processing
- **joblib** — Model serialization

### Database & Auth
- **SQLite** (dev) / **PostgreSQL** (prod)
- **Google OAuth 2.0** — Social login

---

## 📁 Project Structure

```
linkedin-virality/
│
├── backend/
│   ├── app.py                  ← Flask server & config
│   ├── auth_routes.py          ← Login, signup, Google OAuth
│   ├── models.py               ← SQLAlchemy database models
│   ├── predictor.py            ← ML model inference
│   ├── analyzer.py             ← Sentence scoring logic
│   ├── rewriter.py             ← OpenAI rewrite integration
│   ├── model/
│   │   ├── train_model.py      ← Model training script
│   │   └── virality_model.pkl  ← Trained ML model
│   ├── .env                    ← Environment variables (not committed)
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ScoreRing.jsx
│   │   │   ├── SentenceChip.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── RewriteCard.jsx
│   │   │   ├── GlassCard.jsx
│   │   │   ├── FloatingOrbs.jsx
│   │   │   └── SkeletonLoader.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Analyser.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── AuthCallback.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAnalyser.js
│   │   ├── data/
│   │   │   └── mockData.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Python 3.9+
- OpenAI API key
- Google OAuth credentials

---

### 1. Clone the repository

```bash
git clone https://github.com/PrakharAgrawal123/LinkedIn-Post-Virality-Predictor.git
cd LinkedIn-Post-Virality-Predictor
```

---

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET_KEY=your_random_secret_key
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=http://localhost:5173
```

Train the ML model (run once):

```bash
python model/train_model.py
```

Start the Flask server:

```bash
python app.py
```

Backend runs at → `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `JWT_SECRET_KEY` | Any random secret string |
| `OPENAI_API_KEY` | From platform.openai.com |
| `FRONTEND_URL` | React app URL (default: http://localhost:5173) |

> ⚠️ Never commit your `.env` file. It's already in `.gitignore`.

---

## 🔐 Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project → **ViralScore**
3. APIs & Services → OAuth consent screen → External
4. Credentials → Create OAuth 2.0 Client ID
5. Add redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy Client ID & Secret → paste in `.env`

---

## 📊 How the ML Model Works

```
User pastes LinkedIn post
        ↓
Feature extraction:
  → post length
  → has hashtags?
  → has emoji?
  → has question?
  → number of lines
  → starts with hook word?
  → hour of posting
        ↓
GradientBoostingRegressor predicts score (0–100)
        ↓
Sentence-level NLP analysis
  → Hook words detection
  → Jargon/weak words detection
  → Question detection
        ↓
OpenAI GPT-3.5 rewrites weak sentences
        ↓
Result displayed to user
```

---

## 🗺️ Roadmap

- [x] ML virality scoring model
- [x] Sentence breakdown analysis
- [x] AI-powered rewrite suggestions
- [x] React frontend with dark glassmorphism UI
- [x] User authentication (email + Google OAuth)
- [x] Personal dashboard with charts
- [x] Post history with search & filter
- [ ] Deploy frontend on Vercel
- [ ] Deploy backend on Render
- [ ] Chrome extension for LinkedIn
- [ ] Real LinkedIn dataset for better model accuracy
- [ ] BERT-based NLP scoring upgrade
- [ ] Export analysis as PDF

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m 'Add some AmazingFeature'

# Push to the branch
git push origin feature/AmazingFeature

# Open a Pull Request
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Prakhar Agrawal**

[![GitHub](https://img.shields.io/badge/GitHub-PrakharAgrawal123-181717?style=flat-square&logo=github)](https://github.com/PrakharAgrawal123)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

<br/>

Made with ❤️ by Prakhar Agrawal

</div>
