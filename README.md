# Vixiem Frontend — API Monitoring & Intelligence Dashboard

Modern, high-performance React application for **Vixiem** — the real-time API monitoring, endpoint health intelligence, and AI-powered log analysis platform.

## 🚀 Features

- **Real-Time Monitoring Dashboard**: Interactive status overview, active endpoints list, live latency charts, and filterable log history.
- **AI Error Intelligence**: DeepSeek-powered automated log analysis identifying root causes, fix suggestions, and prevention steps.
- **Instant Cold-Start Resilience**: Non-blocking public route hydration ensuring instantaneous page load times without cold-start UI lockups.
- **Google OAuth2 Authentication**: Official Google Sign-In with signed Google ID Token verification.
- **Dark / Light Theme System**: Sleek glassmorphism UI built with Tailwind CSS and smooth Framer Motion transitions.

---

## 🛠️ Technology Stack

- **Core**: React 18, Vite 5, JavaScript (ESNext)
- **Styling**: Tailwind CSS, Lucide Icons, Framer Motion
- **HTTP & State**: Axios (with CSRF interceptor), React Context API
- **Auth**: `@react-oauth/google`

---

## ⚙️ Environment Configuration (`.env`)

Copy `.env.example` to `.env` before starting the application:

```env
VITE_API_BASE_URL=https://vixiem-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=804602267087-d7s242t4t960shink1df3m0vi5h8tetd.apps.googleusercontent.com
VITE_APP_NAME=Vixiem
```

---

## 💻 Local Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/iamyashkumar/vixiem-frontend.git
   cd vixiem-frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Build Production Bundle**:
   ```bash
   npm run build
   ```
