import axiosClient from "./axiosClient";

export interface Me {
  userId: number;
  name: string;
  email: string;
}

// Profile of the logged-in user (the token identifies who it is)
export async function getMe(): Promise<Me> {
  const { data } = await axiosClient.get<Me>("/api/auth/me");
  return data;
}

// Changes the logged-in user's password
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  const { data } = await axiosClient.put("/api/auth/password", {
    currentPassword,
    newPassword,
  });
  return data;
}