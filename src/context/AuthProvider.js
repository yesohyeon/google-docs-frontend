import { useState, useEffect } from "react";
import { UserContext } from "./userContext";

import axiosInstance from "../api/axiosInstance";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

function AuthProvider({ children }) {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isAuthStateChecked, setIsAuthStateChecked] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();

        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setLoggedInUser(user);
      } else {
        setLoggedInUser(null);
      }

      setIsAuthStateChecked(true);
    });
  }, []);

  return (
    <>
      {isAuthStateChecked && (
        <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
          {children}
        </UserContext.Provider>)
      }
    </>
  );
}

export default AuthProvider;
