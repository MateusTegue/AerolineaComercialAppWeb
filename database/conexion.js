import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

// configuracion de la variable que llama la configuracion de la conexion de la base de datos
const connectionString = process.env.DATABASE_URL;

export const database = new Pool({ allowExitOnIdle: true, connectionString});

// probar la conexion de la base de datos 
try{
    database.query('SELECT NOW()');
    console.log("Se ha conectado correctamenre a la base de datos!")
} catch (error) {

    console.log("Error al conectar a la base de datos: ", error)
 }  // fin de la prueba de la conexion