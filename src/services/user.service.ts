import API from "./api";

export const getMyProfile = () => {
  return API.get("/users/me");
};

export const updateMyProfile = (data: {
  name?: string;
  phone?: string;
  role?: string;
}) => {
  return API.put("/users/me", data);
};
