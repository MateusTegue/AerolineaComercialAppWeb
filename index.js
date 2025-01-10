import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { PORT } from './config/puerto.js';
import aeropuertoRoutes from './routes/aeropuerto.rute.js';
import destinoRoutes from './routes/destino.rute.js';
import pasajeroRoutes from './routes/pasajero.rute.js';
import tiqueteRouter from './routes/tiquete.rute.js';
import empleadoRouter from './routes/empleado.rute.js';
import tripulacionRouter from './routes/tripulacion.rute.js'
import avionRouter from './routes/avion.rute.js'
import mantenimientoRouter from './routes/mantenimiento.rute.js'
import viajeRouter from './routes/viaje.rute.js'
import clienteRoutes from './routes/cliente.rute.js';
import adminRouter from './routes/admin.rute.js';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.rute.js";
const App = express();
const __dirname = path.resolve();


const corsOptions = {
    origin: [
        'http://localhost:3000', 
        'https://rcr3j6l1-3000.use.devtunnels.ms',  // Asegúrate de que esta URL también esté permitida
        
    ],
};
App.use(cors(corsOptions));



// configuracion de las funciones que permiten a el proyecto manejar los datos de los formularios 
App.use(express.urlencoded({ extended: true })); 
// configurar las cookies del sitio wed para que sea mas rapida la carga de la pagina
App.use(cookieParser()); // Para manejar cookies


// preparacion del modulo json para que la app puede leer los datos que se estan enviando
App.use(express.json());
// congiguracion del modulo morgan para que los mensajes del servidoe en modo desarrollo sea mas entendible 
App.use(morgan('dev'))

// configuracion de las carpeta que sirven los archos estaticos 
App.use(express.static(path.join(__dirname, 'client')));
App.use('/images', express.static(path.join(__dirname, 'images')));



// Ruta inicial
App.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});



// archivo para configurar el puerto, el cual se va a usar en el app.js para capturar los datos 
App.get('/api/config', (req, res) => {
    res.json({ port: PORT });
});

// archivo que manaja la logica para la captura de los datos desde el formulario html
App.use('/api', express.static(path.join(__dirname, 'api')));


App.use(aeropuertoRoutes);
App.use(destinoRoutes);
App.use(pasajeroRoutes);
App.use(tiqueteRouter);
App.use(empleadoRouter);
App.use(tripulacionRouter);
App.use(avionRouter);
App.use(mantenimientoRouter);
App.use(viajeRouter);
App.use(clienteRoutes);
App.use(adminRouter);
App.use(authRoutes);

// Inicialización del servidor
App.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});


