# 🧠 Productivity App – Dev Log & Roadmap

## Overview
A minimalistic productivity tracker featuring a gamified XP and streak system. Designed with animations, intuitive UI, and motivational mechanics.

---

## Update Log

### **v1.0 – Initial Template & Features**
- Set up base React app (`vite`)
- Task card layout (title, description, basic styling)
- Circle checkbox to mark task completion
- Modal form to add new tasks
- Initial animation logic (Framer Motion for layout transitions)

### **v1.1 – Gamification System**
- XP bar and level calculation
- Streak counter component
- XP & streak increment logic tied to task completion
- UI polish for XP display
- Refactored task state handlers for clarity

### **v1.2 – Upcoming**
- Sticky XP bar (always visible, non-obtrusive)
- Badge/achievement system brainstorm
- Better streak logic (more flexible, less punishing)
- Task categorization (daily, long-term, etc.)
- Data persistence (localStorage or backend setup)

---

## Roadmap

- [x] Sticky XP bar w/ responsive layout
- [ ] Achievements & title system (e.g., “Task Apprentice”)
- [ ] Task history or log view
- [ ] Optional streak mechanic modes (daily, 3-day/week, etc.)
- [ ] Animation polish (reduce layout shift on reordering)
- [ ] Data persistence via `localStorage`
- [ ] Mobile responsiveness
- [ ] Dark mode toggle

---

## Notes

- XP/streak logic currently only updates on task checkmarks.
- Streak logic tied to calendar day rollover — better UX needed.
- Animation tuning ongoing (e.g., card bounce, modal scale)

---

## Developer

Project by **Serjo Barron**  
Built with:  
`React` • `TailwindCSS` • `Framer Motion`