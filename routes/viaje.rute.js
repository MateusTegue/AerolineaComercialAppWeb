import { Router } from "express";
import { registrarViaje } from "../controllers/viaje.controller.js";
import { mostrarViajes } from "../controllers/viaje.controller.js";
import { buscarMantenimientoID } from "../controllers/viaje.controller.js";
import { actualizarViaje } from "../controllers/viaje.controller.js";
import { eliminarViaje } from "../controllers/viaje.controller.js";

const router = Router();


// ruta para crear viajes
router.post('/api/viaje', registrarViaje);


// ruta para mostrar viajes
router.get('/api/viaje', mostrarViajes);


// ruta para buscar mantenimiento por id
router.get('/api/viaje/:id_viaje', buscarMantenimientoID);


// ruta para actualizar viajes
router.put('/api/viaje/:id_viaje', actualizarViaje);

// ruta para eliminar viajes
router.delete('/api/viaje/:id_viaje', eliminarViaje);



export default router;