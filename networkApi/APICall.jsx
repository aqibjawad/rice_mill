import axios from "axios";
import User from "./user";

class APICall {
  async handleRequest(request) {
    try {
      const response = await request();
      if (response.status === 200 || response.status === 204) {
        return response.data || { success: true };
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      if (error.response) {
        return {
          error: error.response.data || "Failed to process request",
          status: error.response.status,
        };
      } else {
        console.error(error);
        return { error: "Failed to process request", status: 500 };
      }
    }
  }

  getTokenHeaders() {
    const token = User.getAccessToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async postData(url, data) {
    return this.handleRequest(() => axios.post(url, data));
  }

  async fetchData(url) {
    return this.handleRequest(() => axios.get(url));
  }

  async postFormData(url, data) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    return this.handleRequest(() =>
      axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
  }

async postFormDataWithToken(url, data) {
  const formData = new FormData();
  
  // Ensure all values are strings
  Object.keys(data).forEach((key) => {
    formData.append(key, String(data[key] || '')); // Use empty string for null or undefined
  });

  console.log("Posting data to:", url);
  console.log("Request headers:", {
    ...this.getTokenHeaders(),
    "Content-Type": "multipart/form-data",
  });

  return this.handleRequest(() =>
    axios.post(url, formData, {
      headers: {
        ...this.getTokenHeaders(),
        "Content-Type": "multipart/form-data",
      },
    })
  );
}

  async getDataWithToken(url) {
    return this.handleRequest(() =>
      axios.get(url, {
        headers: this.getTokenHeaders(),
      })
    );
  }

  async deleteDataWithToken(url) {
    return this.handleRequest(() =>
      axios.delete(url, {
        headers: this.getTokenHeaders(),
      })
    );
  }

  async getUserById(url) {
    return this.handleRequest(() =>
      axios.get(url, {
        headers: this.getTokenHeaders(),
      })
    );
  }

  async updateFormDataWithToken(url, data) {
    return this.postFormDataWithToken(url, data);
  }

  async postDataWithToken(url, data) {
    return this.postFormDataWithToken(url, data);
  }

  async putDataWithToken(url, data) {
    return this.handleRequest(() =>
      axios.put(url, data, {
        headers: this.getTokenHeaders(),
      })
    );
  }
}

export default APICall;
