// lib/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB7XzBqkqFxRMAjtHJC4INfIOc0jWpZIhY",
  authDomain: "personal-web-634c1.firebaseapp.com",
  projectId: "personal-web-634c1",
  storageBucket: "personal-web-634c1.appspot.com",
  messagingSenderId: "125534217272",
  appId: "1:125534217272:web:5df6c71954a11613cbb2cd",
  measurementId: "G-PCV6PVTCRR",
};

const app = initializeApp(firebaseConfig);
const analytics =
  app.name && typeof window !== "undefined" ? getAnalytics(app) : null;

export { analytics };
