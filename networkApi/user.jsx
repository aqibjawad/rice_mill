class User {
  constructor(userData) {
    this.user = userData.user;
    this.access_token = userData.access_token;
    this.permissions = userData.permissions;

    // Save to localStorage
    this.saveToStorage();
  }

  saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(this.user));
      localStorage.setItem("access_token", this.access_token);
      localStorage.setItem("permissions", JSON.stringify(this.permissions));
    }
  }

  static getFromStorage() {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      const access_token = localStorage.getItem("access_token");
      const permissions = localStorage.getItem("permissions");

      if (user && access_token && permissions) {
        return {
          user: JSON.parse(user),
          access_token: access_token,
          permissions: JSON.parse(permissions),
        };
      }
    }
    return null;
  }

  static clearStorage() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("permissions");
    }
  }

  // Check if user has specific permission
  hasPermission(module, permission) {
    if (!this.permissions || !this.permissions.modules) {
      return false;
    }

    const moduleData = this.permissions.modules.find(
      (m) => m.parent === module
    );
    if (!moduleData) {
      return false;
    }

    return moduleData.permissions.includes(permission);
  }

  // Get all permissions for a specific module
  getModulePermissions(module) {
    if (!this.permissions || !this.permissions.modules) {
      return [];
    }

    const moduleData = this.permissions.modules.find(
      (m) => m.parent === module
    );
    return moduleData ? moduleData.permissions : [];
  }

  // Check if user has access to any permission in a module
  hasModuleAccess(module) {
    if (!this.permissions || !this.permissions.modules) {
      return false;
    }

    return this.permissions.modules.some((m) => m.parent === module);
  }

  static getAccessToken() {
    const data = User.getFromStorage();
    return data ? data.access_token : null;
  }

  static getFromLocalStorage() {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      const access_token = localStorage.getItem("access_token");
      const permissions = localStorage.getItem("permissions");

      if (user && access_token) {
        return {
          user: JSON.parse(user),
          access_token: access_token,
          permissions: permissions ? JSON.parse(permissions) : null,
        };
      }
    }
    return null;
  }

  static getUserName() {
    const data = User.getFromLocalStorage();
    return data && data.user ? data.user.name : null;
  }

  static getUserPermissions() {
    const data = User.getFromLocalStorage();
    return data && data.permissions ? data.permissions : null;
  }

  // Static method to check permission without creating instance
  static hasUserPermission(module, permission) {
    const data = User.getFromLocalStorage();
    if (!data || !data.permissions || !data.permissions.modules) {
      return false;
    }

    const moduleData = data.permissions.modules.find(
      (m) => m.parent === module
    );
    if (!moduleData) {
      return false;
    }

    return moduleData.permissions.includes(permission);
  }
}

export default User;