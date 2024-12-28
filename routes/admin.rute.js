import { Router } from "express";
import path from "path";

const router = Router();
const __dirname = path.resolve();

// ruta para la pagina de administrador 
router.get("/administracion", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'inicio.html'));

});

// ruta para el CRUD de aeropuertos
router.get("/registrarAeropuerto", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'crud_aeropuerto.html'));
    });

// ruta para el CRUD de destino
router.get("/registrarDestino", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'crud_destino.html'));
    });

router.get("/registrarPasajero" , (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'crud_pasajero.html'));
        });
        
router.get("/registrarTiquete", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'crud_tiquete.html'));
    });

router.get("/registrarEmpleado", (req , res ) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'crud_empleado.html'));
})

router.get("/registrarTripulacion", (req,  res) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'crud_tripulacion.html'))
})


// ruta para ir a inicio
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
    });

export default router;