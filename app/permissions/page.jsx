"use client";
import React, { useState, useCallback, useRef } from "react";
import InputWithTitle from "../../components/generic/InputWithTitle";
import PermissionManager from "../../components/permissionManager";
import withAuth from "@/utils/withAuth";
import { user } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import { useRouter } from "next/navigation";

const Permission = () => {
  const router = useRouter();
  const api = new APICall();

  const [permissionsData, setPermissionsData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  // Use ref to prevent infinite re-renders
  const permissionsRef = useRef(null);

  // Function to receive permissions data from child component
  const handlePermissionsChange = useCallback((data) => {
    // Prevent unnecessary updates if data is the same
    if (JSON.stringify(data) === JSON.stringify(permissionsRef.current)) {
      return;
    }

    // Extract only the modules part from the permissions data
    const modulesOnlyData = data?.permissions?.modules
      ? {
          permissions: {
            modules: data.permissions.modules,
          },
        }
      : data;

    permissionsRef.current = data;
    setPermissionsData(modulesOnlyData);
    console.log("Permissions data received (modules only):", modulesOnlyData);
  }, []);

  // Function to handle input changes
  const handleInputChange = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error when user starts typing
    setErrors((prev) => {
      if (prev[name]) {
        return {
          ...prev,
          [name]: "",
        };
      }
      return prev;
    });

    // Real-time password confirmation validation
    if (name === "confirmPassword" || name === "password") {
      setFormData((currentFormData) => {
        const password = name === "password" ? value : currentFormData.password;
        const confirmPassword =
          name === "confirmPassword" ? value : currentFormData.confirmPassword;

        if (confirmPassword && password !== confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Passwords do not match",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "",
          }));
        }

        return currentFormData;
      });
    }
  }, []);

  // Password validation function
  const validatePassword = useCallback((password) => {
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
  }, []);

  // Form validation function
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
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
  }, [formData, validatePassword]);

  // Function to handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (validateForm()) {
        const completeFormData = {
          ...formData,
          permissions: permissionsData,
        };

        try {
          const response = await api.getDataWithToken(
            `${user}`,
            completeFormData
          );
        } catch (error) {
          console.error("Error fetching ref no:", error);
        }
      } else {
        console.log("Form validation failed");
      }
    },
    [formData, permissionsData, validateForm, user]
  );

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
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {errors.name && (
              <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                {errors.name}
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
              Password must contain: 8+ characters, uppercase, lowercase,
              number, special character
            </div>
          </div>
          <div style={{ flex: 1, marginLeft: "10px" }}>
            <InputWithTitle
              title="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
            />
            {errors.confirmPassword && (
              <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                {errors.confirmPassword}
              </div>
            )}
          </div>
        </div>

        <div>
          <PermissionManager
            onPermissionsChange={handlePermissionsChange}
            key="permission-manager"
          />
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
              fontSize: "16px",
            }}
          >
            Submit
          </button>
        </div>

        {/* Debug: Show current permissions data */}
        {permissionsData && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h4>Current Permissions JSON (Modules Only):</h4>
            <pre>{JSON.stringify(permissionsData, null, 2)}</pre>
          </div>
        )}
      </form>
    </div>
  );
};

export default Permission;
