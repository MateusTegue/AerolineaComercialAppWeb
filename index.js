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


// Ruta para obtener los aeropuertos desde la base de datos
// Ya no es necesario hacer la consulta directamente en el index.js
App.use('/api', aeropuertoRoutes);  // Esta línea conecta las rutas de aeropuertos



// archivo para configurar el puerto, el cual se va a usar en el app.js para capturar los datos 
App.get('/api/config', (req, res) => {
    res.json({ port: PORT });
});

// archivo que manaja la logica para la captura de los datos desde el formulario html
App.use('/api', express.static(path.join(__dirname, 'api')));

// Rutas de aeropuertos
App.use(aeropuertoRoutes);
App.use(clienteRoutes);
App.use(adminRouter);

// Inicialización del servidor
App.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});


