import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // Import the CSS file
const Login = ({ setComponent }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const checkSubscription = async (email) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/check-subscription",
        { email }
      );
      if (
        response.data.message ===
        "Subscription expired. Profile updated to standard."
      ) {
        alert(
          "Your subscription has expired. Your profile has been updated to standard."
        );
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      alert("Premium subscription is not active.");
    }
  };
  const checkAllSubscriptions = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/check-all-subscriptions"
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error checking all subscriptions:", error);
      alert("Error checking all subscriptions.");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });
      console.log(result);
      if (email === "admin" && password === "admin") {
        await checkAllSubscriptions();
        navigate("/admin");
      } else if (result.data.token) {
        localStorage.setItem("token", result.data.token);
        alert("Login Successful");
        await checkSubscription(email);
        navigate("/home", { state: { email } });
      } else if (result.data === "No record existed") {
        alert("No record exists!");
      } else {
        alert("Incorrect email or password");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="bg-dark p-3 rounded login-container">
        <center>
          <h2>Login</h2>
        </center>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="myEmail">
              <strong>Email</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Email"
              name="email"
              className="form-control rounded-0"
              id="myEmail"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="myPass">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="form-control rounded-0"
              id="myPass"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 rounded-0">
            Log in
          </button>
          <p>No account? Sign Up now</p>
          <button
            type="button"
            className="btn btn-danger w-100 rounded-0 text-decoration-none"
            onClick={() => setComponent("signup")}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
