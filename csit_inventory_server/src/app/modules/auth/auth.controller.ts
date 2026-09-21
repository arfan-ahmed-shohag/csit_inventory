import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/responser";
import { AuthService } from "./auth.service";
import { config } from "../../../config";

const cookieOptions = {
  httpOnly: true,
  secure: config.node_env === "production",
  sameSite: "lax" as const,
  path: "/",
};

const dayToMs = (days: number) => days * 24 * 60 * 60 * 1000;

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await AuthService.loginUser({ email, password });
  const { refreshToken, token } = result;

  res.cookie("accessToken", token, {
    ...cookieOptions,
    maxAge: dayToMs(Number(config.jwt.token_expires_in?.split("d")[0])),
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: dayToMs(Number(config.jwt.refresh_token_expires_in?.split("d")[0])),
  });

  sendResponse(res, 200, "Login successful", result);
});

const generateNewToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await AuthService.generateNewToken(refreshToken);
  res.cookie("accessToken", result, {
    ...cookieOptions,
    maxAge: dayToMs(Number(config.jwt.token_expires_in?.split("d")[0])),
  });

  sendResponse(res, 200, "New token generated successfully", { data: result });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await AuthService.forgotPassword(email);
  sendResponse(res, 200, "Password reset link sent to your email", result);
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, token, newPassword } = req.body;
  const result = await AuthService.resetPassword({ email, token, newPassword });
  sendResponse(res, 200, "Password reset successfully", result);
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.logout();

  res.clearCookie("refreshToken", cookieOptions);
  res.clearCookie("accessToken", cookieOptions);

  sendResponse(res, 200, "Logout successful", result);
});

export const AuthController = {
  login,
  generateNewToken,
  forgotPassword,
  resetPassword,
  logout,
};
