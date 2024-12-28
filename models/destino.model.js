import { database } from "../database/conexion.js"; 

// Crear destino
const crearDestino = async (pais_llegada, ciudad_llegada, id_aeropuerto) => {
  const query = {
    text: `INSERT INTO destino (pais_llegada, ciudad_llegada, id_aeropuerto) 
           VALUES ($1, $2, $3) RETURNING *`,
    values: [pais_llegada, ciudad_llegada, id_aeropuerto],
  };
  const { rows } = await database.query(query);
  return rows[0];
};

// Mostrar destinos registrados
const mostrarDestinosDB = async () => {
  const query = `
    SELECT d.id_destino, d.pais_llegada, d.ciudad_llegada, a.nombre 
    FROM destino d 
    JOIN aeropuerto a ON d.id_aeropuerto = a.id_aeropuerto
  `;
  const { rows } = await database.query(query);
  return rows;
};

// Buscar destino por ID
const buscarDestinoPorID = async (id_destino) => {
  const query = {
    text: `SELECT d.id_destino, d.pais_llegada, d.ciudad_llegada, a.nombre 
           FROM destino d 
           JOIN aeropuerto a ON d.id_aeropuerto = a.id_aeropuerto
           WHERE d.id_destino = $1`,
    values: [id_destino],
  };
  const { rows } = await database.query(query);
  return rows[0];  // Retorna el destino si lo encuentra
};

// Actualizar destino
const actualizarDestinoDB = async (pais_llegada, ciudad_llegada, id_aeropuerto, id_destino) => {
  try {
    const query = {
      text: `UPDATE destino SET pais_llegada = $1, ciudad_llegada = $2, id_aeropuerto = $3 
             WHERE id_destino = $4 RETURNING *`,
      values: [pais_llegada, ciudad_llegada, id_aeropuerto, id_destino],
    };
    const { rows } = await database.query(query);
    return rows[0]; // Devolver el destino actualizado
  } catch (error) {
    console.error("Error al actualizar el destino:", error);
    throw new Error("Error al actualizar el destino");
  }
};

// Borrar destino
const borrarDestinoDB = async (id_destino) => {
  try {
    const query = {
      text: `DELETE FROM destino WHERE id_destino = $1 RETURNING *`,
      values: [id_destino],
    };
    const { rows } = await database.query(query);
    if (rows.length === 0) {
      throw new Error("No se encontró el destino");
    }
    return rows[0];  // Retorna el destino borrado
  } catch (error) {
    console.error("Error al borrar el destino:", error);
    throw new Error("Error al borrar el destino");
  }
};

export const DestinoModel = {
  crearDestino,
  mostrarDestinosDB,
  buscarDestinoPorID, // Exportamos la nueva función
  actualizarDestinoDB,
  borrarDestinoDB,
};
