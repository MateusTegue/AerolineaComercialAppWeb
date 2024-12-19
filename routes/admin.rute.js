import { Router } from "express";
import path from "path";

const router = Router();
const __dirname = path.resolve();

// ruta para la pagina de administrador 
router.get("/administracion", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'inicio.html'));

});

// ruta para registrar aeropuertos
router.get("/registrarAeropuerto", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'registrarAeropuerto.html'));
    });

// ruta para ir a inicio
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
    });

export default router;