import { database } from "../database/conexion.js"; 

// Crear mantenimiento
const crearMantenimiento = async (descripcion , id_avion ) => {
    const query = {
      text: `INSERT INTO mantenimiento (descripcion , id_avion) 
             VALUES ($1, $2) RETURNING *`,
      values: [ descripcion, id_avion]
    };
    const { rows } = await database.query(query);
    return rows[0];
  };
  

// Mostrar mantenimientos  registrados
const mostrarMantenimiento = async () => {
    const query = `
      SELECT m.id_mantenimiento, m.descripcion, a.referencia, a.nombre, a.modelo, a.capacidad, a.id_avion 
      FROM mantenimiento m 
      JOIN avion a ON m.id_avion = a.id_avion
    `;
    const { rows } = await database.query(query);
    return rows;
  };
  
// Buscar mantenimiento por ID
const buscarMantenimientoID = async (id_mantenimiento) => {
    const query = {
      text: `SELECT m.id_mantenimiento, m.descripcion, a.id_avion, a.referencia, a.nombre, a.modelo, a.capacidad,  a.id_avion 
             FROM mantenimiento m 
             JOIN avion a ON m.id_avion = a.id_avion
             WHERE m.id_mantenimiento = $1`,
      values: [id_mantenimiento],
    };
    const { rows } = await database.query(query);
    return rows[0];
  };
  
// Actualizar destino
const actualizarMantenimiento = async (descripcion , id_avion, id_mantenimiento) => {
    try {
      const query = {
        text: `UPDATE mantenimiento SET descripcion = $1, id_avion = $2
               WHERE id_mantenimiento = $3 RETURNING *`,
        values: [ descripcion , id_avion, id_mantenimiento],
      };
      const { rows } = await database.query(query);
      return rows[0]; 
    } catch (error) {
      console.error("Error al actualizar el mantenimiento:", error);
      throw new Error("Error al actualizar el mantenimiento");
    }
  };
  

// Borrar destino
const borrarMantenimiento = async (id_mantenimiento) => {
  try {
    const query = {
      text: `DELETE FROM mantenimiento WHERE id_mantenimiento = $1 RETURNING *`,
      values: [id_mantenimiento],
    };
    const { rows } = await database.query(query);
    if (rows.length === 0) {
      throw new Error("No se encontró el mantenimiento");
    }
    return rows[0];  // Retorna el destino borrado
  } catch (error) {
    console.error("Error al borrar el mantenimiento:", error);
    throw new Error("Error al borrar el mantenimiento");
  }
};

export const MantenimientoModel = {
    crearMantenimiento,
    mostrarMantenimiento,
    buscarMantenimientoID,
    actualizarMantenimiento,
    borrarMantenimiento

};
