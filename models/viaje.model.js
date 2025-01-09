import { database } from "../database/conexion.js";

// Crear viaje
const crearViaje = async (pais_salida, ciudad_salida, id_tiquete, id_avion, id_destino, id_tripulacion) => {
  const query = {
    text: `INSERT INTO viaje (pais_salida, ciudad_salida, id_tiquete, id_avion, id_destino, id_tripulacion) 
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    values: [pais_salida, ciudad_salida, id_tiquete, id_avion, id_destino, id_tripulacion],
  };
  const { rows } = await database.query(query);
  return rows[0];
};

// Mostrar viajes registrados
const mostrarViajes = async () => {
  const query = `
    SELECT v.id_viaje, v.pais_salida, v.ciudad_salida, t.id_tiquete, a.id_avion, d.id_destino, r.id_tripulacion 
    FROM viaje v 
    JOIN tiquete t ON v.id_tiquete = t.id_tiquete
    JOIN avion a ON v.id_avion = a.id_avion
    JOIN destino d ON v.id_destino = d.id_destino
    JOIN tripulacion r ON v.id_tripulacion = r.id_tripulacion
  `;
  const { rows } = await database.query(query);
  return rows;
};

// Buscar viaje por ID
const buscarViajePorID = async (id_viaje) => {
  const query = {
    text: `SELECT v.id_viaje, v.pais_salida, v.ciudad_salida, t.id_tiquete, a.id_avion, d.id_destino, r.id_tripulacion
           FROM viaje v
           JOIN tiquete t ON v.id_tiquete = t.id_tiquete
           JOIN avion a ON v.id_avion = a.id_avion
           JOIN destino d ON v.id_destino = d.id_destino
           JOIN tripulacion r ON v.id_tripulacion = r.id_tripulacion
           WHERE v.id_viaje = $1`,
    values: [id_viaje],
  };
  const { rows } = await database.query(query);
  return rows[0];
};

// Actualizar viaje
const actualizarViaje = async (pais_salida, ciudad_salida, id_tiquete, id_avion, id_destino, id_tripulacion, id_viaje) => {
  const query = {
    text: `UPDATE viaje 
           SET pais_salida = $1, ciudad_salida = $2, id_tiquete = $3, id_avion = $4, id_destino = $5, id_tripulacion = $6
           WHERE id_viaje = $7 RETURNING *`,
    values: [pais_salida, ciudad_salida, id_tiquete, id_avion, id_destino, id_tripulacion, id_viaje],
  };
  const { rows } = await database.query(query);
  return rows[0];
};

// Borrar viaje
const borrarViaje = async (id_viaje) => {
  const query = {
    text: `DELETE FROM viaje WHERE id_viaje = $1 RETURNING *`,
    values: [id_viaje],
  };
  const { rows } = await database.query(query);
  if (rows.length === 0) {
    throw new Error("No se encontró el viaje");
  }
  return rows[0]; // Retorna el viaje borrado
};

export const ViajeModel = {
  crearViaje,
  mostrarViajes,
  buscarViajePorID,
  actualizarViaje,
  borrarViaje,
};
