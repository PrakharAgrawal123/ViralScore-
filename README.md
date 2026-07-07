<div align="center">

```
██╗   ██╗██╗██████╗  █████╗ ██╗      ███████╗ ██████╗ ██████╗ ██████╗ ███████╗
██║   ██║██║██╔══██╗██╔══██╗██║      ██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝
██║   ██║██║██████╔╝███████║██║      ███████╗██║     ██║   ██║██████╔╝█████╗  
╚██╗ ██╔╝██║██╔══██╗██╔══██║██║      ╚════██║██║     ██║   ██║██╔══██╗██╔══╝  
 ╚████╔╝ ██║██║  ██║██║  ██║███████╗ ███████║╚██████╗╚██████╔╝██║  ██║███████╗
  ╚═══╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
```

### ⚡ *Know if your LinkedIn post will go viral — before you hit publish* ⚡

<br/>

<a href="https://viral-score-eight.vercel.app/">
  <img src="https://img.shields.io/badge/🚀%20LIVE%20DEMO-viral--score--eight.vercel.app-6366F1?style=for-the-badge&logoColor=white" />
</a>
&nbsp;
<a href="https://github.com/PrakharAgrawal123/LinkedIn-Post-Virality-Predictor">
  <img src="https://img.shields.io/badge/GitHub-Source%20Code-181717?style=for-the-badge&logo=github&logoColor=white" />
</a>

<br/><br/>

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" />
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
<img src="https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" />
<img src="https://img.shields.io/badge/Google%20Gemini%20AI-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white" />
<img src="https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" />

<br/><br/>

> 🧠 ML Model &nbsp;•&nbsp; 🔐 Google OAuth &nbsp;•&nbsp; 📊 Analytics Dashboard &nbsp;•&nbsp; ✍️ Gemini AI Rewrites &nbsp;•&nbsp; 🌑 Dark Glassmorphism UI

</div>

---

<br/>

## 🌟 &nbsp;What even is this?

You spend **30 minutes** writing the perfect LinkedIn post.

You hit publish.

Crickets. 

**ViralScore fixes that.**

Paste your draft → our ML model scores it **out of 100** → AI highlights exactly which sentences are killing your reach → Google Gemini AI rewrites them → you post at the perfect time.

**It's like having a LinkedIn growth hacker in your pocket. For free.**

<br/>

---

<br/>

## ⚡ &nbsp;Features that slap

<table>
<tr>
<td width="50%">

### 🎯 Virality Score
ML model trained on a **LinkedIn Engagement Dataset** gives your post a score from **0 to 100** with estimated reach — *Under 300 impressions* all the way to *15,000+ impressions*

</td>
<td width="50%">

### 🔍 Sentence Breakdown
Every sentence gets classified into **4 categories** — Hook 🟣, Weak 🔴, Engaging 🟢, Neutral ⚪ — so you know exactly what to fix

</td>
</tr>
<tr>
<td width="50%">

### ✍️ AI Rewrite Suggestions
**Google Gemini AI** rewrites your weak, jargon-heavy sentences into punchy, authentic lines that actually get engagement

</td>
<td width="50%">

### 🕐 Best Time to Post
Stop guessing. Get a data-driven recommendation for the **exact day and time** to maximize your reach

</td>
</tr>
<tr>
<td width="50%">

### 📊 Personal Dashboard
Track your **score trends over time**, see your most-used weak words, and watch yourself improve with **Recharts** visualizations

</td>
<td width="50%">

### 🔐 Auth System
Full **JWT authentication** + **Google OAuth 2.0** social login with bcrypt password hashing and protected routes

</td>
</tr>
</table>

<br/>

---

<br/>

## 🏗️ &nbsp;Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                             │
│                                                                 │
│   React + Vite  ──  Tailwind CSS  ──  Framer Motion            │
│   Recharts      ──  React Router  ──  Axios                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │  HTTP / REST API
┌───────────────────────────▼─────────────────────────────────────┐
│                      FLASK BACKEND                              │
│                                                                 │
│   app.py        ──  auth_routes.py   ──  analysis_routes.py     │
│   extensions.py ──  train_model.py   ──  JWT + OAuth            │
└──────────┬────────────────┬────────────────────┬────────────────┘
           │                │                    │
    ┌──────▼──────┐  ┌──────▼──────┐   ┌────────▼────────┐
    │  MongoDB    │  │  scikit-    │   │  Google Gemini  │
    │  Atlas      │  │  learn ML   │   │  Generative AI  │
    │  (Users +   │  │  Model      │   │  (Rewrites)     │
    │   History)  │  │  (.pkl)     │   │                 │
    └─────────────┘  └─────────────┘   └─────────────────┘
