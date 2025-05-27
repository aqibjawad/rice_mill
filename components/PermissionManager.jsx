import React, { useEffect, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

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
    permissions: [ "Add Receives", "View Receives", "Receives Party", "Receives Investor", "Receives Product"],
    fields: ["Select Party", "Amount", "Description"],
  },
  Payments: {
    name: "Payments",
    permissions: [ "Add Payments", "View Payments", "Payment Party", "Payment Investor", "Payment Product"],
    fields: ["Select Party", "Amount", "Description"],
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
    permissions: ["View Banks", "Add Banks"],
  },
  Products: {
    name: "Products",
    permissions: ["Add Products", "View Products"],
  },
};

const PermissionsManager = ({ onPermissionsChange }) => {
  const [modulePerms, setModulePerms] = useState({});
  const [fieldPerms, setFieldPerms] = useState({});
  const [isModuleOpen, setIsModuleOpen] = useState({});
  const [selectedRoledId, setSelectedRoleId] = useState();
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [sendingData, setSendingData] = useState(false);

  // Send permissions data to parent whenever it changes
  useEffect(() => {
    const myModules = Object.entries(modulePerms).map(
      ([parent, permissions]) => ({
        parent,
        permissions: permissions,
      })
    );

    // Transform fieldPerms for all modules
    const moduleFields = {};
    Object.keys(modules).forEach((moduleName) => {
      if (modules[moduleName].fields) {
        const fieldsList = {};
        modules[moduleName].fields.forEach((field) => {
          fieldsList[field] = {
            permissions: fieldPerms[`${moduleName}.${field}`] || [],
          };
        });

        moduleFields[moduleName] = {
          module: moduleName,
          fields: fieldsList,
        };
      }
    });

    const transformedData = {
      permissions: {
        modules: myModules,
        fields: Object.values(moduleFields),
      },
    };

    // Send data to parent component
    if (onPermissionsChange) {
      onPermissionsChange(transformedData);
    }
  }, [modulePerms, fieldPerms, onPermissionsChange]);

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

  // Handle field-level permission toggle
  const handleFieldPermission = (moduleName, fieldName, permission) => {
    // Check if module has view permission before allowing field permissions
    const hasViewPermission = modulePerms[moduleName]?.some(
      (perm) =>
        perm.toLowerCase().includes("view") ||
        perm.toLowerCase().includes("read")
    );

    if (!hasViewPermission) {
      return;
    }

    const key = `${moduleName}.${fieldName}`;
    setFieldPerms((prev) => {
      const newPermissions = { ...prev };

      if (!newPermissions[key]) {
        newPermissions[key] = [];
      }

      const permissionIndex = newPermissions[key].indexOf(permission);
      if (permissionIndex === -1) {
        newPermissions[key] = [...newPermissions[key], permission];
      } else {
        newPermissions[key] = newPermissions[key].filter(
          (p) => p !== permission
        );
        if (newPermissions[key].length === 0) {
          delete newPermissions[key];
        }
      }

      return newPermissions;
    });
  };

  // Toggle all field permissions
  const handleAllFieldPermissions = (moduleName) => {
    const moduleFields = modules[moduleName].fields;
    const fieldPermissions = modules[moduleName].fieldPermissions || [];

    const allFieldsSelected = moduleFields.every((field) =>
      fieldPermissions.every((permission) =>
        fieldPerms[`${moduleName}.${field}`]?.includes(permission)
      )
    );

    setFieldPerms((prev) => {
      const newPermissions = { ...prev };

      moduleFields.forEach((field) => {
        const key = `${moduleName}.${field}`;
        if (allFieldsSelected) {
          delete newPermissions[key];
        } else {
          newPermissions[key] = [...fieldPermissions];
        }
      });

      return newPermissions;
    });
  };

  const isModulePermissionSelected = (moduleName, permission) => {
    return modulePerms[moduleName]?.includes(permission) || false;
  };

  const isFieldPermissionSelected = (moduleName, fieldName, permission) => {
    const key = `${moduleName}.${fieldName}`;
    return fieldPerms[key]?.includes(permission) || false;
  };

  const isAllFieldsSelected = (moduleName) => {
    const fieldPermissions = modules[moduleName].fieldPermissions || [];
    return (
      modules[moduleName].fields?.every((field) =>
        fieldPermissions.every((permission) =>
          isFieldPermissionSelected(moduleName, field, permission)
        )
      ) || false
    );
  };

  const hasViewPermission = (moduleName) => {
    return modulePerms[moduleName]?.some(
      (perm) =>
        perm.toLowerCase().includes("view") ||
        perm.toLowerCase().includes("read")
    );
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
              <div className="p-4 border-b border-gray-200">
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

              {/* Field-level permissions */}
              {moduleData.fields && hasViewPermission(moduleName) && (
                <div className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700">
                      Field Permissions:
                    </div>
                    <button
                      onClick={() => handleAllFieldPermissions(moduleName)}
                      className={`px-3 py-1 text-sm rounded-lg transition-all ${
                        isAllFieldsSelected(moduleName)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {isAllFieldsSelected(moduleName)
                        ? "Clear All"
                        : "Select All"}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-[2fr,1fr] gap-2 pb-2 border-b border-gray-200">
                      <div className="text-sm font-medium text-gray-600">
                        Field Name
                      </div>
                      <div className="text-center text-sm font-medium text-gray-600">
                        View
                      </div>
                    </div>

                    {moduleData.fields.map((field) => (
                      <div
                        key={field}
                        className="grid grid-cols-[2fr,1fr] gap-2 items-center"
                      >
                        <div className="text-sm text-gray-700">{field}</div>
                        <div className="flex justify-center">
                          <button
                            className={`w-6 h-6 rounded transition-all flex items-center justify-center ${
                              isFieldPermissionSelected(
                                moduleName,
                                field,
                                "view"
                              )
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                            }`}
                            onClick={() =>
                              handleFieldPermission(moduleName, field, "view")
                            }
                          >
                            {isFieldPermissionSelected(
                              moduleName,
                              field,
                              "view"
                            ) && <Check className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end pt-4 border-t border-gray-200">
        {/* <button
          onClick={() => {
            if (
              Object.keys(modulePerms).length === 0 &&
              Object.keys(fieldPerms).length === 0
            ) {
              alert("Please select at least one permission");
            } else {
              if (
                window.confirm(
                  "Are you sure you want to save the permissions?"
                )
              ) {
                saveData();
              }
            }
          }}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={sendingData}
        >
          {sendingData ? "Saving..." : "Save Permissions"}
        </button> */}
      </div>
    </div>
  );
};

export default PermissionsManager;
