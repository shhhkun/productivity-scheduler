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

### **v1.2 – Ranks & Debugging**
- Sticky XP bar (includes rank/badges, level bar, and XP info)
- Badge/achievement system
- Debug menu (supports XP system)
- Rank/Level up animations

### **v1.3 - Upcoming**
- Scheduler Overhaul
    - 7-day view window
    - Calendar for adding tasks in advance/navigation
    - Arrows for week navigation
    - Change task storage system
- Agenda sidebar
    - Task color coding/legend
    - Quick nav
    - Highlights current week being viewed

### *v1.4 - Upcoming**
- Fitness/workout plan sidebar
    - Can hold weekly workout split
    - Weight logger/tracker (with graph?)
- Database storage for tasks, data persistence
- General UI polish/possible overhaul
- Dark/light mode toggle
- Better streak logic

---

## Roadmap

- [x] Sticky XP bar w/ responsive layout
- [x] Achievements & title system (e.g., “Task Apprentice”)
- [ ] Task history or log view
- [ ] Optional streak mechanic modes (daily, 3-day/week, etc.)
- [x] Animation polish (reduce layout shift on reordering)
- [ ] Data persistence via `localStorage`
- [ ] Mobile responsiveness
- [ ] Dark mode toggle

---

## Known Bugs/Issues

- [x] Rank up notification will sometimes persist/stay
    - Potential Cause(s): large influx of XP at once, de-leveling
- [ ] Streak counter stuck at 0 days
    - will be fixed later on once data persistence and user login is implemented

## Notes

- XP/streak logic currently only updates on task checkmarks.
- Streak logic tied to calendar day rollover — better UX needed.
- Animation tuning ongoing (e.g., card bounce, modal scale)
- Refactorable code later on:
    - rankbadge.jsx and badgedisplay.jsx were refactored, possibly remove badgedisplay later on
    - level states and event handlers

---

## Developer

Project by **Serjo Barron**  
Built with:  
`React` • `TailwindCSS` • `Framer Motion`