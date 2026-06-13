# 🎯 Realtime Object Detection — Detectra AI

A real-time object detection web application powered by **TensorFlow.js** and the **COCO-SSD** model, built with React, TypeScript, and Supabase. Detects and labels objects live through your device camera with a modern, responsive UI.




<img width="1919" height="925" alt="Screenshot 2026-04-27 222057" src="https://github.com/user-attachments/assets/233e3eb7-6869-4b62-8c66-c8ceb2d37be8" />






🔗 **Live Demo:** [detectra-ai-rho.vercel.app](https://detectra-ai-rho.vercel.app)



## **📌 Table of Contents**

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [How It Works](#how-it-works)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## **📖 Overview**

Detectra AI is a browser-based real-time object detection application that uses your device's webcam feed to identify and label objects on the fly. It leverages the power of **TensorFlow.js** with the pre-trained **COCO-SSD** model entirely on the client side — no backend inference required. Detection history and user data are persisted via **Supabase**.

---

## **✨ Features**

- 🎥 **Live Camera Feed** — Real-time object detection via webcam
- 🤖 **COCO-SSD Model** — Detects 80+ common object categories
- ⚡ **Client-Side Inference** — TensorFlow.js runs entirely in the browser
- 🗄️ **Supabase Integration** — Persistent storage for detection history and user data
- 🎨 **Shadcn/UI + Radix UI** — Fully accessible, polished component library
- 🌗 **Dark / Light Theme** — Theme toggling via `next-themes`
- 📱 **Responsive Design** — Works on desktop and mobile browsers
- 🔄 **Smooth Animations** — Framer Motion powered transitions
- 📊 **Detection Statistics** — Charts powered by Recharts
- 🧪 **Testing** — Vitest + Playwright for unit and E2E tests

---

## **🛠️ Tech Stack**

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + Shadcn/UI |
| ML / Inference | TensorFlow.js + COCO-SSD |
| Backend / DB | Supabase (PostgreSQL + Auth) |
| State Management | TanStack Query (React Query) |
| Routing | React Router DOM v6 |
| Animations | Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Testing | Vitest + Playwright |
| Deployment | Vercel |

---

## **📁 Project Structure**

```
Realtime_Object_Detection/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Route-level page components
│   ├── integrations/        # Supabase client & types
│   ├── lib/                 # Utility functions
│   └── main.tsx             # Application entry point
├── supabase/                # Supabase migrations & config
├── .env                     # Environment variables
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── vitest.config.ts         # Vitest test configuration
├── playwright.config.ts     # Playwright E2E config
└── vercel.json              # Vercel deployment config
```

---

## **🚀 Getting Started**

### **Prerequisites**

- Node.js >= 18.x
- npm or bun
- A Supabase account and project

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sridhar1431S/Realtime_Object_Detection.git
   cd Realtime_Object_Detection
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Copy the `.env` file and fill in your Supabase credentials:
   ```bash
   cp .env .env.local
   ```
   See [Environment Variables](#environment-variables) for required keys.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## **🔐 Environment Variables**

Create a `.env` file in the root with the following:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## **📜 Available Scripts**

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run build:dev` | Development mode build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |

---

## **⚙️ How It Works**

1. **Camera Access** — The app requests webcam permission and streams the live feed to a `<video>` element.
2. **Model Loading** — TensorFlow.js loads the COCO-SSD model in the browser on startup.
3. **Frame Inference** — Each video frame is passed to the model, which returns bounding boxes, class labels, and confidence scores.
4. **Rendering** — Detected objects are overlaid on the video using a `<canvas>` element drawn in real time.
5. **Persistence** — Detection results can be stored and queried via Supabase for history and analytics.

---

## **☁️ Deployment**

This project is deployed on **Vercel**. To deploy your own instance:

1. Push the repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Add the environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in Vercel's project settings.
4. Deploy — Vercel will auto-detect the Vite framework.

A `vercel.json` config file is already included in the repo.

---

## **🤝 Contributing**

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the existing code style and ensure tests pass before submitting.

---

## **📄 License**

This project is open source. Feel free to use, modify, and distribute it as per your needs.

---

> Built with ❤️ by [Sridhar1431S](https://github.com/Sridhar1431S)
