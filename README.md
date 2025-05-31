# 🚀 SpaceX Explorer

**SpaceX Explorer** is a statically generated web application built using the **Next.js App Router** and the [SpaceX API](https://github.com/r-spacex/SpaceX-API). It allows users to explore launches, rockets, ships, payloads, launchpads, and cores with interconnected, paginated routes and detailed entity views. All pages are generated at build time for fast load speeds and SEO benefits using `generateStaticParams` and `generateMetadata`.

---

## 🛠️ Tech Stack

- **Next.js (App Router)**
- **React**
- **Tailwind CSS**
- **Static Site Generation (SSG)**
- **GraphQL-style routing using REST endpoints**
- **SpaceX API**
- **Vercel (Deployment)**

---

## ✨ Features

- 🔍 **Paginated Listings** for:
  - Launches
  - Rockets
  - Ships
  - Payloads
  - Launch Pads
  - Cores

- 🛰️ **Detailed Views** for each item with full metadata
- 🔗 **Interlinked Entities** (e.g., launch details show related rocket, payloads, ship, launchpad, etc.)
- 🧭 **SEO-friendly routing** with static metadata generation
- 📦 **Static Site Generation (SSG)** using `generateStaticParams`
- 🎨 **Responsive UI** with Tailwind CSS

---

## 📦 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/vijaybkhot/SpaceX-Explorer.git
cd SpaceX-Explorer
```

### 2. Install Dependencies

npm install


### 3. Run the Dev Server

npm run dev

Visit http://localhost:3000 in your browser.


### 4. Build for Production

npm run build
npm run start


⸻

📁 Data Source

Data is fetched from the free and open-source SpaceX REST API, with client-side logic ensuring routing to valid pages and handling invalid paths with custom 404s.

⸻

🙋‍♂️ Author

Vijay Khot
	•	GitHub: @vijaybkhot
	•	LinkedIn: [Vijay Sinh Khot](https://www.linkedin.com/in/vijay-khot/)

⸻

📄 License

This project is for academic use and demonstration as part of CS-554 Lab 7 at Stevens Institute of Technology. All data belongs to SpaceX.

⸻
