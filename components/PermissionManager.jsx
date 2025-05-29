import React, { useEffect, useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";

const modules = {
  Dashboard: {
    name: "Dashboard",
    permissions: ["View Dashboard"],
  },
  Sales: {
    name: "Sales",
    permissions: ["Add Sales", "View Sales"],
  },
  Purchase: {
    name: "Purchase",
    permissions: ["Add Purchase", "View Purchase"],
  },
  TrialBalance: {
    name: "Trial Balance",
    permissions: ["view"],
  },
  Receives: {
    name: "Receives",
    permissions: [
      "Add Receives",
      "View Receives",
      "Receives Party",
      "Receives Investor",
      "Receives Product",
    ],
  },
  Payments: {
    name: "Payments",
    permissions: [
      "Add Payments",
      "View Payments",
      "Payment Party",
      "Payment Investor",
      "Payment Product",
    ],
  },
  Investor: {
    name: "Investor",
    permissions: ["Add Investor", "View Investor"],
  },
  Party: {
    name: "Party",
    permissions: ["Add Party", "View Party"],
  },
  Expenses: {
    name: "Expenses",
    permissions: ["Add Expenses", "View Expenses"],
  },
  Banks: {
    name: "Banks",
    permissions: ["View Banks", "Add Banks", "Bank Ledger"],
  },
  Products: {
    name: "Products",
    permissions: ["Add Products", "View Products"],
  },
};

const PermissionsManager = ({
  onPermissionsChange,
  preventApiCalls = false,
  mode = "normal",
  existingPermissions = null,
  currentPermissions,
}) => {
  const [modulePerms, setModulePerms] = useState({});
  const [isModuleOpen, setIsModuleOpen] = useState({});
  const [selectedRoledId, setSelectedRoleId] = useState();
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [sendingData, setSendingData] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper function to check if permission should be disabled
  const isPermissionDisabled = (moduleName, permission) => {
    if (moduleName === "Receives") {
      const currentModulePerms = modulePerms[moduleName] || [];
      
      // If "View Receives" is selected, disable other 4 permissions
      if (currentModulePerms.includes("View Receives")) {
        return ["Add Receives", "Receives Party", "Receives Investor", "Receives Product"].includes(permission);
      }
    }
    
    if (moduleName === "Payments") {
      const currentModulePerms = modulePerms[moduleName] || [];
      
      // If "View Payments" is selected, disable other 4 permissions
      if (currentModulePerms.includes("View Payments")) {
        return ["Add Payments", "Payment Party", "Payment Investor", "Payment Product"].includes(permission);
      }
    }
    
    return false;
  };

  // Helper function to get conditional permissions that should be auto-added
  const getConditionalPermissions = (moduleName, permission, isAdding) => {
    const additionalPermissions = [];
    
    if (moduleName === "Receives" && isAdding) {
      // Auto-select "Add Receives" when selecting party, investor, or product
      if (["Receives Party", "Receives Investor", "Receives Product"].includes(permission)) {
        const currentModulePerms = modulePerms[moduleName] || [];
        if (!currentModulePerms.includes("Add Receives")) {
          additionalPermissions.push("Add Receives");
        }
      }
    }
    
    if (moduleName === "Payments" && isAdding) {
      // Auto-select "Add Payments" when selecting party, investor, or product
      if (["Payment Party", "Payment Investor", "Payment Product"].includes(permission)) {
        const currentModulePerms = modulePerms[moduleName] || [];
        if (!currentModulePerms.includes("Add Payments")) {
          additionalPermissions.push("Add Payments");
        }
      }
    }
    
    return additionalPermissions;
  };

  // Helper function to get permissions that should be auto-removed
  const getPermissionsToRemove = (moduleName, permission, isRemoving) => {
    const permissionsToRemove = [];
    
    if (moduleName === "Receives" && isRemoving) {
      const currentModulePerms = modulePerms[moduleName] || [];
      
      // If removing "Add Receives", also remove party, investor, product permissions
      if (permission === "Add Receives") {
        ["Receives Party", "Receives Investor", "Receives Product"].forEach(perm => {
          if (currentModulePerms.includes(perm)) {
            permissionsToRemove.push(perm);
          }
        });
      }
    }
    
    if (moduleName === "Payments" && isRemoving) {
      const currentModulePerms = modulePerms[moduleName] || [];
      
      // If removing "Add Payments", also remove party, investor, product permissions
      if (permission === "Add Payments") {
        ["Payment Party", "Payment Investor", "Payment Product"].forEach(perm => {
          if (currentModulePerms.includes(perm)) {
            permissionsToRemove.push(perm);
          }
        });
      }
    }
    
    return permissionsToRemove;
  };

  // Initialize permissions from currentPermissions prop
  useEffect(() => {
    if (currentPermissions && !isInitialized) {
      console.log("Initializing from currentPermissions:", currentPermissions);
      
      const processedPermissions = {};
      
      // Handle nested structure: { "permissions": { "modules": [] } }
      let modulesData = [];
      
      if (currentPermissions.permissions && currentPermissions.permissions.modules) {
        modulesData = currentPermissions.permissions.modules;
        console.log("Found nested modules:", modulesData);
      } else if (currentPermissions.modules) {
        modulesData = currentPermissions.modules;
        console.log("Found direct modules:", modulesData);
      } else if (Array.isArray(currentPermissions)) {
        modulesData = currentPermissions;
        console.log("Found array modules:", modulesData);
      } else {
        // Direct object format { "ModuleName": ["permission1", "permission2"] }
        Object.keys(currentPermissions).forEach(moduleName => {
          if (Array.isArray(currentPermissions[moduleName]) && currentPermissions[moduleName].length > 0) {
            processedPermissions[moduleName] = [...currentPermissions[moduleName]];
          }
        });
        console.log("Processed direct format:", processedPermissions);
      }
      
      // Process modules array format
      if (Array.isArray(modulesData) && modulesData.length > 0) {
        modulesData.forEach((module) => {
          if (module.parent && module.permissions && Array.isArray(module.permissions)) {
            processedPermissions[module.parent] = [...module.permissions];
            console.log(`Processed module: ${module.parent}`, module.permissions);
          }
        });
      }

      console.log("Final processed permissions:", processedPermissions);
      
      // State mein set kar rahe hain
      setModulePerms(processedPermissions);

      // Jo modules mein permissions hain unhe open kar dete hain
      const openModules = {};
      Object.keys(processedPermissions).forEach((moduleName) => {
        if (processedPermissions[moduleName] && processedPermissions[moduleName].length > 0) {
          openModules[moduleName] = true;
        }
      });
      setIsModuleOpen(openModules);

      setIsInitialized(true);
    } else if (existingPermissions && !isInitialized) {
      // Existing permissions se initialize karna (previous logic)
      const existingModules = {};
      let modulesArray = [];

      if (existingPermissions.permissions && existingPermissions.permissions.modules) {
        modulesArray = existingPermissions.permissions.modules;
      } else if (existingPermissions.modules) {
        modulesArray = existingPermissions.modules;
      } else if (Array.isArray(existingPermissions)) {
        modulesArray = existingPermissions;
      }

      if (Array.isArray(modulesArray)) {
        modulesArray.forEach((module) => {
          if (module.parent && module.permissions && Array.isArray(module.permissions)) {
            existingModules[module.parent] = module.permissions.slice();
          }
        });
      }

      setModulePerms(() => ({ ...existingModules }));

      const openModules = {};
      Object.keys(existingModules).forEach((moduleName) => {
        if (existingModules[moduleName].length > 0) {
          openModules[moduleName] = true;
        }
      });
      setIsModuleOpen(() => ({ ...openModules }));

      setIsInitialized(true);
    } else if (!currentPermissions && !existingPermissions && !isInitialized) {
      // Koi permissions nahi aayi, empty state se start karte hain
      console.log("No permissions found, initializing empty state");
      setIsInitialized(true);
    }
    
    // Agar currentPermissions change ho jaaye to re-initialize karna
    if (isInitialized && currentPermissions) {
      console.log("Re-initializing due to currentPermissions change:", currentPermissions);
      
      const processedPermissions = {};
      
      // Handle nested structure
      let modulesData = [];
      
      if (currentPermissions.permissions && currentPermissions.permissions.modules) {
        modulesData = currentPermissions.permissions.modules;
      } else if (currentPermissions.modules) {
        modulesData = currentPermissions.modules;
      } else if (Array.isArray(currentPermissions)) {
        modulesData = currentPermissions;
      } else {
        // Direct object format
        Object.keys(currentPermissions).forEach(moduleName => {
          if (Array.isArray(currentPermissions[moduleName]) && currentPermissions[moduleName].length > 0) {
            processedPermissions[moduleName] = [...currentPermissions[moduleName]];
          }
        });
      }
      
      // Process modules array format
      if (Array.isArray(modulesData) && modulesData.length > 0) {
        modulesData.forEach((module) => {
          if (module.parent && module.permissions && Array.isArray(module.permissions)) {
            processedPermissions[module.parent] = [...module.permissions];
          }
        });
      }

      console.log("Re-processed permissions:", processedPermissions);
      setModulePerms(processedPermissions);
      
      // Update open modules
      const openModules = {};
      Object.keys(processedPermissions).forEach((moduleName) => {
        if (processedPermissions[moduleName] && processedPermissions[moduleName].length > 0) {
          openModules[moduleName] = true;
        }
      });
      setIsModuleOpen(openModules);
    }
  }, [currentPermissions, existingPermissions, isInitialized]);

  // Memoized callback for sending permissions to parent
  const sendPermissionsToParent = useCallback((perms) => {
    if (!isInitialized) {
      return;
    }

    const myModules = Object.entries(perms)
      .filter(([parent, permissions]) => permissions && permissions.length > 0)
      .map(([parent, permissions]) => ({
        parent,
        permissions: [...permissions],
      }));

    const transformedData = {
      permissions: {
        modules: myModules,
      },
    };

    // Yahan aap direct object format bhi bhej sakte hain
    const directFormat = { ...perms };

    if (onPermissionsChange) {
      // Dono formats pass kar sakte hain parent ko
      onPermissionsChange(transformedData, directFormat);
    }

    console.log("Sending permissions - Transformed:", transformedData);
    console.log("Sending permissions - Direct:", directFormat);
  }, [onPermissionsChange, isInitialized]);

  // Send permissions data to parent whenever it changes
  useEffect(() => {
    sendPermissionsToParent(modulePerms);
  }, [modulePerms, sendPermissionsToParent]);

  const toggleModuleOpen = (moduleName) => {
    setIsModuleOpen((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  // Handle module-level permission toggle with proper immutability and conditional logic
  const handleModulePermission = useCallback((moduleName, permission) => {
    console.log(`Toggling permission: ${permission} for module: ${moduleName}`);
    
    // Check if permission is disabled
    if (isPermissionDisabled(moduleName, permission)) {
      console.log(`Permission ${permission} is disabled for module ${moduleName}`);
      return;
    }
    
    setModulePerms((prev) => {
      const newPermissions = {};
      
      // Copy all existing modules with new array references
      Object.keys(prev).forEach(key => {
        newPermissions[key] = [...prev[key]];
      });

      const moduleKey = moduleName;

      if (!newPermissions[moduleKey]) {
        newPermissions[moduleKey] = [];
      }

      const currentPermissions = newPermissions[moduleKey];
      const permissionIndex = currentPermissions.indexOf(permission);
      
      if (permissionIndex === -1) {
        // Add permission
        newPermissions[moduleKey] = [...currentPermissions, permission];
        console.log(`Added permission ${permission} to ${moduleName}`);
        
        // Handle conditional permissions
        const additionalPermissions = getConditionalPermissions(moduleName, permission, true);
        additionalPermissions.forEach(additionalPerm => {
          if (!newPermissions[moduleKey].includes(additionalPerm)) {
            newPermissions[moduleKey].push(additionalPerm);
            console.log(`Auto-added permission ${additionalPerm} to ${moduleName}`);
          }
        });
        
      } else {
        // Remove permission
        newPermissions[moduleKey] = currentPermissions.filter(p => p !== permission);
        console.log(`Removed permission ${permission} from ${moduleName}`);
        
        // Handle conditional removals
        const permissionsToRemove = getPermissionsToRemove(moduleName, permission, true);
        permissionsToRemove.forEach(permToRemove => {
          newPermissions[moduleKey] = newPermissions[moduleKey].filter(p => p !== permToRemove);
          console.log(`Auto-removed permission ${permToRemove} from ${moduleName}`);
        });
        
        // If no permissions left, remove the module entirely
        if (newPermissions[moduleKey].length === 0) {
          delete newPermissions[moduleKey];
          console.log(`Removed module ${moduleName} as it has no permissions`);
        }
      }

      console.log("Updated module permissions:", newPermissions);
      return newPermissions;
    });
  }, [modulePerms]);

  const isModulePermissionSelected = (moduleName, permission) => {
    return modulePerms[moduleName]?.includes(permission) || false;
  };

  // Function to select all permissions for a module
  const selectAllModulePermissions = useCallback((moduleName) => {
    const moduleData = modules[moduleName];
    if (!moduleData) return;

    console.log(`Selecting all permissions for ${moduleName}`);
    
    setModulePerms((prev) => {
      const newPermissions = {};
      
      Object.keys(prev).forEach(key => {
        newPermissions[key] = [...prev[key]];
      });
      
      newPermissions[moduleName] = [...moduleData.permissions];
      
      console.log(`Selected all permissions for ${moduleName}:`, newPermissions[moduleName]);
      return newPermissions;
    });
  }, []);

  // Function to clear all permissions for a module
  const clearAllModulePermissions = useCallback((moduleName) => {
    console.log(`Clearing all permissions for ${moduleName}`);
    
    setModulePerms((prev) => {
      const newPermissions = {};
      
      Object.keys(prev).forEach(key => {
        if (key !== moduleName) {
          newPermissions[key] = [...prev[key]];
        }
      });
      
      console.log(`Cleared all permissions for ${moduleName}. New state:`, newPermissions);
      return newPermissions;
    });
  }, []);

  // Function to check if all permissions are selected for a module
  const areAllModulePermissionsSelected = (moduleName) => {
    const moduleData = modules[moduleName];
    if (!moduleData || !modulePerms[moduleName]) return false;

    return moduleData.permissions.every((permission) =>
      modulePerms[moduleName].includes(permission)
    );
  };

  // Function to check if module has any permissions selected
  const hasAnyPermissionsSelected = (moduleName) => {
    return modulePerms[moduleName] && modulePerms[moduleName].length > 0;
  };

  return (
    <div className="w-full p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Permissions Manager
      </h2>
      
      {/* Grid Layout for Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(modules).map(([moduleName, moduleData]) => (
          <div
            key={moduleName}
            className="border border-gray-200 rounded-lg overflow-hidden h-fit"
          >
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleModuleOpen(moduleName)}
            >
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-700">
                  {moduleData.name}
                </h3>
                {/* Show selected count */}
                {hasAnyPermissionsSelected(moduleName) && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {modulePerms[moduleName].length} selected
                  </span>
                )}
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                  isModuleOpen[moduleName] ? "rotate-180" : ""
                }`}
              />
            </div>

            <div className={`${isModuleOpen[moduleName] ? "block" : "hidden"}`}>
              {/* Module-level permissions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-gray-600">
                    Module Permissions:
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        areAllModulePermissionsSelected(moduleName)
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      }`}
                      onClick={() => selectAllModulePermissions(moduleName)}
                      disabled={areAllModulePermissionsSelected(moduleName)}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        !hasAnyPermissionsSelected(moduleName)
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                      onClick={() => clearAllModulePermissions(moduleName)}
                      disabled={!hasAnyPermissionsSelected(moduleName)}
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {moduleData.permissions.map((permission) => {
                    const isSelected = isModulePermissionSelected(moduleName, permission);
                    const isDisabled = isPermissionDisabled(moduleName, permission);
                    
                    return (
                      <button
                        key={permission}
                        type="button"
                        className={`px-3 py-1 text-sm rounded-lg transition-all font-medium ${
                          isDisabled
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                            : isSelected
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        onClick={() =>
                          !isDisabled && handleModulePermission(moduleName, permission)
                        }
                        disabled={isDisabled}
                        title={
                          isDisabled && moduleName === "Receives" && modulePerms[moduleName]?.includes("View Receives")
                            ? "This permission is disabled when 'View Receives' is selected"
                            : isDisabled && moduleName === "Payments" && modulePerms[moduleName]?.includes("View Payments")
                            ? "This permission is disabled when 'View Payments' is selected"
                            : ""
                        }
                      >
                        {permission.charAt(0).toUpperCase() + permission.slice(1)}
                      </button>
                    );
                  })}
                </div>
                
                {/* Show conditional logic info for Receives and Payments modules */}
                {/* {moduleName === "Receives" && isModuleOpen[moduleName] && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs text-blue-700">
                      <div className="font-medium mb-1">Conditional Logic:</div>
                      <div>• Selecting Party/Investor/Product auto-selects "Add Receives"</div>
                      <div>• Selecting "View Receives" disables other permissions</div>
                    </div>
                  </div>
                )} */}
                
                {/* {moduleName === "Payments" && isModuleOpen[moduleName] && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <div className="text-xs text-green-700">
                      <div className="font-medium mb-1">Conditional Logic:</div>
                      <div>• Selecting Party/Investor/Product auto-selects "Add Payments"</div>
                      <div>• Selecting "View Payments" disables other permissions</div>
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionsManager;