<div align="center">

# ✨ Sajuterior (사주테리어)

**Interior decoration recommendations powered by Korean Four Pillars of Destiny (사주)**

Analyze your *Saju* (사주팔자) and Five Elements (오행) balance, then get personalized room decoration ideas — photos, posters, and styling tips — to complement your elemental energy. Couple mode available too! 💕

[![Live Demo](https://img.shields.io/badge/Live%20Demo-eee0930.github.io-7C3AED?style=for-the-badge&logo=github)](https://eee0930.github.io/sajuterior/)
[![License](https://img.shields.io/badge/license-MIT-pink?style=for-the-badge)](LICENSE)

![Sajuterior Preview](https://images.unsplash.com/photo-1675528428686-1379942a4e6b?w=1200&h=400&fit=crop&q=80)

</div>

---

## 🌟 Features

- **Individual Analysis** — Enter name, date of birth, birth hour, and gender to calculate your 사주팔자 (Four Pillars) and 오행 (Five Elements) distribution
- **Element Deficit Detection** — Identifies which of the five elements (木火土金水) are lacking or overabundant in your chart
- **Room Decoration Recommendations** — For each lacking element, suggests curated wall photos, art posters, color palettes, and interior styling tips
- **Couple Mode** — Input two people's birth info to analyze their combined elemental balance; highlights complementary elements and elements both partners lack
- **Profile Storage** — All analyses are saved to `localStorage` and accessible anytime from the "내 정보" tab
- **Social Sharing Ready** — Full Open Graph & Twitter Card meta tags for beautiful link previews on KakaoTalk, Instagram, and more

---

## 🔮 How It Works

### Four Pillars (사주팔자) Calculation

The app derives all four pillars from a birth date and time:

| Pillar | Basis | Note |
|--------|-------|------|
| 년주 Year | Birth year | Adjusted for 입춘 (~Feb 4) |
| 월주 Month | Solar terms (절기) | Approximated boundary dates |
| 일주 Day | 60-day sexagenary cycle | Reference: Jan 1, 1900 = 甲戌 (offset 20) |
| 시주 Hour | 12 two-hour periods | Stem derived from day stem |

Each pillar contains a **Heavenly Stem (천간)** and **Earthly Branch (지지)**, each mapped to one of the Five Elements.

### Five Elements (오행) Analysis

Eight characters across four pillars are counted by element. Elements below ~55% of the average are flagged as **lacking**; those above ~150% are **overabundant**.

| Element | Korean | Symbol | Color Theme |
|---------|--------|--------|-------------|
| Wood    | 목(木) | 🌿 | Emerald green |
| Fire    | 화(火) | 🔥 | Rose / Orange |
| Earth   | 토(土) | 🌍 | Amber / Brown |
| Metal   | 금(金) | ✨ | Slate / Silver |
| Water   | 수(水) | 💧 | Blue / Indigo |

---

## 🛠 Tech Stack

<div>

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript_6-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_React-F56565?style=for-the-badge&logo=lucide&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

</div>

| Package | Version | Purpose |
|---------|---------|---------|
| `react` + `react-dom` | ^19.2 | UI framework & DOM rendering |
| `typescript` | ~6.0 | Static type safety |
| `vite` | ^8.0 | Build tool & HMR dev server (Oxc transformer) |
| `tailwindcss` | ^3.4 | Utility-first CSS framework |
| `lucide-react` | ^1.14 | Icon library |
| `postcss` + `autoprefixer` | — | CSS post-processing |
| `@vitejs/plugin-react` | ^6.0 | React fast refresh |
| `typescript-eslint` | ^8.0 | Type-aware linting |

**Runtime:** Node.js `v24.15.0`

---

## 📁 Project Structure

```
sajuterior/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Auto-deploy to GitHub Pages on push to main
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Sticky nav with tab switching
│   │   ├── InputForm.tsx        # Individual birth info input form
│   │   ├── CoupleInputForm.tsx  # Two-partner input form with validation
│   │   ├── SajuResult.tsx       # Individual analysis result view
│   │   ├── CoupleResult.tsx     # Couple analysis result view
│   │   ├── ElementChart.tsx     # Five-element horizontal bar chart
│   │   ├── RoomDecorCard.tsx    # Per-element decoration card (photos + tips)
│   │   └── ProfileList.tsx      # Saved profiles list (individual + couple)
│   ├── utils/
│   │   ├── saju.ts              # Core 사주 calculation (pillars, elements, hour options)
│   │   ├── decor.ts             # Static decoration data per element (photos, posters, tips)
│   │   ├── coupleAnalysis.ts    # Couple element combination & compatibility analysis
│   │   └── storage.ts           # localStorage CRUD for individual & couple profiles
│   ├── types/
│   │   └── index.ts             # Shared TypeScript interfaces
│   ├── App.tsx                  # Root component — view state machine (no router)
│   ├── main.tsx                 # React entry point
│   └── index.css               # Tailwind directives + global base styles
├── index.html                   # OG/Twitter meta tags, Google Fonts, viewport config
├── vite.config.ts               # base: '/sajuterior/' for GitHub Pages sub-path
├── tailwind.config.js           # Custom keyframes: slide-up, fade-in, bar-fill
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 20`
- npm `>= 10`

### Installation & Dev Server

```bash
git clone https://github.com/eee0930/sajuterior.git
cd sajuterior
npm install
npm run dev
# → http://localhost:5173/sajuterior/
```

### Available Scripts

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Type-check (tsc -b) + production bundle → dist/
npm run preview   # Serve dist/ locally to verify production build
npm run lint      # Run ESLint across all TypeScript files
```

---

## 📦 Deployment

Auto-deploys to **GitHub Pages** via GitHub Actions on every push to `main`.

```
push to main
  └─▶ .github/workflows/deploy.yml
        └─▶ npm ci  →  npm run build
              └─▶ peaceiris/actions-gh-pages@v3
                    └─▶ dist/  →  gh-pages branch  →  🌐 Live
```

> `vite.config.ts` sets `base: '/sajuterior/'` so all asset paths resolve correctly under the GitHub Pages subdirectory.

---

## 🎨 Design System

| Attribute | Value |
|-----------|-------|
| Style | Linear-inspired clean UI + American high-teen palette |
| Primary | Violet `#7C3AED` → Pink `#EC4899` gradient |
| Font (Latin) | [Inter](https://fonts.google.com/specimen/Inter) 400–900 |
| Font (Korean) | [Noto Sans KR](https://fonts.google.com/noto/specimen/Noto+Sans+KR) 400–900 |
| Animations | Custom Tailwind keyframes: `slide-up`, `fade-in`, `bar-fill` |
| Mobile | `maximum-scale=1` prevents input zoom on iOS; fully responsive |

---

## 📱 Social Sharing (OG Tags)

`index.html` includes full Open Graph and Twitter Card meta tags so links shared on KakaoTalk, Instagram, X (Twitter), and Slack render with a title, description, and cover image automatically.

---

## 📄 License

MIT © [eee0930](https://github.com/eee0930)
