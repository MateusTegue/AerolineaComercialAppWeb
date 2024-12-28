import { Router } from "express";
import { resgistrarTiquete } from "../controllers/tiquete.controller.js";
import { mostrarTiquetes } from "../controllers/tiquete.controller.js";
import { mostrarTiqueteId } from "../controllers/tiquete.controller.js";
import { borrarTiquete } from "../controllers/tiquete.controller.js";
import { actualizarTiquete } from "../controllers/tiquete.controller.js"





const router = Router();


// ruta para crear tiquetes
router.post('/api/tiquetes', resgistrarTiquete);

// ruta para mostrar tiquetes 
router.get('/api/tiquetes', mostrarTiquetes);

// ruta para mostrar por id 
router.get('/api/tiquetes/:id_tiquete', mostrarTiqueteId)

// ruta para ctualizar tiquetes 
router.put('/api/tiquetes/:id_tiquete', actualizarTiquete);

// ruta para eliminar tiquete
router.delete('/api/tiquetes/:id_tiquete', borrarTiquete);

















export default router; 