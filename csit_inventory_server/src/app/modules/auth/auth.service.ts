import bcrypt from "bcrypt";
import crypto from "crypto";
import sendEmail from "../../../shared/mailSender";
import { jwtGenerator, jwtVerifier } from "../../../shared/jwtGenerator";
import { config } from "../../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";
import { UserRole, UserStatus } from "../../../../generated/prisma/enums";
import { StringValue } from "ms";
import AppError from "../../errors/appErrors";
import { resetPasswordTemplate } from "../../../utils/emailTemplates/resetPasswordTemplate";

const loginUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email, userStatus: UserStatus.ACTIVE },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (!user.isEmailVerified) {
    throw new AppError(400, "Email is not verified");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new AppError(400, "Invalid password");
  }

  if (user.role === UserRole.STUDENT) {
    const student = await prisma.student.findUnique({
      where: { email: user.email },
    });
    if (!student) {
      throw new AppError(404, "Student not found");
    }
    if (student && !student.isApproved) {
      throw new AppError(400, "Please wait for admin approval");
    }
  }

  if (user.userStatus !== UserStatus.ACTIVE) {
    throw new AppError(400, "User does not exist in the system");
  }

  const jwtInfo = {
    email: user.email,
    role: user.role,
  };

  const token = jwtGenerator({
    userInfo: jwtInfo,
    createSecretKey: config.jwt.token_secret as Secret,
    expiresIn: config.jwt.token_expires_in as StringValue,
  });
  const refreshToken = jwtGenerator({
    userInfo: jwtInfo,
    createSecretKey: config.jwt.refresh_token_secret as Secret,
    expiresIn: config.jwt.refresh_token_expires_in as StringValue,
  });

  return {
    token,
    refreshToken,
  };
};

const generateNewToken = async (refreshToken: string) => {
  console.log("refresh token", refreshToken);
  const decoded = jwtVerifier({
    token: refreshToken,
    secretKey: config.jwt.refresh_token_secret as Secret,
  }) as JwtPayload;

  const user = await prisma.user.findUnique({
    where: { email: decoded.email, userStatus: UserStatus.ACTIVE },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const jwtInfo = {
    email: user.email,
    role: user.role,
  };

  const newToken = jwtGenerator({
    userInfo: jwtInfo,
    createSecretKey: config.jwt.token_secret as Secret,
    expiresIn: config.jwt.token_expires_in as StringValue,
  });

  return newToken;
};

const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email, userStatus: UserStatus.ACTIVE },
  });

  if (!user) {
    throw new AppError(404, "User not found with this email");
  }

  const resetToken = jwtGenerator({
    userInfo: { email: user.email, role: user.role },
    createSecretKey: config.jwt.token_secret as Secret,
    expiresIn: "15m",
  });

  const clientBaseUrl = process.env.CLIENT_URL || "http://localhost:3000";
  const resetLink = `${clientBaseUrl}/reset-password?token=${resetToken}&email=${user.email}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: resetPasswordTemplate(resetLink),
    });
  } catch (err: any) {
    console.error("Email dispatch failed (SMTP error):", err.message);
  }

  return { message: "Password reset link sent to your email", resetLink };
};

const resetPassword = async (payload: { email: string; token: string; newPassword: string }) => {
  const { email, token, newPassword } = payload;

  const decoded = jwtVerifier({
    token,
    secretKey: config.jwt.token_secret as Secret,
  }) as JwtPayload;

  if (decoded.email !== email) {
    throw new AppError(400, "Invalid reset token or email mismatch");
  }

  const user = await prisma.user.findUnique({
    where: { email, userStatus: UserStatus.ACTIVE },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, Number(config.salt_rounds) || 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { message: "Password reset successfully" };
};

const logout = async () => {
  return null;
};

export const AuthService = {
  loginUser,
  generateNewToken,
  forgotPassword,
  resetPassword,
  logout,
};
