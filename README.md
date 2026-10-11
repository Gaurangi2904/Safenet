# 🛡️ SAFENET — Women's Safety Platform

<p align="center">
  <strong>A Full-Stack Web Application for Personal Safety and Emergency Preparedness</strong>
</p>

<p align="center">
  <a href="https://safenet-cjn65xp6r-gaurangi-vijay-kapares-projects.vercel.app">🌐 Live Demo</a> •
  <a href="https://github.com/Gaurangi2904/Safenet">📂 GitHub Repository</a> •
  <a href="https://safenet-backend-d0a8.onrender.com/api/v1/health">⚙️ Backend Health</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-TypeScript-blue?logo=react" alt="React and TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?logo=nodedotjs" alt="Node.js and Express" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma" alt="Prisma ORM" />
  <img src="https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel" alt="Vercel" />
  <img src="https://img.shields.io/badge/Backend-Render-46E3B7?logo=render" alt="Render" />
</p>

---

## 📌 About the Project

**SAFENET** is a full-stack women's safety platform designed to bring essential personal-safety features together in one centralized web application.

The platform allows authenticated users to manage trusted contacts, record safety check-ins, report incidents, and access safety-related functionality through a centralized dashboard.

The project demonstrates practical experience in full-stack development, REST API integration, authentication, database management, and cloud deployment.

## 🎯 Problem Statement

Personal-safety information and tools can be scattered across different applications and manual processes. This can make it harder for users to organize trusted contacts and maintain records of safety-related activities.

SAFENET aims to simplify access to these features through a single, user-friendly platform.

## 💡 Proposed Solution

SAFENET provides a centralized web interface that connects the frontend, backend APIs, and a persistent database. Users can manage their safety-related information and access available features from one place.

## ✨ Key Features

- 🔐 **User Authentication** — Registration, login, password hashing, and JWT-based authentication.
- 📊 **Safety Dashboard** — Centralized access to the platform's safety modules.
- 👥 **Trusted Contacts** — Add and manage trusted contacts.
- ✅ **Safety Check-Ins** — Create and save safety check-in records.
- 📝 **Incident Reporting** — Submit and store safety-related incident reports.
- 🆘 **SOS Module** — Access the application's emergency-related functionality.
- 🗄️ **Database Integration** — Persistent storage using PostgreSQL and Prisma ORM.
- ☁️ **Cloud Deployment** — Frontend and backend hosted separately for deployment flexibility.

## 🧰 Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express.js, TypeScript |
| API | REST API |
| Authentication | JWT, bcrypt |
| Database | PostgreSQL, Neon |
| ORM | Prisma |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | Git, GitHub |
| Infrastructure Tools | Docker, Kubernetes |

## 🏗️ System Architecture

```mermaid
flowchart TD
    A[User / Browser] --> B[React + TypeScript]
    B -->|HTTPS REST API| C[Node.js + Express]
    C --> D[JWT Authentication]
    C --> E[Prisma ORM]
    E --> F[(PostgreSQL - Neon)]
    B -. Deployed on .-> G[Vercel]
    C -. Deployed on .-> H[Render]
```

### Application Workflow

1. Users interact with the React frontend.
2. The frontend communicates with the backend through REST APIs.
3. The backend handles requests and authenticates access to protected endpoints.
4. Prisma ORM manages database operations.
5. PostgreSQL stores application data.

## 🔒 Security Highlights

- Password hashing with bcrypt.
- JWT-based authentication for protected routes.
- Environment variables for sensitive configuration.
- Separation of frontend, backend, and database responsibilities.

## 🚀 Future Enhancements

- Real-time emergency notifications.
- Consent-based live location sharing.
- Integration with verified emergency-service providers.
- Automated testing and CI/CD improvements.
- Enhanced mobile responsiveness and accessibility.

*These are planned enhancements and are not claims of existing functionality.*

## 👩‍💻 Developer

**Gaurangi Kapare**  
BE Information Technology | Full-Stack Development

- GitHub: [@Gaurangi2904](https://github.com/Gaurangi2904)
- Project Repository: [SAFENET](https://github.com/Gaurangi2904/Safenet)
- Live Demo: [Explore SAFENET](https://safenet-cjn65xp6r-gaurangi-vijay-kapares-projects.vercel.app)

---

<p align="center">
  <strong>SAFENET — Building technology for a safer digital experience. 🛡️</strong>
</p>

<p align="center">
  <sub>Developed as an educational full-stack software engineering project.</sub>
</p>
