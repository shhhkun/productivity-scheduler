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

### **v1.3 - Schedule Upgrade**
- Scheduler Overhaul
    - 7-day view window
    - Calendar for adding tasks in advance/navigation
    - Arrows for week navigation
    - Change task storage system
- Agenda sidebar
    - Task color coding/legend
    - Quick nav
    - Highlights current week being viewed

### *v1.4 - Database**
- Firebase integration
    - User sign-up/log-in with Firebase Authentication
    - Task and storage persistence with Firebase Database
    - Host the app using Firebase for public access
- General UI polish
- Dark/light mode toggle

### *v1.5 - Next**
- Fitness/workout plan sidebar
    - Can hold weekly workout split
    - Weight logger/tracker (with graph?)
- Fix/rework streak logic

---

## Roadmap

- [x] Sticky XP bar w/ responsive layout
- [x] Achievements & title system (e.g., “Task Apprentice”)
- [ ] Task history or log view
- [ ] Optional streak mechanic modes (daily, 3-day/week, etc.)
- [x] Animation polish (reduce layout shift on reordering)
- [x] Data persistence via firebase
- [ ] Mobile responsiveness
- [ ] Dark mode toggle

---

## Known Bugs/Issues

- [x] Rank up notification will sometimes persist/stay
    - [x] Potential Cause: large influx of XP at once, de-leveling
    - [x] New Cause: after page refresh, rank up notification is static (likely tied to data persistence) 
- [ ] Streak counter stuck at 0 days
    - will be fixed later on once data persistence and user login is implemented
    - rethinking purpose/necessity of streak counter

## Notes

- XP/streak logic currently only updates on task checkmarks.
- Streak logic tied to calendar day rollover — better UX needed.
- Animation tuning ongoing (e.g., card bounce, modal scale)
- Refactorable code later on:
    - rankbadge.jsx and badgedisplay.jsx were refactored, possibly remove badgedisplay later on
    - level states and event handlers
- Clean up code structure:
    - Ordering of state variables
    - Ordering of useEffect()'s
    - Order of functions
- Clean up Login UI
- Clean up settings/debug menu

---

## Developer

Project by **Serjo Barron**  
Built with:  
`React` • `TailwindCSS` • `Framer Motion`