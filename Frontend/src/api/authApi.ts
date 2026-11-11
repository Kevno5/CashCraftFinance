import axiosClient from "./axiosClient";

export type Me = {
  userId: number;
  name: string;
  email: string;
};

export type ChangePasswordErrors = {
  currentPassword?: string;
  newPassword?: string;
};

// GET /api/auth/me returns the logged-in user
export async function getMe(): Promise<Me> {
  const response = await axiosClient.get<Me>("/api/auth/me");
  return response.data;
}

// PUT /api/auth/password changes the password
// 200 -> { message }
// 400 -> { message, errors: { currentPassword | newPassword } }
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  const response = await axiosClient.put<{ message: string }>(
    "/api/auth/password",
    { currentPassword, newPassword }
  );
  return response.data;
}
