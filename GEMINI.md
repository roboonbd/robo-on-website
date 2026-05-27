# RoboON Website - Project Portfolio Platform

This document tracks the current architecture, implemented features, and the roadmap for the RoboON Engineering & Robotics Portfolio.

## 🚀 Project Identity
RoboON is a specialized engineering platform showcasing expertise in Embedded Systems, Robotics, PCB Design, and IoT solutions. It serves as a professional portfolio and service discovery hub for clients.

## 🛠 Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI/Styling:** Tailwind CSS 4, Framer Motion, Lucide React
- **Database/Auth:** Firebase (Firestore & Auth)
- **Deployment:** Vercel (Next.js standard)

## 🏗 Current Architecture & Features

### Core Pages
- [x] **Home:** Dynamic hero section and featured projects showcase.
- [x] **Projects:** Comprehensive portfolio listing with category filtering.
- [x] **Project Details:** Dynamic, image-rich pages for individual projects (`/projects/[id]`) featuring high-quality galleries.
- [x] **Clients:** Showcase of trusted partners and client testimonials (`/clients`).
- [x] **Services:** Detailed overview of engineering expertise.
- [x] **About/Contact:** Static informational and lead-generation pages.

### Administration
- [x] **Admin Dashboard:** `/admin` - Centrally manage projects and system access.
- [x] **Project Management:** 
  - [x] Multi-image upload support (URLs).
  - [x] Status tracking (Active/Completed).
  - [x] Category assignment and descriptions.
- [x] **User Management:** Control administrative access.

## 📋 Development Conventions
1. **Portfolio Focus:** All new features should prioritize the visual presentation of engineering work.
2. **Project Data:** Projects now use an `images: string[]` array for multi-photo galleries.
3. **Styling:** Maintain the "Futuristic/Circuit" aesthetic using Tailwind 4 and Framer Motion.
4. **Performance:** Prioritize image optimization for high-resolution project showcases.

## 🗺 Roadmap & Next Steps
- [ ] **Client Project Tracking:** (Optional) Add a secure area for clients to view project milestones.
- [ ] **Dynamic Services:** Allow editing service descriptions and icons from the admin panel.
- [ ] **Blog/Insights:** Add a section for engineering case studies and technical articles.
- [ ] **Inquiry System:** Direct lead management in the admin panel for project requests.

---
*Last Updated: May 28, 2026*
