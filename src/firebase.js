import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@babel/core"

// web app firebase configs
const firebaseConfig = {
  apiKey: "AIzaSyB4bE8iB6H6n8tSGDK7yE2KK27hT_XGwDg",
  authDomain: "productivityapp-eb15a.firebaseapp.com",
  projectId: "productivityapp-eb15a",
  storageBucket: "productivityapp-eb15a.appspot.com",
  messagingSenderId: "839838284279",
  appId: "1:839838284279:web:976482fc4f87b8c54e96f2",
  measurementId: "G-M6HYPB1B7Y"
};

// initialize firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db};
