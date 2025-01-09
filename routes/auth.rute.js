import express from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = express.Router();

// Ruta para el login


router.post("/api/user", AuthController.registroUsuario);


router.post("/login", AuthController.loginUsuario);


export default router;



