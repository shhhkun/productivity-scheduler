import { useEffect, useState, useCallback } from 'react';
import { auth, db } from '@/firebase';
import {
  onAuthStateChanged
} from 'firebase/auth';
import {
  collection,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { debounce } from 'lodash';

export default function useFirebaseUser() {
  const [user, setUser] = useState(null);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [userDataLoaded, setUserDataLoaded] = useState(false);

  // firebase useEffects
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoadingUserData(true); // set loading before fetch
      console.log('[AuthState] Changed:', user); // Check if user is null or populated

      if (user) {
        setUser(user);

        // fetch user progress (xp, level)
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();

          console.log('[Fetched from Firestore]', {
            xp: data.xp,
            level: data.level,
          });

          setXp(data.xp ?? 0);
          setLevel(data.level ?? 1);
        }

        // fetch tasks
        const tasksSnapshot = await getDocs(
          collection(db, 'users', user.uid, 'tasks')
        );
        const tasksByDate = {};

        for (const docSnap of tasksSnapshot.docs) {
          const date = docSnap.id;
          const data = docSnap.data();
          tasksByDate[date] = data.tasks || [];
        }

        setTasks(tasksByDate);

        setLoadingUserData(false);
        setUserDataLoaded(true); // set user data loaded after fetching
      } else {
        // new user setup
        setUser(null);
        setXp(0);
        setLevel(1);
        setTasks([]);
        setLoadingUserData(false);
        setUserDataLoaded(false); // reset user data loaded
      }
    });

    return () => unsubscribe();
  }, []);

  const saveUserData = debounce(async (user, xp) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, { xp }, { merge: true });
  }, 2000); // 2-second debounce

  useEffect(() => {
    if (!user || loadingUserData) return;

    saveUserData(user, xp);
  }, [tasks, xp, user, loadingUserData]);

  // save xp and level on change
  useEffect(() => {
    if (!user || loadingUserData) return; // only save if user logged in

    const userRef = doc(db, 'users', user.uid);
    updateDoc(userRef, { xp, level }).catch(console.error);
  }, [xp, level, user, loadingUserData]);

  // save tasks when taskList changes (clears and rewrites all tasks; perhaps suboptimal)
  const saveAllTasks = useCallback(
    debounce(async (tasks, user) => {
      if (!user) return;

      for (const [date, tasksOnDate] of Object.entries(tasks)) {
        const taskDocRef = doc(db, 'users', user.uid, 'tasks', date);
        await setDoc(taskDocRef, { tasks: tasksOnDate }, { merge: true });
      }
    }, 1000),
    []
  );

  useEffect(() => {
    if (!user || loadingUserData) return;

    console.log('[SaveTasks] Triggered with tasks:', tasks);
    saveAllTasks(tasks, user); // debounce call
  }, [tasks, user, loadingUserData]);

  // fetch on auth state change
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setXp(data.xp || 0); // <- set actual XP
        }
      }
    };

    fetchUserData();
  }, []);

  return {
    user,
    xp,
    setXp,
    level,
    setLevel,
    tasks,
    setTasks,
    userDataLoaded,
    loadingUserData,
  };
}
