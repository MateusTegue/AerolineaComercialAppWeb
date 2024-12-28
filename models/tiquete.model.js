import { ro } from "date-fns/locale";
import { database } from "../database/conexion.js"; 


// metodo para crear tiquetes 
const crearTiqueteDB = async (fecha , id_pasajero  ) => {
    const query = {
        text: `INSERT INTO tiquete (fecha , id_pasajero )
        VALUES ($1 , $2 ) RETURNING *`,
        values: [fecha , id_pasajero ],
    };

    const {rows} = await database.query(query);
    return rows[0];
};

// mostrar tiquetes 
const mostrarTiquetesDB = async () => {
    const query = `
        SELECT  t.id_tiquete, t.fecha, p.numerocedula , p.primernombre, p.primerapellido
        FROM tiquete t
        JOIN pasajero p ON t.id_pasajero = p.id_pasajero`;

        const {rows} = await database.query(query);
        return rows;
    
};


// obtener tiquete por id
const mostrarPoridDB = async (id_tiquete) => {
    const { rows } = await database.query("SELECT * FROM tiquete WHERE id_tiquete = $1", [id_tiquete]);
    return rows[0];
}


// actualizar tiquete
const actualizarTiquete = async (fecha, numerocedula, id_tiquete) => {
    try {
        // Actualizar la fecha en la tabla `tiquete`
        const actualizarTiqueteQuery = {
            text: `UPDATE tiquete SET fecha = $1 WHERE id_tiquete = $2 RETURNING *`,
            values: [fecha, id_tiquete],
        };

        const { rows: tiqueteRows } = await database.query(actualizarTiqueteQuery);
        if (!tiqueteRows.length) {
            throw new Error("Tiquete no encontrado");
        }

        const id_pasajero = tiqueteRows[0].id_pasajero;

        // Actualizar el numerocedula en la tabla `pasajero`
        const actualizarPasajeroQuery = {
            text: `UPDATE pasajero SET numerocedula = $1 WHERE id_pasajero = $2 RETURNING *`,
            values: [numerocedula, id_pasajero],
        };

        const { rows: pasajeroRows } = await database.query(actualizarPasajeroQuery);
        if (!pasajeroRows.length) {
            throw new Error("Pasajero no encontrado");
        }

        return {
            tiquete: tiqueteRows[0],
            pasajero: pasajeroRows[0],
        };
    } catch (error) {
        console.error("Error al actualizar el tiquete", error);
        throw new Error("Error al actualizar el tiquete");
    }
};




// Eliminar tiquete
const eliminarTiqueteDB = async (id_tiquete) => {
    try {
        const query = {
            text: `DELETE FROM tiquete WHERE id_tiquete = $1 RETURNING *`,
            values: [id_tiquete],
        }
        const {rows} = await database.query(query);
        if(rows.length === 0 ){
            throw new Error("No se encontró el tiquete");
        }
        return rows[0];

    } catch (error){
        console.error("Error al borrar el tiquete", error);
        throw new Error("Error al borrar el tiquete");
    }
}












export const TiqueteModel = {
    crearTiqueteDB,
    mostrarTiquetesDB,
    mostrarPoridDB,
    actualizarTiquete,
    eliminarTiqueteDB
    
}




