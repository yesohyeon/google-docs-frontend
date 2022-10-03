import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";

import { UserContext } from "../context/userContext";
import { auth, authenticate } from "../config/firebase";

function NavBar() {
  const [errorMessage, setErrorMessage] = useState("");
  const { setLoggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigate("/");
      } else {
        authenticate();
      }
    });
  };

  const handleLogOutClick = async () => {
    try {
      await signOut(auth);

      setLoggedInUser(null);

      navigate("/login");
    } catch (err) {
      setErrorMessage(err);
    }
  };

  return (
    <>
      <nav>
        <button onClick={handleHomeClick}>Home</button>
        <button onClick={handleLogOutClick}>Log out</button>
      </nav>
      <div>{errorMessage}</div>
    </>
  );
}

export default NavBar;
