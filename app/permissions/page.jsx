"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import InputWithTitle from "../../components/generic/InputWithTitle";
import PermissionManager from "../../components/permissionManager";
import withAuth from "@/utils/withAuth";
import { user } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

const Permission = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId"); // Get userId from URL params
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
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingUserPermissions, setExistingUserPermissions] = useState(null);

  // Use ref to prevent infinite re-renders
  const permissionsRef = useRef(null);

  // Fetch user details if userId is provided
  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
      setIsEditMode(true);
    }
  }, [userId]);

  // Function to fetch user details by ID
  const fetchUserDetails = async (id) => {
    setUserDataLoading(true);
    try {
      const response = await api.getDataWithToken(`${user}/${id}`);


      // Check multiple possible success indicators
      if (
        response &&
        (response.success || response.status === "success" || response.data)
      ) {
        const userData = response.data || response;


        // Populate form data
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          password: "", // Don't populate password for security
          confirmPassword: "",
        });

        // Set existing permissions if available
        if (userData.permissions) {
          setExistingUserPermissions(userData.permissions);
          // Set permissions data for validation
          setPermissionsData(userData.permissions);
          permissionsRef.current = userData.permissions;
        }

      } else {
        console.error("API Response doesn't indicate success:", response);
        showErrorAlert(response?.message || "Failed to load user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);

      if (error.response) {
        console.error("Error response:", error.response);
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }

      let errorMessage = "Error loading user details";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showErrorAlert(errorMessage);
    } finally {
      setUserDataLoading(false);
    }
  };

  // Function to receive permissions data from child component
  const handlePermissionsChange = useCallback((data) => {

    // Prevent unnecessary updates if data is the same
    if (JSON.stringify(data) === JSON.stringify(permissionsRef.current)) {
      return;
    }

    // Store the complete permissions data
    permissionsRef.current = data;
    setPermissionsData(data);

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

    // Password validation (only for new users or if password is being changed)
    if (!isEditMode || formData.password) {
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
    }

    // Permissions validation
    if (!permissionsData || Object.keys(permissionsData).length === 0) {
      newErrors.permissions = "Please select user permissions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validatePassword, permissionsData, isEditMode]);

  // SweetAlert Success function
  const showSuccessAlert = (message) => {
    const defaultMessage = isEditMode
      ? "User Updated Successfully!"
      : "User Created Successfully!";
    Swal.fire({
      title: "Success!",
      text: message || defaultMessage,
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#28a745",
      timer: 3000,
      timerProgressBar: true,
    }).then(() => {
      if (!isEditMode) {
        // Reset form after success for new user creation
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setPermissionsData(null);
        permissionsRef.current = null;
        setErrors({});
      }
    });
  };

  // SweetAlert Error function
  const showErrorAlert = (message = "Something went wrong!") => {
    Swal.fire({
      title: "Error!",
      text: message,
      icon: "error",
      confirmButtonText: "Try Again",
      confirmButtonColor: "#dc3545",
    });
  };

  // Function to handle form submission
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
        showErrorAlert(
          "Please fill all required fields correctly and select permissions!"
        );
        return;
      }

      setLoading(true);

      // Prepare complete form data with permissions
      const completeFormData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        ...permissionsData,
      };

      // Only include password if it's provided (for edit mode)
      if (formData.password) {
        completeFormData.password = formData.password;
      }

      console.log("Submitting user data:", completeFormData);

      try {
        let response;

        if (isEditMode && userId) {
          // Update existing user
          response = await api.postDataToken(
            `${user}/${userId}`,
            completeFormData
          );
        } else {
          // Create new user
          response = await api.postDataToken(`${user}`, completeFormData);
        }

        console.log("User operation response:", response);

        // Check if response indicates success
        if (response && (response.status === "success" || response.success)) {
          const successMessage =
            response.message ||
            (isEditMode
              ? "User Updated Successfully!"
              : "User Created Successfully!");
          showSuccessAlert(successMessage);
        } else if (response && response.message) {
          showErrorAlert(response.message);
        } else {
          showSuccessAlert();
        }
      } catch (error) {
        console.error("Error with user operation:", error);

        let errorMessage = "Something went wrong!";

        if (error.response) {
          if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error;
          } else {
            errorMessage = `Server Error: ${error.response.status}`;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        showErrorAlert(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [
      formData,
      permissionsData,
      validateForm,
      api,
      user,
      loading,
      isEditMode,
      userId,
    ]
  );

  // Show loading spinner while fetching user data
  if (userDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading user details...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontSize: "24px", fontWeight: 600 }}>
        {isEditMode ? "Edit User" : "Create User"}
      </div>

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
              title={
                isEditMode
                  ? "New Password (Leave blank to keep current)"
                  : "Password"
              }
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
            {(!isEditMode || formData.password) && (
              <div
                style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}
              >
                Password must contain: 8+ characters, uppercase, lowercase,
                number, special character
              </div>
            )}
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
          <PermissionManager
            onPermissionsChange={handlePermissionsChange}
            preventApiCalls={true}
            mode="dataOnly"
            // Pass both existing permissions and current permissions data
            existingPermissions={existingUserPermissions || permissionsData}
            currentPermissions={permissionsData} // Add this new prop
            key={`permission-manager-${userId || "new"}-${JSON.stringify(permissionsData)}`}
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
            {loading
              ? isEditMode
                ? "Updating User..."
                : "Creating User..."
              : isEditMode
              ? "Update User"
              : "Create User"}
          </button>
        </div>

        {/* Debug: Show current permissions data */}
        {/* {process.env.NODE_ENV === "development" && permissionsData && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h4>Current Permissions Data:</h4>
            <pre style={{ fontSize: "12px", overflow: "auto" }}>
              {JSON.stringify(permissionsData, null, 2)}
            </pre>
          </div>
        )} */}
      </form>
    </div>
  );
};

export default withAuth(Permission);