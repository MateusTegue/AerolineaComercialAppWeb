import { database } from "../database/conexion.js";

// Crear un aeropuerto
const crearAeropuetos = async (nombre, ciudad, pais) => {
    const query = {
        text: `INSERT INTO aeropuerto (nombre, ciudad, pais) VALUES ($1, $2, $3) RETURNING *;`,
        values: [nombre, ciudad, pais],
    };

    const { rows } = await database.query(query);
    return rows[0];
};

// Mostrar todos los aeropuertos
const mostrarAeropuertos = async () => {
    const { rows } = await database.query("SELECT * FROM aeropuerto");
    return rows;
};

// Buscar un aeropuerto por nombre
const buscarAeropuertoPorNombre = async (nombre) => {
    const { rows } = await database.query("SELECT * FROM aeropuerto WHERE nombre = $1", [nombre]);
    return rows[0];
};

// Obtener un aeropuerto por ID
export const obtenerAeropuertoPorId = async (id_aeropuerto) => {
    const { rows } = await database.query("SELECT * FROM aeropuerto WHERE id_aeropuerto = $1", [id_aeropuerto]);
    return rows[0];
};


// metodo para actualizar
// Función en el modelo (actualiza la base de datos)
export const actualizarAeropuertoDB = async (id_aeropuerto, nombre, ciudad, pais) => {
    try {
        const query = 'UPDATE aeropuerto SET nombre = $1, ciudad = $2, pais = $3 WHERE id_aeropuerto = $4 RETURNING *';
        const result = await database.query(query, [nombre, ciudad, pais, id_aeropuerto]);
        return result.rows[0];  // Retorna el aeropuerto actualizado
    } catch (error) {
        console.error('Error al actualizar el aeropuerto:', error);
        throw new Error('Error al actualizar el aeropuerto');
    }
};








// Función para eliminar aeropuertos
export const eliminarAeropuertosDB = async (id_aeropuerto) => {
    try {
        const query = "DELETE FROM aeropuerto WHERE id_aeropuerto = $1 RETURNING *";
        const { rows } = await database.query(query, [id_aeropuerto]);

        if (rows.length === 0) {
            throw new Error("No se encontró el aeropuerto con el ID proporcionado");
        }

        return rows[0]; 
    } catch (error) {
        console.error("Error al eliminar el aeropuerto:", error);
        throw new Error("Error al eliminar el aeropuerto");
    }
}; 


// Exportar funciones
export const AeropuertoModel = {
    crearAeropuetos,
    mostrarAeropuertos,
    buscarAeropuertoPorNombre,
    obtenerAeropuertoPorId,
    actualizarAeropuertoDB,
    eliminarAeropuertosDB
};
