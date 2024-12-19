
import { Router } from "express";
import path from "path";

const router = Router();
const __dirname = path.resolve();


// ruta para registro de los clientes 
router.get("/registroCliente", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'clients', 'registroClientes.html'));
    });



// ruta para la página de clientes
router.get("/clientes", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'clients', 'inicio.html'));

});




// ruta para ir a inicio
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
    });

export default router;
