# RoboON Website - Project Portfolio Platform

This document tracks the current architecture, implemented features, and the roadmap for the RoboON Engineering & Robotics Portfolio.

## 🚀 Project Identity
RoboON is a specialized engineering platform showcasing expertise in Embedded Systems, Robotics, PCB Design, and IoT solutions. It serves as a professional portfolio and service discovery hub for clients.

## 🛠 Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI/Styling:** Tailwind CSS 4, Framer Motion, Lucide React
- **Database/Auth:** Firebase (Firestore & Auth)
- **Forms:** FormSubmit.co (Contact inquiries)
- **Deployment:** Vercel (Next.js standard)

## 🏗 Current Architecture & Features

### Core Pages
- [x] **Home:** Dynamic hero section with high-quality video background, service overview, and featured projects.
- [x] **Projects:** Comprehensive portfolio listing with dynamic category filtering and SSG support.
- [x] **Project Details:** Dynamic, client-side rendered pages (`/projects/project-details/?id=...`) to ensure compatibility with static hosting (GitHub Pages) for newly added projects.
- [x] **Clients:** Partner showcase with client testimonials and industry categorizations.
- [x] **Services:** Detailed breakdown of engineering expertise (Embedded, Robotics, PCB, 3D, App/Web, IoT).
- [x] **About:** Company mission and high-level statistics.
- [x] **Contact:** Lead generation via a functional inquiry form integrated with `formsubmit.co`.

### Administration (`/admin`)
- [x] **Admin Dashboard:** Overview of system stats and quick access to management tools.
- [x] **Project Management:** 
  - [x] CRUD operations for projects.
  - [x] **Category Management:** Create, edit, and delete project categories dynamically.
  - [x] **Image Handling:** Multi-image support with client-side canvas compression for optimized storage.
  - [x] **Tracking:** Assign customer emails to projects for future private tracking.
- [x] **User Management:** 
  - [x] Monitor registered customers and administrators.
  - [x] Role-based access control (Admin, Moderator, Customer).
  - [x] Real-time role updates.

### Authentication & Security
- [x] **Firebase Auth:** Secure login for administrators and customers.
- [x] **Role Protection:** Protected routes (`ProtectedRoute.tsx`) and logic based on email whitelisting (`ADMIN_EMAILS`) and Firestore-stored roles.

## 📋 Development Conventions
1. **Portfolio Focus:** All new features should prioritize the visual presentation of engineering work.
2. **Project Data:** Projects use an `images: string[]` array. Prefer canvas-compressed images to keep Firestore payload lean.
3. **Styling:** Maintain the "Futuristic/Circuit" aesthetic using Tailwind 4, glassmorphism, and Framer Motion animations.
4. **Performance:** Core pages use SSG for speed, while project details use client-side fetching to ensure immediate availability of newly uploaded products on static hosting.

## 🗺 Roadmap & Next Steps
- [x] **Real-time Stats:** Implement actual Firestore aggregations for the admin dashboard stats.
- [ ] **Client Dashboard:** Expand the project tracking feature into a dedicated client portal.
- [ ] **Blog/Insights:** Add a section for engineering case studies and technical articles.
- [ ] **Multi-language Support:** Add support for multiple languages to reach a broader audience.

---
*Last Updated: May 28, 2026*