```

<br/>

---

<br/>

## 🛠️ &nbsp;Tech Stack

### 🎨 Frontend
| Tech | Why |
|------|-----|
| **React + Vite** | Fast, component-based UI |
| **Tailwind CSS** | Utility-first dark glassmorphism styling |
| **Framer Motion** | Buttery smooth animations & page transitions |
| **Recharts** | Score trend charts & bar graphs |
| **React Router DOM** | Client-side routing with protected pages |
| **Axios** | API calls to Flask backend |
| **Lucide React** | Clean icon system |

### ⚙️ Backend
| Tech | Why |
|------|-----|
| **Python + Flask** | Lightweight REST API server |
| **Flask-JWT-Extended** | Secure token-based authentication |
| **Flask-PyMongo** | Dynamic MongoDB database integration driver |
| **bcrypt** | Industry-standard password hashing |
| **Flask-CORS** | Cross-origin request handling |

### 🧠 ML / AI
| Tech | Why |
|------|-----|
| **scikit-learn** | RandomForestRegressor for virality scoring |
| **Google Gemini API** | Sentence rewriting & NLP analysis via `google-generativeai` |
| **pandas + numpy** | Feature engineering & data processing |
| **joblib** | Save & load trained `.pkl` model |

<br/>

---

<br/>

## 📁 &nbsp;Project Structure

```

LinkedIn-Post-Virality-Predictor/
│
├── 📂 backend/
│   ├── 📂 Dataset/
│   │   └── LinkedIn_Post.csv
│   ├── 📂 models/
│   │   ├── virality_model.pkl
│   │   └── metadata.pkl
│   ├── .env
│   ├── analysis_routes.py
│   ├── app.py
│   ├── auth_routes.py
│   ├── extensions.py
│   ├── requirements.txt
│   └── train_model.py
│
├── 📂 frontend/
│   ├── 📂 public/
│   ├── 📂 src/
│   │   ├── 📂 assets/
│   │   ├── 📂 components/
│   │   ├── 📂 context/
│   │   │   └── AuthContext.jsx
│   │   ├── 📂 data/
│   │   ├── 📂 hooks/
│   │   │   └── useAnalyser.js
│   │   ├── 📂 pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

```

<br/>

---

<br/>

## 🚀 &nbsp;Run it locally

### 1️⃣ Clone

```bash
git clone https://github.com/PrakharAgrawal123/LinkedIn-Post-Virality-Predictor.git
cd LinkedIn-Post-Virality-Predictor
```

### 2️⃣ Backend

```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/viralscore?retryWrites=true&w=majority
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET_KEY=any_random_secret_string
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

Train the model (only once):
```bash
python train_model.py
```

Start server:
```bash
python app.py
# Runs on http://localhost:5000
```

### 3️⃣ Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### 4️⃣ Open

```
http://localhost:5173
```

Done. 🎉

<br/>

---

<br/>

## 🗺️ &nbsp;Roadmap

```
✅ ML virality scoring model (RandomForestRegressor)
✅ Sentence NLP breakdown (4 categories)
✅ Google Gemini AI rewrite suggestions
✅ Dark glassmorphism UI with Framer Motion
✅ JWT auth + Google OAuth 2.0
✅ Personal analytics dashboard
✅ Post history with search & filter
✅ Deployed on Vercel (Frontend)
✅ Deploy backend on Render
✅ Database migrated to MongoDB Atlas
⬜ Real LinkedIn dataset for better accuracy
⬜ BERT-based NLP upgrade
⬜ Chrome extension for LinkedIn composer
⬜ Export analysis as PDF report
⬜ A/B post comparator
```

<br/>

---

<br/>

## 🤝 &nbsp;Contributing

Got ideas? Found a bug? PRs are welcome!

```bash
git checkout -b feature/YourFeature
git commit -m "Add YourFeature"
git push origin feature/YourFeature
# Open a Pull Request
```

<br/>

---

<br/>

<div align="center">

```
If this helped you, drop a ⭐ — it takes 2 seconds and means a lot!
```

**Built with 🔥 by [Prakhar Agrawal](https://github.com/PrakharAgrawal123)**

<br/>

[![Live Demo](https://img.shields.io/badge/🚀%20Try%20it%20Live-viral--score--eight.vercel.app-6366F1?style=for-the-badge)](https://viral-score-eight.vercel.app/)
&nbsp;
[![GitHub](https://img.shields.io/badge/⭐%20Star%20on%20GitHub-181717?style=for-the-badge&logo=github)](https://github.com/PrakharAgrawal123/LinkedIn-Post-Virality-Predictor)

</div>
