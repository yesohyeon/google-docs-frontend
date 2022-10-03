import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";

import NavBar from "../component/NavBar";

import { UserContext } from "../context/userContext";

function Home() {
  const { loggedInUser: { reloadUserInfo: { localId } } } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <>
      <NavBar />
    </>
  );
}

export default Home;
