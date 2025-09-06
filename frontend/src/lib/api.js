const API_BASE = "http://localhost:5000"; 

export const api = {
  // Problems
  async getProblems() {
    try {
      const res = await fetch(`${API_BASE}/api/problems`);
      if (!res.ok) throw new Error("Failed to fetch problems");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

async postProblem(formData) {
  try {
    const res = await fetch(`${API_BASE}/api/problems`, {
      method: "POST",
      headers: {
        Authorization: `Bearer <your-jwt-token>` // add later
      },
      body: formData, 
    });

    if (!res.ok) throw new Error("Failed to post problem");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
},
async getProblem(id) {
  try {
    const res = await fetch(`${API_BASE}/api/problems/${id}`);
    if (!res.ok) throw new Error("Failed to fetch problem");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}


};
