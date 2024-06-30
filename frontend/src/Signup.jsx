import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Login.css"; // Import the CSS file

const Signup = ({ setComponent }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState({});
  const [existingEmails, setExistingEmails] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/emails")
      .then((result) => {
        setExistingEmails(result.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      axios
        .post("http://localhost:3001/register", {
          name,
          email,
          password,
          gender,
          profileType: "standard",
        })
        .then((result) => {
          console.log(result);
          setComponent("login");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Name validation
    if (!name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]{3,}$/.test(name)) {
      errors.name =
        "Name must contain only alphabets and be at least 3 characters long";
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w]{2,}$/.test(email)) {
      errors.email = "Email is invalid";
      isValid = false;
    } else if (!/@(outlook|yahoo|gmail|hotmail)\.(com)$/.test(email)) {
      errors.email = "Email domain is not supported";
      isValid = false;
    } else if (existingEmails.includes(email)) {
      errors.email = "Email already exists";
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Gender validation
    if (!gender) {
      errors.gender = "Gender is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="bg-dark p-3 rounded signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              name="name"
              autoComplete="off"
              className={`form-control text-black rounded-0 ${
                errors.name ? "is-invalid" : ""
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Email"
              name="email"
              className={`form-control text-black rounded-0 ${
                errors.email ? "is-invalid" : ""
              }`}
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className={`form-control text-black rounded-0 ${
                errors.password ? "is-invalid" : ""
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="gender">
              <strong>Gender</strong>
            </label>
            <select
              name="gender"
              className={`form-control rounded-0 ${
                errors.gender ? "is-invalid" : ""
              }`}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && (
              <div className="invalid-feedback">{errors.gender}</div>
            )}
          </div>
          <button type="submit" className="btn btn-danger w-100 rounded-0">
            Sign Up
          </button>
          <p>Already Have an Account?</p>
          <button
            type="button"
            className="btn btn-primary w-100 rounded-0 text-decoration-none"
            onClick={() => setComponent("login")}
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
