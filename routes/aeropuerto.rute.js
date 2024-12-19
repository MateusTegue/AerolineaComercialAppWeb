import { Router } from "express";
import { registrarAeropuerto } from '../controllers/aeropuerto.controller.js';
import { mostrarAeropuertos } from '../controllers/aeropuerto.controller.js';
import { buscarAeropuertoPorNombre } from '../controllers/aeropuerto.controller.js';
const router = Router();

// Ruta para registrar aeropuertos
router.post("/api/aeropuertos", registrarAeropuerto);


// Ruta para mostrar aeropuertos
router.get("/api/aeropuertos", mostrarAeropuertos);


// Ruta para buscar aeropuertos por nombre
router.get("/api/aeropuertos/buscar/:nombre", buscarAeropuertoPorNombre);

// Ruta para buscar aeropuertos por nombre

export default router;
