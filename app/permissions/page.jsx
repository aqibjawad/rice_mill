"use client";
import React, { useState } from "react";
import InputWithTitle from "../../components/generic/InputWithTitle";
import PermissionManager from "../../components/permissionManager";

const Permission = () => {
  const [permissionsData, setPermissionsData] = useState(null);
  const [formData, setFormData] = useState({
    person_name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});

  // Function to receive permissions data from child component
  const handlePermissionsChange = (data) => {
    setPermissionsData(data);
    console.log("Permissions data received:", data);
  };

  // Function to handle input changes
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Real-time password confirmation validation
    if (name === "confirmPassword" || (name === "password" && formData.confirmPassword)) {
      const password = name === "password" ? value : formData.password;
      const confirmPassword = name === "confirmPassword" ? value : formData.confirmPassword;
      
      if (confirmPassword && password !== confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: "Passwords do not match"
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ""
        }));
      }
    }
  };

  // Password validation function
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumbers) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  // Form validation function
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.person_name.trim()) {
      newErrors.person_name = "Name is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const completeFormData = {
        ...formData,
        permissions: permissionsData,
      };

      console.log("Complete form data:", completeFormData);
      // Send this data to your API
      alert("Form submitted successfully!");
    } else {
      console.log("Form validation failed");
    }
  };

  return (
    <div>
      <div style={{ fontSize: "24px", fontWeight: 600 }}>User</div>

      <form onSubmit={handleSubmit}>
        <div
          className="mt-10"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div style={{ flex: 1, marginRight: "10px" }}>
            <InputWithTitle
              title="Name"
              type="text"
              placeholder="Name"
              name="person_name"
              value={formData.person_name}
              onChange={(e) => handleInputChange("person_name", e.target.value)}
            />
            {errors.person_name && (
              <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                {errors.person_name}
              </div>
            )}
          </div>
          <div style={{ flex: 1, marginLeft: "10px" }}>
            <InputWithTitle
              title="Email"
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            {errors.email && (
              <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                {errors.email}
              </div>
            )}
          </div>
        </div>

        <div
          className="mt-10"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div style={{ flex: 1, marginRight: "10px" }}>
            <InputWithTitle
              title="Password"
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
            {errors.password && (
              <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                {errors.password}
              </div>
            )}
            {/* Password requirements hint */}
            <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
              Password must contain: 8+ characters, uppercase, lowercase, number, special character
            </div>
          </div>
          <div style={{ flex: 1, marginLeft: "10px" }}>
            <InputWithTitle
              title="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            />
            {errors.confirmPassword && (
              <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                {errors.confirmPassword}
              </div>
            )}
          </div>
        </div>

        <div>
          <PermissionManager onPermissionsChange={handlePermissionsChange} />
        </div>

        {/* Submit Button */}
        <div className="mt-10">
          <button
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Submit
          </button>
        </div>

        {/* Debug: Show current permissions data */}
        {permissionsData && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h4>Current Permissions JSON:</h4>
            <pre>{JSON.stringify(permissionsData, null, 2)}</pre>
          </div>
        )}
      </form>
    </div>
  );
};

export default Permission;