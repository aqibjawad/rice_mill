import { useState, useEffect } from "react";

export const usePermissions = () => {
  const [permissions, setPermissions] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // First, try the persist:root structure
      const persistedData = localStorage.getItem("persist:root");
      
      if (persistedData) {
        const parsedPersisted = JSON.parse(persistedData);
        const authData = JSON.parse(parsedPersisted.auth);
        const loginData = authData.loginData;
        
        console.log("Login data from persist:root:", loginData);

        setUserId(loginData?.id);
        
        console.log("User data from persist:root:", {
          id: loginData?.id
        });
        
        // Parse permissions if available
        if (loginData?.permissions) {
          const permsData = JSON.parse(loginData.permissions);
          setPermissions(permsData?.permissions);
          console.log("Permissions from persist:root:", permsData?.permissions);
        }
      } else {
        // Fallback: Try direct localStorage approach
        const directPermissions = localStorage.getItem("permissions");
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
                
        setUserId(userData?.id);
        
        if (directPermissions) {
          const parsedPermissions = JSON.parse(directPermissions);
          setPermissions(parsedPermissions);
          console.log("Permissions from direct storage:", parsedPermissions);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error loading permissions:", error);
      
      // Final fallback - check if user exists at all
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          setUserId(userData.id);
          console.log("Fallback user data:", {
            role: userData.role,
            id: userData.id
          });
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
      
      setLoading(false);
    }
  }, []);

  // Helper function to check if user is admin (ID = 1)
  const isAdmin = () => {
    return userId === 1 || userId === "1";
  };

  // Main permission checker - if admin, return true; otherwise check specific permissions
  const checkModulePermission = (moduleParentName, permission) => {
    // Admin (ID = 1) has all permissions
    if (isAdmin()) {
      console.log(`✅ Admin (ID: ${userId}) access granted for ${moduleParentName} - ${permission}`);
      return true;
    }

    // Check if permissions are loaded
    if (!permissions?.modules) {
      console.log("❌ Permissions not loaded yet, permissions:", permissions);
      return false;
    }

    // Find the module by parent name
    const module = permissions.modules.find(
      (mod) => mod.parent === moduleParentName
    );

    if (!module) {
      console.log(`❌ Module not found: ${moduleParentName}`, permissions.modules);
      return false;
    }

    // Check if the specific permission exists
    const hasPermission = module.permissions?.includes(permission);
    console.log(`${hasPermission ? '✅' : '❌'} Permission check for ${moduleParentName}.${permission}:`, hasPermission);
    
    return hasPermission || false;
  };

  // Check field-level permissions
  const checkFieldPermission = (moduleName, fieldItem) => {
    // Admin (ID = 1) has all permissions
    if (isAdmin()) {
      console.log(`✅ Admin (ID: ${userId}) field access granted for ${moduleName} - ${fieldItem}`);
      return true;
    }

    // Check if permissions are loaded
    if (!permissions?.fields) {
      console.log("❌ Field permissions not loaded yet");
      return false;
    }

    // Find the module fields
    const moduleFields = permissions.fields.find(
      (field) => field.module === moduleName
    );

    if (!moduleFields?.fields) {
      console.log(`❌ Module fields not found: ${moduleName}`);
      return false;
    }

    // Normalize field name for case-insensitive matching
    const normalizedFieldItem = fieldItem?.toLowerCase();
    const fieldKeys = Object.keys(moduleFields.fields);
    const matchingKey = fieldKeys.find(
      (key) => key.toLowerCase() === normalizedFieldItem
    );

    if (!matchingKey) {
      console.log(`❌ Field not found: ${fieldItem} in module ${moduleName}`);
      return false;
    }

    const hasViewPermission = moduleFields.fields[matchingKey]?.view || false;
    console.log(`${hasViewPermission ? '✅' : '❌'} Field permission check for ${moduleName}.${fieldItem}:`, hasViewPermission);
    
    return hasViewPermission;
  };

  // Check if user has access to any functionality in a module
  const hasAnyModulePermission = (moduleParentName) => {
    // Admin has access to everything
    if (isAdmin()) {
      console.log(`✅ Admin (ID: ${userId}) has access to ${moduleParentName}`);
      return true;
    }

    if (!permissions?.modules) {
      console.log(`❌ No permissions loaded for checking ${moduleParentName}`);
      return false;
    }

    const module = permissions.modules.find(
      (mod) => mod.parent === moduleParentName
    );

    const hasAccess = module && module.permissions && module.permissions.length > 0;
    console.log(`${hasAccess ? '✅' : '❌'} Module access check for ${moduleParentName}:`, hasAccess, module);
    
    return hasAccess;
  };

  // Get all available modules for current user
  const getAvailableModules = () => {
    if (isAdmin()) {
      return "all"; // Admin has access to all modules
    }

    if (!permissions?.modules) {
      return [];
    }

    return permissions.modules.map(module => ({
      parent: module.parent,
      permissions: module.permissions || []
    }));
  };

  // Quick permission check helpers for common scenarios
  const canView = (moduleParentName) => checkModulePermission(moduleParentName, "View");
  const canAdd = (moduleParentName) => checkModulePermission(moduleParentName, "Add");
  const canEdit = (moduleParentName) => checkModulePermission(moduleParentName, "Edit"); 
  const canDelete = (moduleParentName) => checkModulePermission(moduleParentName, "Delete");

  // Get user's permissions summary
  const getPermissionsSummary = () => {
    return {
      userId: userId,
      isAdmin: isAdmin(),
      modules: permissions?.modules || [],
      fields: permissions?.fields || [],
      totalModules: permissions?.modules?.length || 0,
      totalFieldPermissions: permissions?.fields?.length || 0
    };
  };

  return {
    // Core permission checking functions
    checkModulePermission,
    checkFieldPermission,
    hasAnyModulePermission,
    
    // Quick helpers
    canView,
    canAdd, 
    canEdit,
    canDelete,
    
    // Utility functions
    isAdmin,
    getAvailableModules,
    getPermissionsSummary,
    
    // State information
    userId,
    permissions,
    isLoaded: !loading && (permissions !== null || isAdmin()),
    loading,
    
    // For debugging
    debug: {
      rawPermissions: permissions,
      userId: userId,
      isAdmin: isAdmin(),
      availableModules: getAvailableModules()
    }
  };
};