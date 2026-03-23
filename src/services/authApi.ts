import api from "./api";
//const API_BASE = "http://localhost:5000/api";

export async function generateTutorPlan(prompt: string,
  history?: string) {
  const res = await api.post("/ai/tutor/plan", {prompt, history});
  return res.data;
}

export async function generateTutorChat(message: string,
  history?: string) {
  const res = await api.post("/ai/tutor/chat", {message, history});
  return res.data;
}

export const startTestSession = async (data: any) => {
  const res = await api.post("/test/start", data);
  return res.data;
};

export const submitAnswerAPI = async (data: any) => {
  const res = await api.post("/test/submit-answer", data);
  return res.data;
};


export const getTestResultAPI = async (sessionId: string) => {
  const res = await api.get(`/test/result/${sessionId}`);
  return res.data;
};

export const getMyProfile = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const getGlobalAnalytics = async () => {
  const res = await api.get("/analytics/global");
  return res.data;
};

export const getStudyPlan = async () => {
  const res = await api.get("/analytics/study-plan");
  return res.data;
};


export const getLoginHistory = async () => {
  const res = await api.get("/auth/login-history");
  return res.data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const res = await api.put("/users/change-password", {
    currentPassword,
    newPassword,
  });

  return res.data;
};
