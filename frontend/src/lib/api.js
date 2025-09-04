const API_BASE = "http://localhost:5000"; // your backend URL

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

  async postProblem(problemData) {
    try {
      const res = await fetch(`${API_BASE}/api/problems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(problemData),
      });
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  // Similarly, later you can replace the rest of mock methods with real fetch calls:
  // getMyProblems(), getMySolutions(), getChatMessages(), getPayments(), etc.
};
