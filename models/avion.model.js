import { database } from "../database/conexion.js"; 

// Crear destino
const crearAvion = async (id_avion, referencia, nombre, modelo, capacidad, id_tripulacion) => {
    const query = {
      text: `INSERT INTO avion (id_avion, referencia, nombre, modelo, capacidad, id_tripulacion) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      values: [id_avion, referencia, nombre, modelo, capacidad, id_tripulacion],
    };
    const { rows } = await database.query(query);
    return rows[0];
  };
  

// Mostrar destinos registrados
const mostrarAvion = async () => {
    const query = `
      SELECT a.id_avion, a.referencia, a.nombre, a.modelo, a.capacidad, t.id_tripulacion, t.codigo 
      FROM avion a 
      JOIN tripulacion t ON a.id_tripulacion = t.id_tripulacion
    `;
    const { rows } = await database.query(query);
    return rows;
  };
  
// Buscar destino por ID
const buscarAvionID = async (id_avion) => {
    const query = {
      text: `SELECT a.id_avion, a.referencia, a.nombre, a.modelo, a.capacidad, t.id_tripulacion, t.codigo 
             FROM avion a 
             JOIN tripulacion t ON a.id_tripulacion = t.id_tripulacion
             WHERE a.id_avion = $1`,
      values: [id_avion],
    };
    const { rows } = await database.query(query);
    return rows[0];
  };
  
// Actualizar destino
const actualizarAvion = async (referencia, nombre, modelo, capacidad, id_tripulacion, id_avion) => {
    try {
      const query = {
        text: `UPDATE avion SET referencia = $1, nombre = $2, modelo = $3, capacidad = $4, id_tripulacion = $5
               WHERE id_avion = $6 RETURNING *`,
        values: [referencia, nombre, modelo, capacidad, id_tripulacion, id_avion],
      };
      const { rows } = await database.query(query);
      return rows[0]; 
    } catch (error) {
      console.error("Error al actualizar el avion:", error);
      throw new Error("Error al actualizar el avion");
    }
  };
  

// Borrar destino
const borrarAvion = async (id_avion) => {
  try {
    const query = {
      text: `DELETE FROM avion WHERE id_avion = $1 RETURNING *`,
      values: [id_avion],
    };
    const { rows } = await database.query(query);
    if (rows.length === 0) {
      throw new Error("No se encontró el avion");
    }
    return rows[0];  // Retorna el destino borrado
  } catch (error) {
    console.error("Error al borrar el avion:", error);
    throw new Error("Error al borrar el avion");
  }
};

export const AvionModel = {
    crearAvion,
    mostrarAvion,
    buscarAvionID,
    actualizarAvion,
    borrarAvion

};
