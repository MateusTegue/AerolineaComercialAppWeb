import { Router } from "express";
import { registrarMantenimiento } from "../controllers/mantenimiento.controller.js"
import { mostrarMantenimiento } from "../controllers/mantenimiento.controller.js"
import { buscarMantenimientoID } from "../controllers/mantenimiento.controller.js"
import { actualizarMantenimiento } from "../controllers/mantenimiento.controller.js"
import { eliminarMantenimiento } from "../controllers/mantenimiento.controller.js"



const router = Router();

// ruta para crear mantenimientos
router.post('/api/mantenimiento', registrarMantenimiento);

// ruta para mostrar mantenimientos
router.get('/api/mantenimiento', mostrarMantenimiento);

// ruta para buscar mantenimiento por id
router.get('/api/mantenimiento/:id_mantenimiento', buscarMantenimientoID);

// ruta para actualizar mantenimienos 
router.put('/api/mantenimiento/:id_mantenimiento', actualizarMantenimiento);

// rura para eliminar mantenimiento 
router.delete('/api/mantenimiento/:id_mantenimiento', eliminarMantenimiento);






export default router ;