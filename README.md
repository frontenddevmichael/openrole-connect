# OpenRole

OpenRole is a modern web application designed to help users explore roles, career paths, and opportunities tailored to their skills and interests. Built as a single-page application (SPA), it’s fully responsive, SEO-optimized, and production-ready.

---

## 🌐 Live Demo

[https://openrole-connect.vercel.app](https://openrole-connect.vercel.app)

---

## ⚡ Features

- **Role & Career Exploration** – Discover available roles and potential career paths.
- **Responsive Design** – Fully optimized for desktop, tablet, and mobile.
- **SEO & Social Optimized** – Meta tags, Open Graph, Twitter cards, and structured data for rich search results.
- **Performance Optimized** – Preloaded fonts, preconnect, and asynchronous scripts for minimal page load impact.
- **Modern Frontend Stack** – Built with a production-ready SPA setup, modular components, and Tailwind CSS.
- **Accessibility First** – Semantic HTML, keyboard-friendly navigation, and focus states included.
- **Future-proof Architecture** – Environment-ready scripts for analytics, dark/light theme support, and canonical URLs.

---

## 🛠️ Tech Stack

- **Frontend:** HTML, TypeScript, Vite
- **Styling:** Tailwind CSS with utility-first design
- **Deployment:** Vercel
- **SEO & Social:** Open Graph, Twitter Cards, JSON-LD structured data
- **Performance:** Preloading fonts, preconnect to CDNs, antialiased text, minimal JS bundle
- **Optional Analytics:** Google Analytics / GTM integration with consent logic

---

## 📂 Project Structure

```text
/
├─ public/               # Static assets (favicon, OG images, fonts)
├─ src/
│  ├─ main.tsx           # Entry point
│  ├─ components/        # Reusable UI components
│  ├─ pages/             # Page components
│  └─ styles/            # Tailwind customizations
├─ dist/                 # Production build output
├─ index.html            # Production-ready HTML template
├─ tailwind.config.js    # Tailwind configuration
└─ package.json          # Project dependencies and scripts
