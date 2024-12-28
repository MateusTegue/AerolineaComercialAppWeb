import { Router } from "express";
import { registrarEmpleado } from "../controllers/empleado.controller.js";
import { mostrarEmpleados } from "../controllers/empleado.controller.js";
import {obtenerPasajeroPorcedula} from "../controllers/empleado.controller.js"
import { eliminarEmpleado } from "../controllers/empleado.controller.js"
import { actualizarEmpleado } from "../controllers/empleado.controller.js"
const router = Router();

// ruta para registrar empleados 
router.post("/api/empleados", registrarEmpleado);


// ruta para mostrar empleados 
router.get("/api/empleados", mostrarEmpleados);

// ruta para actualizar empleados
router.put("/api/empleados/:numerocedula", actualizarEmpleado)



// ruta para obtener empleados por cedula 
router.get("/api/empleados/:numerocedula", obtenerPasajeroPorcedula);

// ruta para eliminar empleados 
router.delete("/api/empleados/:numerocedula", eliminarEmpleado)






export default router;