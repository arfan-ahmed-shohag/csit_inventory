"use server";

import { cookies } from "next/headers";

export const logoutUser = async () => {
  const cookieStore = await cookies();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/logout`, {
      method: "GET",
      credentials: "include",
    });

    const result = await res.json();

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return result;
  } catch (error) {
    throw error;
  }
};
