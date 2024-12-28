import { Router } from "express";
import { registrarAeropuerto } from '../controllers/aeropuerto.controller.js';
import { mostrarAeropuertos } from '../controllers/aeropuerto.controller.js';
import { buscarAeropuertoPorNombre } from '../controllers/aeropuerto.controller.js';
import { obtenerAeropuertoPorId } from '../controllers/aeropuerto.controller.js';
import { actualizarAeropuerto } from '../controllers/aeropuerto.controller.js';
import { eliminarAeropuerto } from '../controllers/aeropuerto.controller.js';

const router = Router();

// Ruta para registrar aeropuertos
router.post("/api/aeropuertos", registrarAeropuerto);


// Ruta para mostrar aeropuertos
router.get("/api/aeropuertos", mostrarAeropuertos);


// Ruta para buscar aeropuertos por nombre
router.get("/api/aeropuertos/:nombre", buscarAeropuertoPorNombre);

//
router.get("/api/aeropuertosID/:id", obtenerAeropuertoPorId);

// ruta para actualizar el registro en la base de datos 
router.put("/api/aeropuertosID/:id", actualizarAeropuerto);

// ruta para eliminar registros de la base de datos
router.delete("/api/aeropuertosID/:id", eliminarAeropuerto);

export default router;
