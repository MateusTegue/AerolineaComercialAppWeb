import { database } from "../database/conexion.js"; 



// Crear tripulacion
const crearTripulacion = async (codigo, numerocedula) => {
  const query = {
    text: `INSERT INTO tripulacion ( codigo , numerocedula ) 
           VALUES ($1, $2) RETURNING *`,
    values: [ codigo, numerocedula],
  };
  const { rows } = await database.query(query);
  return rows[0];
};

// Mostrar destinos registrados
const mostrarTripulacion = async () => {
  const query = `
    SELECT t.id_tripulacion, t.codigo , e.numerocedula,  e.primernombre, e.primerapellido 
    FROM tripulacion t 
    JOIN empleado e ON t.numerocedula = e.numerocedula
  `;
  const { rows } = await database.query(query);
  return rows;
};

// Buscar destino por ID
const mostrarTripulacionPorID = async (id_tripulacion) => {
  const query = {
    text: `SELECT t.id_tripulacion, t.codigo,  e.numerocedula, e.primernombre, e.primerapellido 
           FROM tripulacion t 
           JOIN empleado e ON e.numerocedula = e.numerocedula
           WHERE t.id_tripulacion = $1`,
    values: [id_tripulacion],
  };
  const { rows } = await database.query(query);
  return rows[0];  // Retorna el destino si lo encuentra
};

// Actualizar tripulacion
const actualizarTripulacion = async (codigo, numerocedula, id_tripulacion) => {
  try {
    const query = {
      text: `UPDATE tripulacion SET codigo = $1, numerocedula = $2 WHERE id_tripulacion = $3 RETURNING *`,
      values: [codigo, numerocedula, id_tripulacion], // Asegúrate de incluir los tres valores
    };
    const { rows } = await database.query(query);
    return rows[0]; // Devolver el destino actualizado
  } catch (error) {
    console.error("Error al actualizar la tripulacion:", error);
    throw new Error("Error al actualizar la tripulacion");
  }
};


// Borrar destino
const borrarTripulacion = async (id_tripulacion) => {
  try {
    const query = {
      text: `DELETE FROM tripulacion WHERE id_tripulacion = $1 RETURNING *`,
      values: [id_tripulacion],
    };
    const { rows } = await database.query(query);
    if (rows.length === 0) {
      throw new Error("No se encontró la tripulacion");
    }
    return rows[0];  // Retorna el destino borrado
  } catch (error) {
    console.error("Error al borrar la tripulacion:", error);
    throw new Error("Error al borrar la tripulacion");
  }
};

export const TripulacionModel = {
    crearTripulacion,
    mostrarTripulacion,
    mostrarTripulacionPorID,
    actualizarTripulacion,
    borrarTripulacion
}
