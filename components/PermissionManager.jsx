import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const modules = {
  Dashbaord: {
    name: "Dashbaord",
    permissions: ["View Dashbaord"],
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
  Expense: {
    name: "Expense",
    permissions: ["Add Expense", "View Expense"],
  },
  Banks: {
    name: "Banks",
    permissions: ["View Banks", "Add Banks" , "Bank Ledger"],
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
}) => {
  const [modulePerms, setModulePerms] = useState({});
  const [isModuleOpen, setIsModuleOpen] = useState({});
  const [selectedRoledId, setSelectedRoleId] = useState();
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [sendingData, setSendingData] = useState(false);

  // Send permissions data to parent whenever it changes
  useEffect(() => {
    // Only proceed if we have some permissions selected
    if (Object.keys(modulePerms).length === 0) {
      if (onPermissionsChange) {
        onPermissionsChange({});
      }
      return;
    }

    const myModules = Object.entries(modulePerms).map(
      ([parent, permissions]) => ({
        parent,
        permissions: permissions,
      })
    );

    const transformedData = {
      permissions: {
        modules: myModules,
      },
    };

    // Send data to parent component only if preventApiCalls is not true
    if (onPermissionsChange && !preventApiCalls) {
      onPermissionsChange(transformedData);
    } else if (onPermissionsChange) {
      // Still send data but mark it as data-only mode
      onPermissionsChange(transformedData);
    }
  }, [modulePerms, onPermissionsChange, preventApiCalls]);

  const toggleModuleOpen = (moduleName) => {
    setIsModuleOpen((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  // Handle module-level permission toggle
  const handleModulePermission = (moduleName, permission) => {
    setModulePerms((prev) => {
      const newPermissions = { ...prev };
      const moduleKey = moduleName;

      if (!newPermissions[moduleKey]) {
        newPermissions[moduleKey] = [];
      }

      const permissionIndex = newPermissions[moduleKey].indexOf(permission);
      if (permissionIndex === -1) {
        newPermissions[moduleKey] = [...newPermissions[moduleKey], permission];
      } else {
        newPermissions[moduleKey] = newPermissions[moduleKey].filter(
          (p) => p !== permission
        );
        if (newPermissions[moduleKey].length === 0)
          delete newPermissions[moduleKey];
      }

      return newPermissions;
    });
  };

  const isModulePermissionSelected = (moduleName, permission) => {
    return modulePerms[moduleName]?.includes(permission) || false;
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
                <div className="mb-2 text-sm font-medium text-gray-600">
                  Module Permissions:
                </div>
                <div className="flex flex-wrap gap-2">
                  {moduleData.permissions.map((permission) => (
                    <button
                      key={permission}
                      className={`px-3 py-1 text-sm rounded-lg transition-all font-medium ${
                        isModulePermissionSelected(moduleName, permission)
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() =>
                        handleModulePermission(moduleName, permission)
                      }
                    >
                      {permission.charAt(0).toUpperCase() + permission.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionsManager;