import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/forget-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/generate-new-token", AuthController.generateNewToken)
router.get('/logout', AuthController.logout)

export const AuthRoutes = router;