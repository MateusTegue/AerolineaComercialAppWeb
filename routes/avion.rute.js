import { Router } from "express";
import { mostrarAvion, registrarAvion, buscarAvionID, borrarAvion, actualizarAvion } from "../controllers/avion.controller.js";

const router = Router();


router.post("/api/avion", registrarAvion)


// ruta para mostrar aviones
router.get("/api/avion", mostrarAvion );


// ruta para mostrar aviones por id 
router.get("/api/avion/:id_avion", buscarAvionID)

// ruta para actualizar aviones 
router.put("/api/avion/:id_avion", actualizarAvion);


// ruta para eliminar aviones 
router.delete("/api/avion/:id_avion", borrarAvion)






export default router;