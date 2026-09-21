"use server";
import { IUser } from "@/types";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const loginUser = async (data: FieldValues) => {
  const cookieStore = await cookies();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.success && result.data) {
      cookieStore.set("accessToken", result.data.token, {
        httpOnly: true,
        secure: false,
        path: "/",
        maxAge: 1000 * 60 * 60 * 24,
      });
      cookieStore.set("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value || "";
    if (!accessToken) return null;

    return jwtDecode<IUser>(accessToken);
  } catch {
    return null;
  }
};

export const createStudentAccount = async (data: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/users/create-student`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    const result = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (data: { email: string; token: string }) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/users/verify-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    const result = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/forget-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );
    const result = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (data: { email: string; token: string; newPassword: string }) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    const result = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
};
