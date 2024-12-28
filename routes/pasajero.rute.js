import express from "express";
import {
    registrarPasajero,
    mostrarPasajeros,
    actualizarPasajero,
    eliminarPasajero,
    obtenerPasajeroPorId
} from "../controllers/pasajero.controller.js";

const router = express.Router();

// Ruta para registrar un pasajero
router.post("/api/pasajeros", registrarPasajero);

// Ruta para mostrar los pasajeros
router.get("/api/pasajeros", mostrarPasajeros);

// Ruta para obtener un pasajero por ID
router.get('/api/pasajeros/:id', obtenerPasajeroPorId);

// Ruta para actualizar un pasajero
router.put('/api/pasajeros/:id', actualizarPasajero);

// Ruta para eliminar un pasajero
router.delete("/api/pasajeros/:id", eliminarPasajero);

export default router;
