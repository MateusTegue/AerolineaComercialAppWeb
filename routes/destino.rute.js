import { Router } from "express";
import { registrarDestino } from "../controllers/destino.controller.js";
import { mostrarDestinos } from "../controllers/destino.controller.js";
import { actualizarDestino } from "../controllers/destino.controller.js";
import { borrarDestino } from "../controllers/destino.controller.js";
import { buscarDestino } from "../controllers/destino.controller.js"; // Importamos la función buscar

const router = Router();

// Ruta para registrar destino
router.post("/api/destino", registrarDestino);

// Ruta para mostrar destinos
router.get("/api/destino", mostrarDestinos);

// Ruta para buscar destino por ID
router.get("/api/destino/:id", buscarDestino);  // Nueva ruta

// Ruta para actualizar destinos
router.put("/api/destino/:id", actualizarDestino);

// Ruta para eliminar destinos
router.delete("/api/destino/:id", borrarDestino);

export default router;
