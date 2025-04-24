import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    axios
      .get("http://localhost:8000/users/home/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage("Unauthorized: Please log in"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login"); 
  };

  return (
    <div>
      <h2>Welcome to the User Home Page</h2>
      <p>{message}</p>
      <button onClick={handleLogout} style={{
        padding: '10px 20px',
        backgroundColor: 'crimson',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginTop: '20px'
      }}>
        Logout
      </button>
    </div>
  );
};

export default HomePage;
