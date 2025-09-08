const API_BASE = "http://localhost:5000";

export const api = {
  // Problems
  getProblems: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/problems`);
      if (!res.ok) throw new Error("Failed to fetch problems");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  postProblem: async (formData, getToken) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/problems`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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

  getProblem: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/problems/${id}`);
      if (!res.ok) throw new Error("Failed to fetch problem");
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  getMyProblems: async (getToken) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/problems/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch my problems");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  getProblemSolutions: async (problemId, getToken) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/problems/${problemId}/solutions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch problem solutions");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  submitSolution: async (problemId, explanation, files, getToken) => {
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("explanation", explanation);
      files.forEach(file => formData.append("files", file));

      const res = await fetch(`${API_BASE}/api/solutions/${problemId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData, // browser sets content-type automatically
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to submit solution");
      }

      return await res.json();
    } catch (err) {
      console.error("❌ submitSolution error:", err);
      throw err;
    }
  },

  getMySolutions: async (getToken) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/solutions/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to fetch my solutions");
      }

      return await res.json();
    } catch (err) {
      console.error("❌ getMySolutions error:", err);
      throw err;
    }
  },
};
