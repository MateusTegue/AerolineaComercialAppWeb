import { database } from "../database/conexion.js";

// Crear pasajeros
const crearPasajero = async (numerocedula, primernombre, segundonombre, primerapellido, segundoapellido, numerotelefono, correo) => {
    const query = {
        text: `INSERT INTO pasajero (numerocedula, primernombre, segundonombre, primerapellido, segundoapellido, numerotelefono, correo)
               VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        values: [numerocedula, primernombre, segundonombre, primerapellido, segundoapellido, numerotelefono, correo],
    };
    const { rows } = await database.query(query);
    return rows[0];
};

// Mostrar pasajeros
const mostrarPasajeros = async () => {
    const { rows } = await database.query("SELECT * FROM pasajero");
    return rows;
};


const obtenerPasajeroPorId = async (id_pasajero) => {
    try {
      const query = {
        text: `SELECT * FROM pasajero WHERE id_pasajero = $1`,
        values: [id_pasajero],
      };
      const { rows } = await database.query(query);
      return rows[0]; // Devuelve el pasajero encontrado o undefined si no existe
    } catch (error) {
      console.error("Error al obtener pasajero por ID:", error);
      throw new Error("Error al obtener el pasajero");
    }
  };

// metodo para obtener pasajero por numero de cedula 
export const obtenerPasajeroPorCedula = async (numerocedula) => {
  const query = {
      text: "SELECT * FROM pasajero WHERE numerocedula = $1",
      values: [numerocedula],
  };
  const { rows } = await database.query(query);
  return rows[0]; // Devuelve el pasajero si existe, de lo contrario null
};



// Actualizar pasajero
const actualizarPasajero = async (id_pasajero, primernombre, segundonombre, primerapellido, segundoapellido, numerotelefono, correo) => {
    try {
      const query = {
        text: `
          UPDATE pasajero
          SET primernombre = $2, segundonombre = $3, primerapellido = $4, segundoapellido = $5, numerotelefono = $6, correo = $7
          WHERE id_pasajero = $1
          RETURNING *`,
        values: [id_pasajero, primernombre, segundonombre, primerapellido, segundoapellido, numerotelefono, correo],
      };
      const { rows } = await database.query(query);
      return rows[0]; // Devuelve el pasajero actualizado
    } catch (error) {
      console.error("Error al actualizar pasajero:", error);
      throw new Error("Error al actualizar el pasajero");
    }
  };
  

  

// Eliminar pasajero
const eliminarPasajero = async (id_pasajero) => {
    try {
        const query = "DELETE FROM pasajero WHERE id_pasajero = $1 RETURNING *";
        const { rows } = await database.query( query,  [id_pasajero] );

        if (rows.length === 0) {
            throw new Error("Pasajero no encontrado");
            }
            return rows[0];
    } catch (error) {
        console.error("Error al eliminar pasajero:", error);
        throw new Error("Error al eliminar el pasajero");
        }
};




export const PasajeroModel = {
    crearPasajero,
    mostrarPasajeros,
    actualizarPasajero,
    eliminarPasajero,
    obtenerPasajeroPorId,
    obtenerPasajeroPorCedula

};
