class User {
  constructor(userData) {
    this.userData = userData;
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(this.userData));
    }
  }

  static getFromLocalStorage() {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  static getAccessToken() {
    const data = User.getFromLocalStorage();
    return data ? data.access_token : null;
  }

  static getUserName() {
    const data = User.getFromLocalStorage();
    return data ? data.user.name : null;
  }

  static getUserPersmissions() {
    const data = User.getFromLocalStorage();
    return data ? data.permission.permission : null;
  }
}

export default User;
