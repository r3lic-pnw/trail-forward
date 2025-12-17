# Trail Forward

<p align="center">
  <img src="public/assets/logos/trail-forward-logo.png" alt="Trail Forward Logo" width="200">
</p>

**Live Site:** <https://www.trailforward.org>

Trail Forward is a public-facing web application built to support a hiking community for individuals who have experienced incarceration or addiction. The project aims to provide a safe, healing space to reconnect with nature, rebuild self-worth, and foster meaningful connections through shared outdoor experiences.

This application is intentionally developed as a real-world project rather than a tutorial or demo, with a focus on clarity, maintainability, and thoughtful technical growth.

---

## Mission

Trail Forward exists to inspire growth, resilience, and hope by creating a supportive hiking community for individuals navigating reentry or recovery. Through shared journeys on the trail, participants are encouraged to reconnect with nature, build confidence, and move forward toward a healthier, purpose-driven future.

---

## Project Overview

Trail Forward is a full-stack web application developed to support the organization’s outreach and community presence.

The project currently uses a traditional server-rendered architecture with a Node.js backend and a statically served frontend. It emphasizes strong web fundamentals and type safety while remaining lightweight and approachable.

---

## Features

- Public-facing informational website with a clean, accessible layout
- Responsive design optimized for desktop and mobile
- Client-side interactivity implemented with TypeScript
- Server-side logic handled via Node.js and Express
- Strong separation of concerns between frontend, backend, and database
- Deployed as a live production website with a custom domain

---

## Tech Stack

### Frontend

- **HTML5** – semantic, accessible markup
- **CSS3** – custom styling and layout
- **TypeScript** – typed client-side logic for improved reliability

### Backend

- **Node.js** – server runtime
- **Express** – backend web framework
- **MySQL** – relational database
- **mysql2** – database connectivity

### Tooling & Utilities

- **TypeScript** – Shared type safety across client and server
- **nodemon** – automatic server restarts during development
- **concurrently** – running multiple dev processes
- **dotenv** – environment variable management
- **Tailwind CSS (v4.x.x)** – utility-first styling

---

## Project Goals

- Build and deploy a real, publicly accessible web application
- Practice full ownership of a project from development through deployment
- Apply TypeScript in a production-oriented environment
- Maintain clean structure and readable, maintainable code
- Support an authentic mission-driven organization

---

## Ongoing Development

Trail Forward is actively evolving. Planned improvements include:

- Migrating the frontend to **Next.js** for component-based architecture and modern routing
- Refining TailwindCSS usage for improved consistency and scalability
- Improving SEO, accessibility, and performance
- Continuing to evolve the project architecture as requirements grow

Earlier implementations are preserved to demonstrate the project’s technical progression over time.

---

## Building and Running

**Prerequisites:**

- Node.js
- npm

### Installation

```bash
npm install
```

### Environment Setup

| Variable    | Description               | Default       |
| ----------- | ------------------------- | ------------- |
| DB_HOST     | MySQL server host address | localhost     |
| DB_USER     | MySQL username            | root          |
| DB_PASSWORD | MySQL password            | trailforward  |
| DB_NAME     | MySQL database name       | trail_forward |

```bash
npm run db:init # Initializes the database
```

### Building

```bash
npm run build # Builds both the client and server-side code
npm run build:client # Builds only the client-side code
npm run build:server # Builds only the server-side code
```

### Running

```bash
npm start
```

This will start the server on port 3000.

```bash
npm run dev
```

This will start the application in develpment mode with automatic reloading.

---

## Development Conventions

- TypeScript is used for both client- and server-side code
- The `src` directory contains TypeScript source files
- Compiled JavaScript output is placed in:
  - `public/js` for client-side code
  - app.js is placed in project root directory
  - db.js is placed in `database` directory
- The `database` directory contains schema and connection logic
- The `public` directory contains static assets (HTML, CSS, JS)
- `app.js` serves as the primary application entry point

```yaml
# Before Building
├── database/
|   └── schema.sql   # SQL schema file
|   └── initDB.js    # Database initialization script
├── public/          # Static assets and compiled JS
|   └──assets/       # Static assets
|   └──html/         # HTML files
|   └──styles/       # CSS files
├── src/             # TypeScript source files
│   ├── client/      # Frontend logic
│   └── server/      # Express routes/middleware
├── .env.example     # Template for environment variables
```

```yaml
# After Building
├── database/
|   └── schema.sql   # SQL schema file
|   └── initDB.js    # Database initialization script
|   └── db.js        # Database connection
├── public/          # Static assets and compiled JS
|   └──assets/       # Static assets
|   └──html/         # HTML files
|   └──js/           # Compiled JavaScript files
|   └──styles/       # CSS files
├── src/             # TypeScript source files
│   ├── client/      # Frontend logic
│   └── server/      # Express routes/middleware
├── .env.example     # Template for environment variables
├── app.js           # Main entry point for the application
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
