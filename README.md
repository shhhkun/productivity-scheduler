# Kept — A Minimalist Productivity Scheduler

## Overview
**Kept** is a minimalist productivity scheduler that helps users plan their days with a simple time-block interface and motivational game elements. Track your streaks, earn XP, and stay organized — all with a sleek UI, animations, and Firebase-backed persistence.

[**Live Demo**](https://productivityapp-eb15a.web.app/)

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

### *v1.4 - Firestore Database & User Authentication**
- Firebase integration
    - User sign-up/log-in with Firebase Authentication
    - Task and storage persistence with Firebase Database
    - Host the app using Firebase for public access
- General UI polish
- Dark/light mode toggles

### *v1.5 - Upcoming/Next**
- Fitness/workout plan sidebar
    - Can hold weekly workout split
    - Weight logger/tracker (with graph?)
- Achievement system
---

## Roadmap

- [x] Sticky XP bar w/ responsive layout
- [x] Achievements & title system (e.g., “Task Apprentice”)
- [x] Task overview
- [x] Animation polish (reduce layout shift on reordering)
- [x] Data persistence via firebase
- [ ] Mobile responsiveness
- [x] Dark/light mode toggle (list):
    - [x] App
    - [x] AuthScreen
    - [x] TaskModal
    - [x] ScheduleGrid (may change default white color for actual task div blocks)
    - Components
        - [x] agendasidebar
        - [x] calendarpicker
        - [x] completebutton (still need to fix '< >' logic in index.css)
        - [x] dayselectorbar
        - [x] debugmenu (should clean up animations, and refactor into proper settings menu)
        - [x] modal
        - [x] rankbadge
        - [x] xpstreakdisplay
        - [x] toast/toaster
- [x] Code cleanup

---

## Known Bugs/Issues

- [x] Rank up notification will sometimes persist/stay
    - [x] Potential Cause: large influx of XP at once, de-leveling
    - [x] New Cause: after page refresh, rank up notification is static (likely tied to data persistence) 
- [x] Streak counter stuck at 0 days
    - [x] Removed streak counter logic, deemed unnecessary

## Notes

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
- Optimize firebase read/write op's
- Hide sensitive errors/info on console.log

---

## Developer

Project by **Serjo Barron**  
Built with:  
`React` • `TailwindCSS` • `Framer Motion` • `Vite` • `TailwindCSS` • `Framer Motion` • `Firebase Authentication` • `Firestore` • `Firebase Hosting` • `React Icons` • `React Calendar`