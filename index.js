import express from 'express';
import axios from 'axios';
import morgan from 'morgan';
import path from 'path';
import { PORT } from './config/puerto.js';
import aeropuertoRoutes from './routes/aeropuerto.rute.js';
import clienteRoutes from './routes/cliente.rute.js';
import adminRouter from './routes/admin.rute.js';
const App = express();
const __dirname = path.resolve();

// Middleware para procesar JSON

App.use(express.json());
App.use(morgan('dev'))


App.use(express.static(path.join(__dirname, 'client')));


// Ruta inicial
App.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// Ruta para obtener datos de ejemplo desde un servicio externo
App.get('/api/aeropuertos', async (req, res) => {
    try {
        const respuesta = await axios.get('https://jsonplaceholder.typicode.com/posts'); // URL de ejemplo
        res.json(respuesta.data); // Devuelve los datos obtenidos al cliente
    } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
        res.status(500).send('Error al obtener los datos externos.');
    }
});

// Rutas de aeropuertos
App.use(aeropuertoRoutes);
App.use(clienteRoutes);
App.use(adminRouter);

// Inicialización del servidor
App.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});


