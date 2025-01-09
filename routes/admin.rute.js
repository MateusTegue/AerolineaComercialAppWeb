import { Router } from "express";
import path from "path";
import { verificarAutenticacion } from "../middlewares/auth.middlewars.js";


const router = Router();
const __dirname = path.resolve();




// ruta para la pagina de administrador 
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'login.html'));
});


router.get("/administracion", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'inicio.html'));
});



// ruta para el CRUD de aeropuertos
router.get("/Aeropuerto", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'crud_aeropuerto.html'));
    });

// ruta para el CRUD de destino
router.get("/Destino", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'crud_destino.html'));
    });

router.get("/Pasajero" , (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'crud_pasajero.html'));
        });
        
router.get("/Tiquete", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'crud_tiquete.html'));
    });

router.get("/Empleado", (req , res ) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'crud_empleado.html'));
})

router.get("/Tripulacion", (req,  res) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'crud_tripulacion.html'))
})

router.get("/Avion", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'crud_avion.html'));
    })

router.get("/Mantenimiento", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'crud_mantenimiento.html'));
    })

router.get("/Viaje", (req , res) => {
    res.sendFile(path.join(__dirname, 'client', 'admin', 'crud_viaje.html'))
})


// ruta para ir a inicio
router.get("/", (req, res) => {
    res.sendFile(path.json(__dirname, 'client', 'index.html'));
    });

export default router;