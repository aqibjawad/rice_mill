"use client";
import React, { useState, useCallback, useRef } from "react";
import InputWithTitle from "../../components/generic/InputWithTitle";
import PermissionManager from "../../components/permissionManager";
import withAuth from "@/utils/withAuth";
import { user } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';

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
  const [loading, setLoading] = useState(false);

  // Use ref to prevent infinite re-renders
  const permissionsRef = useRef(null);

  // Function to receive permissions data from child component
  // This should NOT trigger API calls - just store the permissions
  const handlePermissionsChange = useCallback((data) => {
    console.log("Received permissions data:", data);
    
    // Prevent unnecessary updates if data is the same
    if (JSON.stringify(data) === JSON.stringify(permissionsRef.current)) {
      return;
    }

    // Store the complete permissions data (not just modules)
    permissionsRef.current = data;
    setPermissionsData(data);
    console.log("Permissions data stored:", data);
    
    // Clear permissions error if data is provided
    if (data && Object.keys(data).length > 0) {
      setErrors((prev) => ({
        ...prev,
        permissions: "",
      }));
    }
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

    // Permissions validation - check if permissions data exists
    if (!permissionsData || Object.keys(permissionsData).length === 0) {
      newErrors.permissions = "Please select user permissions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validatePassword, permissionsData]);

  // SweetAlert Success function
  const showSuccessAlert = (message = "User Created Successfully!") => {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#28a745',
      timer: 3000,
      timerProgressBar: true
    }).then(() => {
      // Reset form after success
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setPermissionsData(null);
      permissionsRef.current = null;
      setErrors({});
    });
  };

  // SweetAlert Error function
  const showErrorAlert = (message = "Something went wrong!") => {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Try Again',
      confirmButtonColor: '#dc3545'
    });
  };

  // Function to handle form submission - ONLY API call happens HERE
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Prevent multiple simultaneous submissions
      if (loading) {
        return;
      }

      // Validate form including permissions
      if (!validateForm()) {
        console.log("Form validation failed");
        showErrorAlert("Please fill all required fields correctly and select permissions!");
        return;
      }

      setLoading(true);
      
      // Prepare complete form data with permissions
      const completeFormData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        // Spread the permissions data (this should contain the structure your API expects)
        ...permissionsData
      };

      console.log("Submitting user data:", completeFormData);

      try {
        // THIS is the ONLY place where API call should happen
        const response = await api.postDataToken(
          `${user}`,
          completeFormData
        );

        console.log("User creation response:", response);

        // Check if response indicates success
        if (response && (response.status === "success" || response.success)) {
          const successMessage = response.message || "User Created Successfully!";
          showSuccessAlert(successMessage);
        } else if (response && response.message) {
          // If there's a message in response but not success
          showErrorAlert(response.message);
        } else {
          showSuccessAlert();
        }
        
      } catch (error) {
        console.error("Error creating user:", error);
        
        // Handle different types of errors
        let errorMessage = "Something went wrong!";
        
        if (error.response) {
          // Server responded with error status
          if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error;
          } else {
            errorMessage = `Server Error: ${error.response.status}`;
          }
        } else if (error.message) {
          // Network or other error
          errorMessage = error.message;
        }
        
        showErrorAlert(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [formData, permissionsData, validateForm, api, user, loading]
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

        <div className="mt-10">
          {/* PermissionManager should NOT make API calls - only collect data */}
          <PermissionManager
            onPermissionsChange={handlePermissionsChange}
            preventApiCalls={true} // Make sure this prop prevents API calls
            mode="dataOnly" // Additional prop to ensure only data collection
            key="permission-manager"
          />
          {errors.permissions && (
            <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
              {errors.permissions}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-10">
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? "#6c757d" : "#007bff",
              color: "white",
              padding: "12px 24px",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "500",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s ease",
            }}
          >
            {loading ? "Creating User..." : "Create User"}
          </button>
        </div>

        {/* Debug: Show current permissions data */}
        {process.env.NODE_ENV === 'development' && permissionsData && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h4>Current Permissions Data:</h4>
            <pre style={{ fontSize: "12px", overflow: "auto" }}>
              {JSON.stringify(permissionsData, null, 2)}
            </pre>
          </div>
        )}
      </form>
    </div>
  );
};

export default withAuth(Permission);