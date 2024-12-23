import React from "react";
import { useNavigate, Link } from "react-router-dom"; // Import the useNavigate hook

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <p>Home Page</p>
    </div>
  );
};

export default HomePage;
