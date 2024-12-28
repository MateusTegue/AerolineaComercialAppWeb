import { Router } from "express";
import { registrarTripulacion } from "../controllers/tripulacion.controller.js";
import { mostrarTripulacion } from "../controllers/tripulacion.controller.js";
import { actualizarTripulacion } from "../controllers/tripulacion.controller.js";
import { borrarTripulacion } from "../controllers/tripulacion.controller.js";
import { buscarTripulacion } from "../controllers/tripulacion.controller.js"; // Importamos la función buscar

const router = Router();

// Ruta para registrar destino
router.post("/api/tripulacion", registrarTripulacion);

// Ruta para mostrar destinos
router.get("/api/tripulacion", mostrarTripulacion);

// Ruta para buscar destino por ID
router.get("/api/tripulacion/:id_tripulacion", buscarTripulacion);  // Nueva ruta

// Ruta para actualizar destinos
router.put("/api/tripulacion/:id_tripulacion", actualizarTripulacion);

// Ruta para eliminar destinos
router.delete("/api/tripulacion/:id_tripulacion", borrarTripulacion);

export default router;
