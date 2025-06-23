import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./SignupPage.css";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { validateSignupForm } from "../../utils/validation"; // Import the validation logic
import axios from "axios";

const SignupPage = () => {
  const navigate = useNavigate();

  // State to handle form values and errors
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignupForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/adduser",
        formData
      );
      console.log("User created:", response.data);
      alert("Account created successfully!");
      navigate("/");
    } catch (error) {
      console.error(
        "Error creating account:",
        error.response?.data || error.message
      );
      alert("Error creating account. Please try again.");
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>

        <div className="input-box">
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <FaEnvelope className="icon" />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="input-box">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <FaUser className="icon" />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>

        <div className="input-box">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <FaLock className="icon" />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="terms">
          <label>
            <input
              type="checkbox"
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleChange}
            />
            I agree to the <Link to="*">Terms of Use</Link> and{" "}
            <Link to="*">Privacy Policy</Link>
          </label>
        </div>

        {errors.agreedToTerms && (
          <p className="error">{errors.agreedToTerms}</p>
        )}

        <button type="submit">Create An Account</button>

        <div className="login-link">
          <p>
            Already have an account? <Link to="/">Log in</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
